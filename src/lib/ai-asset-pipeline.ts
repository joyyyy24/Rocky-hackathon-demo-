import type { BuildAsset } from "@/lib/asset-generator";

export interface StylePack {
  theme: string;
  palette: string[];
  materials: string[];
  motifs: string[];
  silhouetteLanguage: string[];
  recommendedCategories: string[];
  visualKeywords: string[];
}

export interface AssetSpec {
  id: string;
  name: string;
  category: string;
  shapeFamily: string;
  material: string;
  primaryColor: string;
  accentColor: string;
  ornaments: string[];
  silhouette: string;
  sizeClass: "small" | "medium" | "large";
  previewHint: string;
  templateKey: string;
}

export interface ObjectPack {
  request: string;
  seed: string;
  variationStrategy: string;
  assets: AssetSpec[];
}

interface GenerateObjectPackArgs {
  apiKey: string;
  stylePack: StylePack;
  addPrompt: string;
  seed: string;
  recentHistory: {
    assetIds: string[];
    categories: string[];
    silhouettes: string[];
    ornaments: string[];
    colors: string[];
  };
  mode: "apply" | "add" | "refresh";
  count: number;
}

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const TEMPLATE_LIBRARY: Record<
  string,
  { type: BuildAsset["type"]; previewShape: string; category: string; silhouette: string }
> = {
  gate_wide: { type: "gate", previewShape: "gate-wide", category: "structure", silhouette: "wide" },
  gate_tall: { type: "gate", previewShape: "gate-tall", category: "structure", silhouette: "tall" },
  gate_arch: { type: "gate", previewShape: "gate-arch", category: "structure", silhouette: "arched" },
  wall_segment_plain: { type: "block", previewShape: "wall-plain", category: "structure", silhouette: "flat" },
  wall_segment_decorated: { type: "block", previewShape: "wall-decor", category: "structure", silhouette: "flat" },
  tower_round: { type: "tower", previewShape: "tower-round", category: "landmark", silhouette: "tall" },
  tower_square: { type: "tower", previewShape: "tower-square", category: "landmark", silhouette: "tall" },
  roof_pyramid: { type: "roof", previewShape: "roof-pyramid", category: "structure", silhouette: "pointed" },
  roof_layered: { type: "roof", previewShape: "roof-layered", category: "structure", silhouette: "layered" },
  roof_curved: { type: "roof", previewShape: "roof-curved", category: "structure", silhouette: "curved" },
  obelisk_small: { type: "column", previewShape: "obelisk-small", category: "landmark", silhouette: "slim" },
  obelisk_tall: { type: "column", previewShape: "obelisk-tall", category: "landmark", silhouette: "needle" },
  stairs_broad: { type: "stairs", previewShape: "stairs-broad", category: "connector", silhouette: "wide" },
  stairs_steep: { type: "stairs", previewShape: "stairs-steep", category: "connector", silhouette: "stepped" },
  banner_single: { type: "banner", previewShape: "banner-single", category: "decorative", silhouette: "slim" },
  banner_double: { type: "banner", previewShape: "banner-double", category: "decorative", silhouette: "split" },
  palm_small: { type: "tree", previewShape: "tree-small", category: "nature", silhouette: "round" },
  palm_cluster: { type: "tree", previewShape: "tree-cluster", category: "nature", silhouette: "cluster" },
  statue_guardian: { type: "statue", previewShape: "statue-guardian", category: "landmark", silhouette: "solid" },
  courtyard_platform: { type: "block", previewShape: "courtyard", category: "connector", silhouette: "flat" },
  bridge_short: { type: "stairs", previewShape: "bridge-short", category: "connector", silhouette: "arched" },
  bridge_ceremonial: { type: "stairs", previewShape: "bridge-ceremonial", category: "connector", silhouette: "arched" },
  lantern_post: { type: "torch", previewShape: "lantern-post", category: "decorative", silhouette: "slim" },
  crystal_pond: { type: "pond", previewShape: "pond-crystal", category: "nature", silhouette: "oval" },
  carved_rock: { type: "rock", previewShape: "rock-carved", category: "decorative", silhouette: "chunky" },
};

