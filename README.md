# Rocky - 3D Educational World MVP

A Minecraft/Roblox-style 3D educational world for kids to explore subject-based regions, complete creative building challenges, and interact with an AI companion.

## Project Purpose

This MVP delivers a small, playable 3D scene proving core value: exploration, building, AI feedback, sharing, and dashboards. Focus on quality demo over features. Target 1-2 weeks build.

## Target Users

- **Students (kids 8-12)**: Primary users exploring, building, and learning.
- **Teachers**: Assign challenges, track progress.
- **Parents**: View child's world and progress read-only.

## Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **UI**: shadcn/ui
- **3D**: Three.js with React Three Fiber and @react-three/drei
- **Database**: PostgreSQL (planned)
- **Auth**: NextAuth.js (planned)
- **AI Companion**: OpenAI API (planned)
- **Testing**: Jest for critical logic

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd rocky

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── student/           # Student experience (/student)
│   ├── teacher/           # Teacher dashboard (/teacher)
│   ├── parent/            # Parent viewer (/parent)
│   └── world/             # 3D world (/world)
├── components/            # Feature-based React components
│   ├── world/             # 3D world components
│   │   ├── world-scene.tsx      # Main 3D canvas
│   │   ├── challenge-area.tsx   # Interactive challenge logic
│   │   └── world-environment.tsx # Scene lighting/geometry
│   ├── ai/                # AI companion components
│   │   ├── ai-companion.tsx     # Chat overlay
│   │   └── ai-companion-3d.tsx  # 3D robot avatar
│   ├── teacher/           # Teacher dashboard components
│   ├── parent/            # Parent viewer components
│   └── ui/                # Shared UI components
├── lib/                   # Business logic and utilities
│   ├── mock-data.ts       # Centralized mock data
│   ├── teacher-data.ts    # Teacher dashboard data service
│   ├── parent-data.ts     # Parent viewer data service
│   ├── ai-service.ts      # AI companion service
│   ├── challenge-logic.ts # Challenge validation logic
│   ├── auth.ts            # Authentication utilities (planned)
│   └── api.ts             # API client (planned)
├── types/                 # TypeScript type definitions
│   ├── index.ts           # Core domain types
│   └── ai.ts              # AI-specific types
├── scenes/                # 3D scene logic (separated for modularity)
└── __tests__/             # Test files
    ├── setup.ts           # Jest configuration
    ├── challenge-logic.test.ts    # Challenge validation tests
    ├── ai-service.test.ts         # AI safety tests
    └── data-services.test.ts      # Role boundary tests
```

## Development Workflow

### Code Organization
- **Feature-based components**: Group by functionality (world/, ai/, teacher/, parent/)
- **Separation of concerns**: Keep 3D rendering separate from game logic
- **TypeScript strict mode**: All code must be fully typed
- **Functional components**: Use hooks, avoid class components
- **Kebab-case naming**: `challenge-area.tsx`, `ai-companion.tsx`

### Key Principles
- **Modular architecture**: Separate scene, gameplay, and business logic
- **Testable code**: Extract logic from components for unit testing
- **Role-based access**: Enforce boundaries in data services
- **AI safety**: Validate all AI responses for child-friendly content
- **Maintainable 3D**: Keep scene code focused and decoupled

### Testing Strategy
- **Challenge rules**: Test completion logic independently
- **Role boundaries**: Verify data access restrictions
- **AI safety**: Validate response filtering and length limits
- **Progress calculations**: Test summary and aggregation logic

## Developer Notes

### For Junior Developers

**Challenge Logic Separation**: The `challenge-logic.ts` file contains pure functions for validating challenge completion. This keeps complex logic out of React components and makes it easy to test. Always extract business logic from UI components.

**Mock Data Centralization**: All mock data lives in `mock-data.ts`. This prevents duplication and makes it easy to update test data in one place.

**AI Response Safety**: The AI service validates responses for child safety. Remember: no direct answers, keep messages short, and always end questions with `?`.

**3D Scene Architecture**: Keep 3D rendering (`@react-three/fiber`) separate from game logic. Use the `challenge-logic.ts` for rules, not the 3D components.

### Common Patterns

**Data Service Pattern**:
```typescript
// Good: Pure functions, easy to test
export function calculateProgress(studentId: string): number {
  const progress = getStudentProgress(studentId)
  return (progress.completed / progress.total) * 100
}
```

**Component Pattern**:
```typescript
// Good: Extract logic, focus on rendering
export function ChallengeArea({ onContextUpdate }: Props) {
  const [cubes, setCubes] = useState<PlacedCube[]>([])

  const handlePlace = (cube: PlacedCube) => {
    const updated = [...cubes, cube]
    setCubes(updated)

    if (isChallengeComplete('line_challenge', updated)) {
      onContextUpdate({ action: 'completed_challenge' })
    }
  }

  return <group>{/* 3D rendering */}</group>
}
```

### Environment Setup

For future development with real services:

1. **Database**: Set up PostgreSQL and run migrations
2. **Auth**: Configure NextAuth.js with your providers
3. **AI**: Add OpenAI API key to environment variables
4. **Testing**: Set up CI/CD with test coverage requirements

## API Endpoints (Planned)

- `GET /api/students` - Teacher: list students with progress
- `GET /api/parent/:childId` - Parent: view child's progress
- `POST /api/challenges/:id/complete` - Student: mark challenge complete
- `POST /api/ai/chat` - Student: get AI companion response

## Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy via Vercel CLI or GitHub integration
```

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://...

# Authentication
NEXTAUTH_SECRET=...
NEXTAUTH_URL=...

# AI Service
OPENAI_API_KEY=...
```

## Contributing

1. Follow the established patterns and principles
2. Write tests for new logic
3. Keep components focused and modular
4. Update documentation for API changes
5. Ensure AI responses are child-safe

## Next Steps After MVP

1. **Real Database Integration**: Replace mock data with PostgreSQL
2. **Authentication System**: Implement NextAuth.js for role-based access
3. **AI Integration**: Connect to OpenAI API with safety guardrails
4. **Multiplayer Features**: Add real-time collaboration
5. **Advanced Analytics**: Progress tracking and learning insights
6. **Mobile Optimization**: Responsive 3D scenes for tablets
7. **Content Management**: Teacher tools for creating challenges