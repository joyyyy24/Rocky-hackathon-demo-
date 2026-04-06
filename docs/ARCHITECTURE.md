# Architecture Overview

## High-Level Architecture

Rocky is built as a modular Next.js application with clear separation of concerns:

- **Frontend**: Next.js with TypeScript for type safety
- **3D Engine**: Three.js with React Three Fiber for declarative 3D scenes
- **UI**: Tailwind CSS + shadcn/ui for consistent, accessible components
- **State Management**: React hooks with context for local state
- **Authentication**: NextAuth.js for role-based access control
- **Database**: PostgreSQL with Prisma ORM (planned)
- **AI**: OpenAI API for companion interactions

## Component Organization

Components are organized by feature rather than by type:

```
components/
├── world/          # 3D world components
├── ai/            # AI companion components
├── challenges/    # Challenge-related components
├── student/       # Student dashboard components
├── teacher/       # Teacher dashboard components
└── parent/        # Parent viewer components
```

## 3D Scene Separation

The 3D logic is separated into focused modules:

- **scene-setup**: Scene initialization, camera, lighting
- **player-logic**: Movement, controls, interactions
- **world-objects**: Object loading, placement, management
- **region-logic**: Region transitions, subject-based areas
- **challenge-interaction**: Challenge logic, progress tracking
- **ui-overlays**: HUD, menus, tooltips

## Data Flow

1. User authenticates via NextAuth.js
2. Role-based routing determines available features
3. Students enter 3D world via `/world`
4. Scene loads appropriate region and challenges
5. Player interactions update local state
6. Progress syncs to database via API calls
7. Teachers monitor via dashboard
8. Parents view read-only via shared links

## Security Considerations

- Role-based access control enforced at component level
- API routes validate user permissions
- AI prompts filtered for educational, safe content
- No direct database access from client

## Performance Goals

- Keep 3D scenes lightweight (<100 objects per region)
- Lazy load regions and assets
- Optimize Three.js rendering for low-end devices
- Cache AI responses to reduce API calls