// Starter files for the E-Commerce API Sprint simulation
// In production, these would come from a Git repo. For MVP, hardcoded is fine.

export const ECOMMERCE_STARTER_FILES: Record<string, string> = {
  'package.json': `{
  "name": "ecommerce-api",
  "version": "1.0.0",
  "scripts": {
    "dev": "ts-node-dev --respawn src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest --forceExit"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "@prisma/client": "^5.0.0",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/bcrypt": "^5.0.2",
    "@types/jsonwebtoken": "^9.0.5",
    "typescript": "^5.3.3",
    "ts-node-dev": "^2.0.0",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.11",
    "ts-jest": "^29.1.1",
    "prisma": "^5.0.0"
  }
}`,

  'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}`,

  '.env': `PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecommerce?schema=public"
JWT_SECRET="your-secret-key-change-in-production"`,

  'src/index.ts': `// Entry point — build your Express server here
// See TICKET.md for your current task

import express from 'express';

const app = express();

// TODO: Set up middleware (CORS, JSON parsing)
// TODO: Set up routes
// TODO: Set up error handling

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});

export default app;
`,

  'src/routes/.gitkeep': '',

  'src/middleware/.gitkeep': '',

  'src/utils/.gitkeep': '',

  'prisma/schema.prisma': `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// TODO: Add your models here
`,

  'TICKET.md': `# Welcome to the E-Commerce API Sprint

Your tickets will appear here as you progress through the simulation.

Check the **Team Chat** panel for messages from your AI Project Manager.
`,

  'README.md': `# E-Commerce API

A production-ready REST API for an e-commerce platform.

## Stack
- Express + TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication

## Getting Started
1. Install dependencies: \`npm install\`
2. Set up your database in \`.env\`
3. Run migrations: \`npx prisma migrate dev\`
4. Start dev server: \`npm run dev\`
`,
};