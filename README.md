# Rocky MVP

Rocky is a role-based 3D educational sandbox for kids (8-12): teachers publish creative missions, students build worlds with AI-assisted themed assets, and parents review progress in read-only mode.

This is a **hackathon MVP** built for fast iteration: local auth/session state + lightweight server routes for Gemini-powered generation.

---

## Product Loop

- **Teacher** publishes today’s mission.
- **Student** enters `/world`, applies a style, requests themed object packs, refreshes variants, and builds on a snap grid.
- **Rocky Companion** provides guided prompts via subtitle + Ask Rocky dialog.
- **Parent** monitors progress and world output in read-only view.

---

## Current Feature Set

### Role-Based App Flow (Mock Auth)

- Role selection entry (`student`, `teacher`, `parent`)
- Optional display name
- Role/session persisted in `localStorage`
- Route guards by role
- Logout returns to role entry

### Student Build Experience

- 12x12 build board, snap-to-grid, one item per cell
- Hotbar with 10 generated assets
- Place, select, scale (`0.5x-2.0x`), rotate (`90deg`), delete
- Save draft and publish world
- Review-safe read-only mode for teacher world review page

### Rocky Companion

- 3D in-world Rocky + subtitle bar
- Ask Rocky modal (async API + loading/disabled states)
- Bubble suggestions tied to task/style/state
- API fallback to local scripted guidance

### Teacher & Parent

- Teacher can publish active mission
- Teacher can open student world review
- Parent can view summary data read-only

---

## AI Asset Generation (Refactored)

The asset pipeline is now 3-layer and Gemini-driven:

1. **Style Pack Layer**
   - `generateStylePack(stylePrompt)` creates a structured style system:
   - theme, palette, materials, motifs, silhouette language, recommended categories

2. **Object Pack Layer**
   - `generateObjectPack(stylePack, addPrompt, seed, recentHistory)` creates structured asset specs:
   - category, shape family, template key, ornaments, silhouette, size class, colors

3. **Local Asset Factory Layer**
   - `mapAssetSpecsToLocalTemplates()` maps specs to local buildable assets
   - richer local archetypes (gate variants, roof variants, tower variants, bridge, lantern, etc.)
   - preserves existing gameplay/placement logic

### UX Behavior

- **Apply Style**: builds coherent themed style language
- **Add**: generates a themed object pack for the request
- **Refresh**: returns new variants under same style family using a new seed + recent-history anti-duplication

### Fallback

If Gemini fails, fallback still uses seeded template diversity (not a tiny fixed rotation).

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict)
- **UI**: React + Tailwind CSS
- **3D**: React Three Fiber + drei + Three.js
- **Testing**: Jest
- **Persistence**: `localStorage` (MVP scope)

---

## Quick Start

### Prerequisites

- Node.js 18+ (Node 20 recommended)
- npm

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Lint / Test / Build

```bash
npm run lint
npm test
npm run build
```

---

## Gemini Setup

Create `.env.local` in project root:

```bash
GEMINI_API_KEY=your_key_here
```

Then restart dev server:

```bash
npm run dev
```

> Security: never commit `.env.local` and rotate leaked keys immediately.

---

## Main API Routes

- `src/app/api/rocky/route.ts`
  - Rocky Q&A response generation
- `src/app/api/assets/route.ts`
  - style pack + object pack generation and mapping to buildable assets

---

## Key Structure

```text
src/
  app/
    api/
      rocky/route.ts
      assets/route.ts
    world/page.tsx
    teacher/page.tsx
    parent/page.tsx
  components/
    ai/
      ai-companion.tsx
      ai-companion-3d.tsx
      rocky-speech-bubble.tsx
    world/
      world-scene.tsx
      creative-build-area.tsx
      floating-island.tsx
  lib/
    ai-asset-pipeline.ts
    asset-generator.ts
    tasks.ts
    build-state.ts
    world-storage.ts
```

---

## Local Storage Keys

- `rocky_role`, `rocky_name`
- `rocky_active_task`
- `rocky_build_summary`
- world draft/publish keys from `world-storage.ts`

---

## Known Limitations

- Mock auth (no real identity provider)
- No server database (single-browser persistence)
- No multiplayer collaboration
- No imported external 3D model pipeline (uses local parametric archetypes)

---

## Next Suggested Improvements

1. Persist style packs/object packs to backend for replayability
2. Add undo/redo stack for build actions
3. Add per-classroom analytics + teacher insights
4. Add stronger safety moderation layer for all AI outputs
5. Add deterministic replay snapshots for demo reliability

---

## Contributing

1. Keep PRs small and reviewable
2. Preserve role boundaries and existing build flow
3. Run lint/tests before merge
4. Update README when behavior changes

---

## License

Hackathon MVP repository. Add formal license before public distribution.