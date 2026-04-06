export interface BuildAsset {
  id: string;
  label: string;
  type:
    | "block"
    | "column"
    | "roof"
    | "torch"
    | "tree"
    | "gate"
    | "stairs"
    | "banner"
    | "statue"
    | "pond"
    | "rock"
    | "tower";
  color: string;
  accent: string;
}

const BASE_ASSETS: BuildAsset[] = [
  { id: "sandstone-block", label: "Sandstone Block", type: "block", color: "#d6b36a", accent: "#f2deb5" },
  { id: "obelisk", label: "Obelisk", type: "column", color: "#c8aa63", accent: "#f8e9c8" },
  { id: "column", label: "Column", type: "column", color: "#dfc586", accent: "#f7ebcf" },
  { id: "pyramid-roof", label: "Pyramid Roof", type: "roof", color: "#c39a50", accent: "#e7ce96" },
  { id: "torch", label: "Torch", type: "torch", color: "#5e4b2f", accent: "#ffb347" },
  { id: "palm-tree", label: "Palm Tree", type: "tree", color: "#5f8b50", accent: "#88b26e" },
  { id: "arch-gate", label: "Arch Gate", type: "gate", color: "#c0a067", accent: "#f3dda8" },
  { id: "stairs", label: "Stairs", type: "stairs", color: "#b69156", accent: "#ddc289" },
  { id: "banner", label: "Banner", type: "banner", color: "#825f26", accent: "#e8c970" },
  { id: "guardian-statue", label: "Statue", type: "statue", color: "#9f8659", accent: "#dcc69a" },
  { id: "pond", label: "Pond", type: "pond", color: "#3d7fa6", accent: "#79c1e8" },
  { id: "desert-rock", label: "Desert Rock", type: "rock", color: "#96784a", accent: "#ceb784" },
  { id: "tower", label: "Tall Tower", type: "tower", color: "#d4b777", accent: "#f5e6bd" },
];

const STYLE_HINTS: Record<string, string[]> = {
  egyptian: ["sandstone-block", "obelisk", "pyramid-roof", "arch-gate", "torch", "palm-tree"],
  fantasy: ["tower", "banner", "arch-gate", "statue", "stairs", "torch"],
  jungle: ["palm-tree", "pond", "rock", "stairs", "arch-gate", "banner"],
  ice: ["column", "tower", "stairs", "pond", "statue", "banner"],
  default: ["sandstone-block", "column", "arch-gate", "stairs", "banner", "torch"],
};

function normalize(input: string): string {
  return input.toLowerCase().trim();
}

function pickStyleKey(style: string): keyof typeof STYLE_HINTS {
  const normalized = normalize(style);
  if (normalized.includes("egypt")) return "egyptian";
  if (normalized.includes("fantasy")) return "fantasy";
  if (normalized.includes("jungle")) return "jungle";
  if (normalized.includes("ice") || normalized.includes("snow")) return "ice";
  return "default";
}

function byId(id: string): BuildAsset | undefined {
  return BASE_ASSETS.find((asset) => asset.id === id);
}

export function generateAssetSet(style: string, customRequest = ""): BuildAsset[] {
  const styleKey = pickStyleKey(style);
  const selected: BuildAsset[] = [];

  for (const id of STYLE_HINTS[styleKey]) {
    const item = byId(id);
    if (item) selected.push(item);
  }

  const request = normalize(customRequest);
  if (request.includes("torch")) selected.unshift(byId("torch")!);
  if (request.includes("gate")) selected.unshift(byId("arch-gate")!);
  if (request.includes("tower")) selected.unshift(byId("tower")!);
  if (request.includes("tree") || request.includes("palm")) {
    selected.unshift(byId("palm-tree")!);
  }

  for (const asset of BASE_ASSETS) {
    if (selected.length >= 10) break;
    if (!selected.some((s) => s.id === asset.id)) {
      selected.push(asset);
    }
  }

  return selected.slice(0, 10).map((asset, index) => ({
    ...asset,
    id: `${asset.id}-${index}`,
  }));
}
