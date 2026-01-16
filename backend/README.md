# Backend (Task Management)

Scaffolded Express + TypeScript backend.

Quick start:

1. Install dependencies:

```bash
cd backend
pnpm install
```

2. Generate Prisma client (if you want DB):

```bash
pnpm prisma generate
pnpm prisma migrate dev --name init
```

3. Run dev server:

```bash
pnpm dev
```

API endpoints:
- `GET /health`
- `POST /api/auth/login`
- `GET /api/tasks`

Replace the in-memory task store with Prisma DB calls in `src/routes/tasks.ts` when ready.
