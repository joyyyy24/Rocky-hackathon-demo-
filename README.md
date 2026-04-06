# Rocky MVP

A role-based, 3D educational sandbox for children (ages 8-12), where teachers publish creative missions, students build themed worlds with Rocky’s guidance, and parents monitor progress in read-only mode.

This project is intentionally implemented as a **local-first hackathon MVP** with mock persistence and no backend dependency.

---

## Product Overview

Rocky demonstrates a complete role-driven product loop:

- **Teacher** publishes today’s creative task.
- **Student** enters the 3D world, selects a style, generates themed assets, and builds on a grid board.
- **Rocky** (an in-world AI-style companion) guides creativity through subtitles and comic bubble suggestions.
- **Parent** views child progress and latest build summary.

### Target Users

- **Students (8-12)**: primary interactive users.
- **Teachers**: assign and supervise creative learning activities.
- **Parents**: read-only observers of child progress.

---

## Current Feature Set

### Authentication and Role Flow (Mock)

- Role selection landing screen.
- Optional display name.
- Session persisted in `localStorage`.
- Route guards by role.
- Logout returns user to role selection.

### Student Build World

- Large **12x12 grid-based build board** with visible cell lines.
- Hotbar-driven asset selection (10 slots).
- Snap-to-grid placement and one-item-per-cell occupancy.
- Single-place behavior per hotbar selection (prevents accidental spam placement).
- Object editing after placement:
  - select object,
  - scale (`0.5x` to `2.0x`),
  - rotate (`90°`),
  - delete.

### Rocky Companion

- 3D floating Rocky in scene.
- Top subtitle narration for passive guidance.
- Clickable Rocky opens comic-style speech bubble.
- Contextual, question-led suggestions based on task/style/build state.
- “Ask Rocky” interaction for additional ideas.

### Teacher and Parent Experiences

- **Teacher** can publish task title/description/prompt/theme examples.
- Student reads active teacher task on world entry.
- **Teacher/Parent** read build summary (style, object count, latest reflection) from local state.

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **UI**: React + Tailwind CSS
- **3D**: Three.js via React Three Fiber (`@react-three/fiber`) + `@react-three/drei`
- **Testing**: Jest
- **Persistence (MVP)**: browser `localStorage`

> Note: Despite earlier exploration prompts mentioning Vite/vanilla JS, this repository is implemented in Next.js + TypeScript and should be maintained in this stack.

---

## Quick Start

### Prerequisites

- Node.js 18+ (Node 20 LTS recommended)
- npm

### Install

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build and Production Run

```bash
npm run build
npm run start
```

### Quality Checks

```bash
npm run lint
npm test
```

---

## Local Data Flow

This MVP intentionally uses local browser storage to simulate end-to-end product behavior.

1. Teacher saves active task.
2. Student world reads active task on entry.
3. Student chooses style.
4. Local asset generator produces themed hotbar assets.
5. Student places/edit objects.
6. Build summary updates and is exposed to Teacher/Parent views.

### `localStorage` Keys

- `rocky_role`, `rocky_name`: session identity.
- `rocky_active_task`: active teacher mission.
- `rocky_build_summary`: latest student build state snapshot.

---

## Repository Structure (Key Paths)

```text
src/
  app/
    page.tsx                      # role entry
    world/page.tsx                # student world
    teacher/page.tsx              # teacher dashboard
    parent/page.tsx               # parent dashboard
  components/
    auth/
      role-entry.tsx
      role-guard.tsx
    ai/
      ai-companion.tsx            # subtitle + ask mode
      ai-companion-3d.tsx         # clickable Rocky
      rocky-speech-bubble.tsx     # comic bubble overlay
    world/
      world-scene.tsx             # world orchestration + HUD
      creative-build-area.tsx     # grid board, snapping, object selection/edit
      floating-island.tsx
  lib/
    mock-auth.ts
    tasks.ts
    asset-generator.ts
    build-state.ts
    companion-script.ts
```

---

## Engineering Principles Used

- Keep role boundaries explicit in UI and routes.
- Keep 3D rendering and product logic separated.
- Use local scripted logic for deterministic MVP behavior.
- Prefer incremental refactors over architecture resets.
- Keep child-facing language short, warm, and encouraging.

---

## Known MVP Limitations

- No real backend authentication.
- No cloud database or multi-device sync.
- No real LLM or text-to-3D integration.
- No collaborative multiplayer mode.

These are intentional trade-offs for demo speed and product validation.

---

## Recommended Next Steps

1. Move task/build/session state from localStorage to backend APIs.
2. Add persistent student profiles and classroom-scoped data.
3. Add undo/redo history for build edits.
4. Add richer asset thumbnails and placement effects.
5. Add analytics for mission completion and creativity signals.

---

## Pending Features (To Implement)

The items below are confirmed product requirements to be implemented next.

### Teacher Side

1. **Publish assignments**
   - Provide a complete task publishing workflow for teachers.
2. **View and open student submissions**
   - Teachers can view student homework/submissions by task.
   - Teachers can open a student's submission and enter that student's 3D world for review.

### Student Side

1. **Canvas lifecycle**
   - Create a new canvas.
   - Open/switch between different canvases.
2. **In-canvas gameplay and AI improvements**
   - Improve gameplay feel inside canvas (building flow and interaction smoothness).
   - Improve AI functionality in the build experience (guidance quality and relevance).
3. **Guide AI polish**
   - Improve guide AI appearance (character visual quality).
   - Improve guide AI interaction experience (timing, trigger clarity, usability).

### Priority Guidance

- First priority: teacher task -> student submission -> teacher review loop.
- Second priority: student multi-canvas workflow.
- Third priority: gameplay and AI experience polish.

---

## Contributing

1. Keep PRs focused and reviewable.
2. Preserve role-based product logic.
3. Run lint/tests before submitting.
4. Update README when behavior or architecture changes.

---

## License

Hackathon MVP repository. Add a formal license before public distribution.