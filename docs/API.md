# API Documentation

## Overview

Rocky uses Next.js API routes for backend functionality. All routes are located in `src/app/api/`.

## Authentication

All API routes require authentication via NextAuth.js session tokens.

## Endpoints

### Challenges

- `GET /api/challenges` - Get all challenges (filtered by user role)
- `POST /api/challenges` - Create new challenge (teachers only)
- `PUT /api/challenges/[id]` - Update challenge
- `DELETE /api/challenges/[id]` - Delete challenge (teachers only)

### Progress

- `GET /api/progress` - Get student progress
- `POST /api/progress` - Update progress
- `GET /api/progress/[studentId]` - Get specific student's progress (teachers/parents)

### Users

- `GET /api/users` - Get user list (admin only)
- `GET /api/users/[id]` - Get user details

### AI Companion

- `POST /api/ai/chat` - Send message to AI companion
- `GET /api/ai/history` - Get conversation history

## Data Models

See `src/types/index.ts` for TypeScript interfaces.

## Error Handling

All endpoints return standard HTTP status codes:
- 200: Success
- 401: Unauthorized
- 403: Forbidden
- 404: Not found
- 500: Internal server error

Error responses include a JSON object with `error` field.