const TEMPLATE_KEYS = Object.keys(TEMPLATE_LIBRARY);

function hashSeed(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h >>> 0);
}

function clampHex(value: number) {
  return Math.max(25, Math.min(235, Math.round(value)));
}

function ensureHex(input: string, fallback: string) {
  const v = input.trim();
  return /^#[0-9a-fA-F]{6}$/.test(v) ? v : fallback;
}

function shiftColor(hex: string, seed: number) {
  const safe = ensureHex(hex, "#9ca3af");
  const n = Number.parseInt(safe.slice(1), 16);
  const delta = (seed % 65) - 32;
  const r = clampHex(((n >> 16) & 255) + delta);
  const g = clampHex(((n >> 8) & 255) + (delta * 0.6));
  const b = clampHex((n & 255) - (delta * 0.3));
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

function extractJson(raw: string) {
  const cleaned = raw.replace(/```json|```/g, "").trim();
  const objStart = cleaned.indexOf("{");
  const objEnd = cleaned.lastIndexOf("}");
  if (objStart >= 0 && objEnd > objStart) return cleaned.slice(objStart, objEnd + 1);
  return cleaned;
}

async function geminiJson<T>(apiKey: string, prompt: string): Promise<T> {
  const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 1.1, topP: 0.92, maxOutputTokens: 1500 },
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Gemini error: ${await response.text()}`);
  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof text !== "string" || !text.trim()) throw new Error("Gemini empty content");
  return JSON.parse(extractJson(text)) as T;
}

export async function generateStylePack(
  apiKey: string,
  stylePrompt: string,
): Promise<StylePack> {
  const prompt = [
    "Return ONE JSON object only (no markdown).",
    "You are a creative director for a kids fantasy building game.",
    "Create a coherent style pack from the prompt.",
    "Schema:",
    '{ "theme":"", "palette":["#RRGGBB"], "materials":[""], "motifs":[""], "silhouetteLanguage":[""], "recommendedCategories":["structure|landmark|decorative|connector|nature"], "visualKeywords":[""] }',
    "Rules:",
    "- palette length: 5 to 7 distinct colors",
    "- each list length: 4 to 8",
    "- child-friendly, magical, clear motifs",
    `Style prompt: ${stylePrompt}`,
  ].join("\n");

  const parsed = await geminiJson<Partial<StylePack>>(apiKey, prompt);
  const fallbackTheme = stylePrompt.trim() || "Fantasy Playground";
  const palette = Array.isArray(parsed.palette) ? parsed.palette : [];
  return {
    theme: parsed.theme?.trim() || fallbackTheme,
    palette: palette.slice(0, 7).map((c, i) => ensureHex(c, ["#d6b36a", "#f2deb5", "#7ea3d8", "#8bcf8a", "#b08ad9"][i % 5])),
    materials: Array.isArray(parsed.materials) && parsed.materials.length ? parsed.materials.slice(0, 8) : ["stone", "wood", "ceramic", "cloth"],
    motifs: Array.isArray(parsed.motifs) && parsed.motifs.length ? parsed.motifs.slice(0, 8) : ["arches", "lanterns", "carved trim", "banners"],
    silhouetteLanguage:
      Array.isArray(parsed.silhouetteLanguage) && parsed.silhouetteLanguage.length
        ? parsed.silhouetteLanguage.slice(0, 8)
        : ["tall", "layered", "curved", "balanced"],
    recommendedCategories:
      Array.isArray(parsed.recommendedCategories) && parsed.recommendedCategories.length
        ? parsed.recommendedCategories.slice(0, 8)
        : ["structure", "landmark", "connector", "decorative", "nature"],
    visualKeywords:
      Array.isArray(parsed.visualKeywords) && parsed.visualKeywords.length
        ? parsed.visualKeywords.slice(0, 8)
        : [fallbackTheme, "storybook", "playful", "soft fantasy"],
  };
}

export async function generateObjectPack(args: GenerateObjectPackArgs): Promise<ObjectPack> {
  const { apiKey, stylePack, addPrompt, seed, recentHistory, mode, count } = args;
  const prompt = [
    "Return ONE JSON object only.",
    "You are generating a diverse object pack for a voxel-like kid builder.",
    "Schema:",
    '{ "request":"", "seed":"", "variationStrategy":"", "assets":[{ "id":"", "name":"", "category":"structure|landmark|decorative|connector|nature", "shapeFamily":"", "material":"", "primaryColor":"#RRGGBB", "accentColor":"#RRGGBB", "ornaments":[""], "silhouette":"", "sizeClass":"small|medium|large", "previewHint":"", "templateKey":"" }] }',
    `Allowed templateKey values: ${TEMPLATE_KEYS.join(", ")}`,
    "Diversity rules:",
    "- max 2 assets per same category",
    "- at least 4 unique silhouettes",
    "- at least 3 distinct previewHint styles",
    "- avoid categories/silhouettes/ornaments/colors from history if possible",
    `Current style pack: ${JSON.stringify(stylePack)}`,
    `Request: ${addPrompt || "style starter pack"}`,
    `Mode: ${mode}`,
    `Seed: ${seed}`,
    `Recent history: ${JSON.stringify(recentHistory).slice(0, 1800)}`,
    `Asset count: ${count}`,
  ].join("\n");

  const parsed = await geminiJson<Partial<ObjectPack>>(apiKey, prompt);
  const assets = Array.isArray(parsed.assets) ? parsed.assets : [];
  const normalized: AssetSpec[] = assets
    .map((raw, i) => {
      const item = raw as Partial<AssetSpec>;
      const templateKey =
        typeof item.templateKey === "string" && TEMPLATE_LIBRARY[item.templateKey]
          ? item.templateKey
          : TEMPLATE_KEYS[(hashSeed(`${seed}-${i}`) + i) % TEMPLATE_KEYS.length];
      const lib = TEMPLATE_LIBRARY[templateKey];
      const pColor = ensureHex(item.primaryColor || "", stylePack.palette[i % stylePack.palette.length] || "#d6b36a");
      const aColor = ensureHex(item.accentColor || "", shiftColor(pColor, i * 9 + 17));
      return {
        id: item.id?.trim() || `${templateKey}-${hashSeed(`${seed}-${i}`).toString(36)}`,
        name: item.name?.trim() || `${stylePack.theme} ${templateKey.replace(/_/g, " ")}`.slice(0, 28),
        category: item.category?.trim() || lib.category,
        shapeFamily: item.shapeFamily?.trim() || templateKey.split("_")[0],
        material: item.material?.trim() || stylePack.materials[i % stylePack.materials.length] || "stone",
        primaryColor: pColor,
        accentColor: aColor,
        ornaments: Array.isArray(item.ornaments) ? item.ornaments.slice(0, 4) : [stylePack.motifs[i % stylePack.motifs.length] || "trim"],
        silhouette: item.silhouette?.trim() || lib.silhouette,
        sizeClass: item.sizeClass === "small" || item.sizeClass === "large" ? item.sizeClass : "medium",
        previewHint: item.previewHint?.trim() || lib.previewShape,
        templateKey,
      };
    })
    .slice(0, count);

  return {
    request: parsed.request?.trim() || addPrompt,
    seed: parsed.seed?.trim() || seed,
    variationStrategy: parsed.variationStrategy?.trim() || "category-spread + silhouette-rotation + palette-shift",
    assets: normalized,
  };
}

function templateToType(templateKey: string): BuildAsset["type"] {
  return TEMPLATE_LIBRARY[templateKey]?.type || "block";
}

export function mapAssetSpecsToLocalTemplates(
  assetSpecs: AssetSpec[],
  stylePack: StylePack,
): BuildAsset[] {
  const usedTemplate = new Set<string>();
  return assetSpecs.map((spec, index) => {
    let templateKey = spec.templateKey;
    if (usedTemplate.has(templateKey)) {
      templateKey = TEMPLATE_KEYS[(hashSeed(`${spec.id}-${index}`) + index) % TEMPLATE_KEYS.length];
    }
    usedTemplate.add(templateKey);
    const type = templateToType(templateKey);
    return {
      id: `${templateKey}-${hashSeed(`${spec.id}-${index}`).toString(36)}`,
      label: spec.name.slice(0, 28),
      type,
      color: shiftColor(spec.primaryColor, index * 7),
      accent: shiftColor(spec.accentColor, index * 11),
      templateKey,
      category: spec.category,
      silhouette: spec.silhouette,
      previewShape: spec.previewHint || TEMPLATE_LIBRARY[templateKey]?.previewShape,
      ornaments: spec.ornaments,
      sizeClass: spec.sizeClass,
      material: spec.material || stylePack.materials[index % stylePack.materials.length] || "stone",
    };
  });
}

export function buildPreviewData(assets: BuildAsset[]) {
  return assets.map((asset) => ({
    id: asset.id,
    previewShape: asset.previewShape || TEMPLATE_LIBRARY[asset.templateKey || ""]?.previewShape || asset.type,
    category: asset.category || "structure",
    silhouette: asset.silhouette || "balanced",
    color: asset.color,
    accent: asset.accent,
  }));
}

export async function refreshObjectPack(args: GenerateObjectPackArgs) {
  return generateObjectPack({
    ...args,
    mode: "refresh",
    seed: `${args.seed}-r-${Date.now().toString(36)}`,
  });
}

export function buildFallbackStylePack(stylePrompt: string): StylePack {
  const seed = hashSeed(stylePrompt || "fantasy");
  const paletteBase = ["#d6b36a", "#7ea3d8", "#8bcf8a", "#b08ad9", "#d9907a", "#63b7b2", "#f2deb5"];
  return {
    theme: stylePrompt.trim() || "Fantasy Workshop",
    palette: paletteBase.map((c, i) => shiftColor(c, seed + i * 13)),
    materials: ["stone", "wood", "ceramic", "cloth", "jade", "gold trim"],
    motifs: ["arches", "lanterns", "carved panels", "bridges", "royal banners"],
    silhouetteLanguage: ["layered", "tall", "arched", "balanced", "storybook"],
    recommendedCategories: ["structure", "landmark", "connector", "decorative", "nature"],
    visualKeywords: [stylePrompt || "fantasy", "playful", "coherent", "magical"],
  };
}

export function buildFallbackObjectPack(
  stylePack: StylePack,
  addPrompt: string,
  seed: string,
  count: number,
): ObjectPack {
  const seedNum = hashSeed(`${stylePack.theme}|${addPrompt}|${seed}`);
  const keys = [...TEMPLATE_KEYS];
  for (let i = keys.length - 1; i > 0; i -= 1) {
    const j = (seedNum + i * 17) % (i + 1);
    [keys[i], keys[j]] = [keys[j], keys[i]];
  }
  const assets: AssetSpec[] = [];
  for (let i = 0; i < count; i += 1) {
    const key = keys[i % keys.length];
    const lib = TEMPLATE_LIBRARY[key];
    assets.push({
      id: `${key}-${(seedNum + i).toString(36)}`,
      name: `${stylePack.theme.split(" ")[0]} ${key.replace(/_/g, " ")}`.slice(0, 28),
      category: lib.category,
      shapeFamily: key.split("_")[0],
      material: stylePack.materials[i % stylePack.materials.length],
      primaryColor: shiftColor(stylePack.palette[i % stylePack.palette.length], seedNum + i * 5),
      accentColor: shiftColor(stylePack.palette[(i + 2) % stylePack.palette.length], seedNum + i * 9),
      ornaments: [stylePack.motifs[i % stylePack.motifs.length]],
      silhouette: lib.silhouette,
      sizeClass: (["small", "medium", "large"] as const)[i % 3],
      previewHint: lib.previewShape,
      templateKey: key,
    });
  }
  return {
    request: addPrompt,
    seed,
    variationStrategy: "seeded-template-rotation + palette-shift + motif-swap",
    assets,
  };
}

