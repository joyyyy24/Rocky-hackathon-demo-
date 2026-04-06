# AGENTS.md

## Project Purpose
This project builds an MVP for a Minecraft/Roblox-style 3D educational world for kids. Students explore subject-based regions (science, history, maths, arts), complete creative building challenges to unlock areas, and interact with an AI companion that encourages thinking without direct answers. Teachers monitor progress via dashboards, and parents view creations read-only. Classmates share worlds on a map.

## Target Users
- **Students (kids 8-12)**: Primary users exploring, building, and learning.
- **Teachers**: Assign challenges, track progress.
- **Parents**: View child's world and progress read-only.

## MVP Goals
Deliver a small, playable 3D scene proving core value: exploration, building, AI feedback, sharing, and dashboards. Focus on quality demo over features. Target 1-2 weeks build.

## Preferred Tech Stack
- Frontend: Next.js + TypeScript + Tailwind CSS
- UI: shadcn/ui
- 3D: Three.js with React Three Fiber and @react-three/drei
- Database: PostgreSQL
- Auth: NextAuth.js for role-based auth (student, teacher, parent)
- AI Companion: OpenAI API with structured prompts and safety guardrails
- Testing: Jest for critical logic

## Folder Organization Rules
- Use Next.js app router structure in `src/app/`.
- Group components by feature: `src/components/world/`, `src/components/ai/`, etc.
- Keep utilities in `src/lib/`, types in `src/types/`.
- Avoid deep nesting; max 3 levels.
- Separate 3D logic from business logic.

## Coding Conventions
- TypeScript strict mode on.
- Use functional components with hooks.
- Name files in kebab-case (e.g., `player-controller.tsx`).
- Comments for complex logic; keep functions <50 lines.
- ESLint/Prettier enforced.

## Architecture Principles
- Modular: Separate scene, gameplay, and business logic.
- Keep 3D scenes small and focused.
- API-first: Design for future scaling.
- Role-based: Enforce boundaries in code.

## Student / Teacher / Parent Role Boundaries
- **Student**: Access world, building, AI; read shared worlds.
- **Teacher**: View all students' progress, assign challenges; no building.
- **Parent**: Read-only view of own child's world/progress; no editing.

## AI Companion Safety Rules
- Filter responses for educational, safe content.
- No direct answers; encourage thinking.
- Limit API calls; cache responses.
- Monitor for harmful prompts.

## Three.js / React Three Fiber Rules
- Use R3F for React integration; drei for helpers.
- Keep scenes modular: one component per feature.
- Optimize: Limit objects, use instancing.
- Test rendering on low-end devices.

## Testing Expectations
- Unit tests for AI logic, auth, building mechanics.
- Integration for API endpoints.
- 70% coverage on critical paths; manual test 3D scenes.

## Feature Development Workflow
- Plan first: Discuss changes before coding.
- Small PRs: <200 lines, reviewable.
- Test locally; deploy to Vercel for review.

## Definition of Done
- Code reviewed, tested, deployed.
- No console errors; works on target devices.
- Docs updated; roles enforced.

## What to Avoid in the MVP
- Overengineering: No advanced 3D physics/tools.
- Giant files: Split >100 lines.
- Real-time multiplayer.
- Complex AI customization.
- Mobile optimization.