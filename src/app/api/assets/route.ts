import { NextResponse } from "next/server";
import type { BuildAsset } from "@/lib/asset-generator";
import {
  buildFallbackObjectPack,
  buildFallbackStylePack,
  buildPreviewData,
  generateObjectPack,
  generateStylePack,
  mapAssetSpecsToLocalTemplates,
  refreshObjectPack,
  type StylePack,
} from "@/lib/ai-asset-pipeline";

type AssetRequest = {
  style?: string;
  customRequest?: string;
  count?: number;
  refreshNonce?: string;
  mode?: "apply" | "add" | "refresh";
  stylePack?: StylePack;
  existingAssets?: Array<Pick<BuildAsset, "id" | "label" | "type" | "category" | "silhouette">>;
};

function buildRecentHistory(existingAssets: AssetRequest["existingAssets"]) {
  const items = Array.isArray(existingAssets) ? existingAssets : [];
  return {
    assetIds: items.map((a) => a.id),
    categories: items.map((a) => a.category || ""),
    silhouettes: items.map((a) => a.silhouette || ""),
    ornaments: [],
    colors: [],
  };
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing GEMINI_API_KEY in server environment." },
      { status: 500 },
    );
  }

  const body = (await request.json().catch(() => ({}))) as AssetRequest;
  const style = (body.style || "fantasy").trim();
  const customRequest = (body.customRequest || "").trim();
  const count = Math.max(6, Math.min(10, body.count || 10));
  const mode = body.mode || "refresh";
  const seed = body.refreshNonce || `${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 7)}`;
  const recentHistory = buildRecentHistory(body.existingAssets);

  let stylePack: StylePack | null = null;
  try {
    stylePack = body.stylePack ?? (await generateStylePack(apiKey, style));
  } catch {
    stylePack = buildFallbackStylePack(style);
  }

  try {
    const objectPack =
      mode === "refresh"
        ? await refreshObjectPack({
            apiKey,
            stylePack,
            addPrompt: customRequest || style,
            seed,
            recentHistory,
            mode,
            count,
          })
        : await generateObjectPack({
            apiKey,
            stylePack,
            addPrompt: customRequest || style,
            seed,
            recentHistory,
            mode,
            count,
          });
    const assets = mapAssetSpecsToLocalTemplates(objectPack.assets, stylePack).slice(0, count);
    return NextResponse.json({
      stylePack,
      objectPack,
      assets,
      previewData: buildPreviewData(assets),
      fallback: false,
    });
  } catch (error) {
    const objectPack = buildFallbackObjectPack(stylePack, customRequest || style, seed, count);
    const assets = mapAssetSpecsToLocalTemplates(objectPack.assets, stylePack).slice(0, count);
    return NextResponse.json({
      stylePack,
      objectPack,
      assets,
      previewData: buildPreviewData(assets),
      fallback: true,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

