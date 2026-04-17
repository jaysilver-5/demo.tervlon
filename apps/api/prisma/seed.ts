import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data (children before parents)
  await prisma.ticketEvaluation.deleteMany();
  await prisma.workspaceSnapshot.deleteMany();
  await prisma.assessmentCandidate.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.trigger.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.workspaceSession.deleteMany();
  await prisma.simulation.deleteMany();

  // Create the first simulation
  const sim = await prisma.simulation.create({
    data: {
      title: 'E-Commerce API Sprint',
      description:
        'Build a production-ready REST API for an e-commerce platform using Express, Prisma, and PostgreSQL. You will set up the project, design data models, implement authentication, and build CRUD endpoints — just like your first week on a real backend team.',
      stack: 'NODE_EXPRESS_PRISMA',
      difficulty: 'INTERMEDIATE',
      estimatedMinutes: 180,
      status: 'PUBLISHED',
      evaluationWeights: {
        technicalAccuracy: 0.5,
        codeQuality: 0.35,
        timeManagement: 0.15,
      },
    },
  });

  console.log(`✓ Simulation created: ${sim.title}`);

  // Create tickets
  const tickets = [
    {
      sequence: 1,
      title: 'DS-101: Setup Express server & project structure',
      brief: `# DS-101: Setup Express Server & Project Structure

## Objective
Initialize a well-structured Express application with TypeScript that will serve as the foundation for the entire e-commerce API.

## Requirements
- Initialize a new Express application with TypeScript
- Set up a clean folder structure: \`src/routes/\`, \`src/middleware/\`, \`src/utils/\`
- Create a health check endpoint at \`GET /api/health\` that returns \`{ status: "ok", timestamp: <ISO string> }\`
- Set up error handling middleware that catches unhandled errors and returns a consistent JSON error format
- Configure CORS and JSON body parsing
- The server should listen on the port from the \`PORT\` environment variable (default 3000)

## Acceptance Criteria
- [ ] Server starts without errors
- [ ] \`GET /api/health\` returns 200 with correct JSON shape
- [ ] Unknown routes return 404 with \`{ error: "Not found" }\`
- [ ] Invalid JSON bodies return 400, not 500
- [ ] Folder structure follows the specified layout

## Edge Cases
- What happens when the PORT env variable is not set? Should fall back to 3000.
- What happens when middleware throws? The error handler should catch it.

## Resources
- [Express with TypeScript guide](https://expressjs.com/)
- [Project structure best practices](https://github.com/goldbergyoni/nodebestpractices)`,
      testFiles: ['tests/ticket-1/server.test.ts'],
      estimatedMinutes: 25,
      evaluationCriteria: {
        focus: ['project structure', 'error handling', 'middleware setup'],
      },
    },
    {
      sequence: 2,
      title: 'DS-102: Design and implement User model with Prisma',
      brief: `# DS-102: Design and Implement User Model with Prisma

## Objective
Design a User model using Prisma ORM and implement the database schema with proper constraints, validations, and relationships.

## Requirements
- Define a \`User\` model in \`prisma/schema.prisma\`
- Fields: \`id\` (cuid), \`email\`, \`username\`, \`passwordHash\`, \`role\`, \`createdAt\`, \`updatedAt\`
- \`email\` and \`username\` must be unique
- \`role\` should be an enum: \`USER\`, \`ADMIN\` (default: \`USER\`)
- Create and run the migration
- Write a seed script at \`prisma/seed.ts\` that creates 3 test users

## Acceptance Criteria
- [ ] Prisma schema compiles without errors
- [ ] Migration runs successfully and creates the users table
- [ ] Seed script creates 3 test users with hashed passwords
- [ ] Unique constraints enforced on email and username

## Edge Cases
- Duplicate email registration should throw a clear Prisma error (P2002)
- Empty string for username should be rejected
- Consider case-insensitivity for email lookups at the application layer

## Resources
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Migrate Guide](https://www.prisma.io/docs/concepts/components/prisma-migrate)`,
      testFiles: ['tests/ticket-2/user-model.test.ts'],
      estimatedMinutes: 30,
      evaluationCriteria: {
        focus: ['schema design', 'constraints', 'seed script quality'],
      },
    },
    {
      sequence: 3,
      title: 'DS-103: Build authentication endpoints (register/login)',
      brief: `# DS-103: Build Authentication Endpoints

## Objective
Implement user registration and login endpoints with proper password hashing, input validation, and JWT token generation.

## Requirements
- \`POST /api/auth/register\` — accepts \`{ email, username, password }\`, validates input, hashes password with bcrypt, creates user, returns JWT
- \`POST /api/auth/login\` — accepts \`{ email, password }\`, verifies credentials, returns JWT
- JWT payload should include: \`{ sub: userId, email, role }\`
- JWT should expire in 24 hours
- Use a \`JWT_SECRET\` from environment variables
- Return consistent response shapes: \`{ user: {...}, token: "..." }\` on success
- Return \`409 Conflict\` for duplicate email/username on register
- Return \`401 Unauthorized\` for bad credentials on login

## Acceptance Criteria
- [ ] Register creates a new user and returns a valid JWT
- [ ] Login with correct credentials returns a valid JWT
- [ ] Login with wrong password returns 401
- [ ] Register with duplicate email returns 409
- [ ] Passwords are hashed — never stored in plain text
- [ ] JWT can be decoded and contains the correct payload

## Edge Cases
- Registration with a very long password (should still work, bcrypt handles it)
- Login with an email that doesn't exist (should return 401, not 500)
- Missing required fields should return 400 with clear validation errors

## Resources
- [bcrypt npm package](https://www.npmjs.com/package/bcrypt)
- [jsonwebtoken npm package](https://www.npmjs.com/package/jsonwebtoken)`,
      testFiles: ['tests/ticket-3/auth.test.ts'],
      estimatedMinutes: 35,
      evaluationCriteria: {
        focus: ['security', 'validation', 'error handling', 'JWT implementation'],
      },
    },
    {
      sequence: 4,
      title: 'DS-104: Implement JWT middleware & route guards',
      brief: `# DS-104: Implement JWT Middleware & Route Guards

## Objective
Create authentication middleware that verifies JWT tokens and a role-based guard to protect specific routes.

## Requirements
- Create an \`authenticate\` middleware that:
  - Extracts the JWT from the \`Authorization: Bearer <token>\` header
  - Verifies the token using \`JWT_SECRET\`
  - Attaches the decoded user to \`req.user\`
  - Returns 401 if token is missing, expired, or invalid
- Create an \`authorize(...roles)\` middleware that:
  - Checks if \`req.user.role\` is in the allowed roles
  - Returns 403 Forbidden if not authorized
- Apply \`authenticate\` to a test route: \`GET /api/auth/me\` that returns the current user
- Apply \`authorize('ADMIN')\` to: \`GET /api/admin/stats\` (can return mock data for now)

## Acceptance Criteria
- [ ] Requests without a token to protected routes get 401
- [ ] Requests with an invalid/expired token get 401
- [ ] Requests with a valid token can access \`/api/auth/me\`
- [ ] Non-admin users get 403 on \`/api/admin/stats\`
- [ ] Admin users can access \`/api/admin/stats\`

## Edge Cases
- Malformed Authorization header (e.g., "Bearer" without a token)
- Token signed with a different secret
- Expired tokens should be caught and return a clear message

## Resources
- [Express middleware pattern](https://expressjs.com/en/guide/writing-middleware.html)
- [JWT verify options](https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback)`,
      testFiles: ['tests/ticket-4/middleware.test.ts'],
      estimatedMinutes: 30,
      evaluationCriteria: {
        focus: ['middleware pattern', 'security', 'role-based access', 'error messages'],
      },
    },
    {
      sequence: 5,
      title: 'DS-105: CRUD endpoints for Products resource',
      brief: `# DS-105: CRUD Endpoints for Products Resource

## Objective
Build a full CRUD API for a Products resource with proper validation, pagination, and error handling.

## Requirements
- Add a \`Product\` model to Prisma: \`id\`, \`name\`, \`description\`, \`price\` (Float), \`stock\` (Int), \`category\`, \`createdBy\` (relation to User), \`createdAt\`, \`updatedAt\`
- Implement the following endpoints (all require authentication):
  - \`POST /api/products\` — create a product (sets \`createdBy\` to current user)
  - \`GET /api/products\` — list products with pagination (\`?page=1&limit=10\`) and optional category filter (\`?category=electronics\`)
  - \`GET /api/products/:id\` — get single product
  - \`PUT /api/products/:id\` — update product (only creator or admin)
  - \`DELETE /api/products/:id\` — delete product (only creator or admin)
- Validate that \`price > 0\` and \`stock >= 0\`
- Return 404 for non-existent products
- Return 403 if a non-owner non-admin tries to update/delete

## Acceptance Criteria
- [ ] Create a product with valid data returns 201
- [ ] List products returns paginated results with correct total count
- [ ] Category filter works correctly
- [ ] Update by owner succeeds, by non-owner returns 403
- [ ] Delete removes the product
- [ ] Invalid price/stock returns 400

## Edge Cases
- Creating a product with negative price
- Requesting page 999 with no results (should return empty array, not error)
- Deleting a product that doesn't exist (404)
- Concurrent updates to stock (note: not required to solve, but good to mention in review)

## Resources
- [Prisma CRUD operations](https://www.prisma.io/docs/concepts/components/prisma-client/crud)
- [REST pagination patterns](https://www.moesif.com/blog/technical/api-design/REST-API-Design-Filtering-Sorting-and-Pagination/)`,
      testFiles: ['tests/ticket-5/products.test.ts'],
      estimatedMinutes: 40,
      evaluationCriteria: {
        focus: ['CRUD completeness', 'validation', 'pagination', 'authorization', 'error handling'],
      },
    },
  ];

  for (const ticket of tickets) {
    await prisma.ticket.create({
      data: {
        simulationId: sim.id,
        ...ticket,
      },
    });
  }

  console.log(`✓ ${tickets.length} tickets created`);

  // Create a curveball trigger
  await prisma.trigger.create({
    data: {
      simulationId: sim.id,
      condition: { type: 'AFTER_TICKET', ticketSequence: 3 },
      effect: { type: 'PM_MESSAGE' },
      pmMessage:
        "Hey — quick update from the client. They want the Products model to also include an `imageUrl` field (optional String). This affects the schema you'll build in DS-105. Not a blocker for DS-104, just a heads up so you can plan ahead.",
    },
  });

  console.log('✓ 1 trigger created');
  console.log('🌱 Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });