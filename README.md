# Lifetuna

A productivity application that delivers simple, actionable tips each day to help you focus on what's truly important. Lifetuna helps you organize and track your life priorities using a structured, card-based approach for personal development and goal achievement.

## About

Lifetuna provides daily micro-actions and insights designed to keep you moving toward your most important goals. Each day, you'll receive a few minutes of focused guidance to help you stay aligned with your priorities and make meaningful progress.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd lifetuna
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up the database:
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Open Prisma Studio to view/edit data
npx prisma studio
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Database

The application uses **SQLite** for development with Prisma ORM. The database file (`dev.db`) is created automatically when you run migrations.

- **Prisma Studio**: Available at [http://localhost:5555](http://localhost:5555) when running `npx prisma studio`
- **Database Schema**: Located in `prisma/schema.prisma`
- **Migrations**: Stored in `prisma/migrations/`

For production, the database can be easily migrated to PostgreSQL by updating the `DATABASE_URL` in `.env`.


## Future Development Steps

- **LLM Integration**: AI-powered priority recommendations and analysis
- **API Development**: RESTful endpoints for user management and tip tracking
- **Design Improvements**: Enhanced UI/UX with modern design patterns
- **Production Database**: Migrate from SQLite to PostgreSQL
- **Release**: Production deployment and user onboarding
- **Mobile App**: Native mobile application for on-the-go priority tracking

## Tech Stack

- [Next.js](https://nextjs.org) - React framework
- TypeScript - Type safety
- Tailwind CSS - Styling
- shadcn/ui - Component library
- [Prisma](https://prisma.io) - Database ORM
- SQLite - Development database

## Inspiration

This project was inspired by the prioritization and training methodology outlined in Eric Horst's book "Maximum Climbing", which emphasizes structured, systematic approaches to goal achievement and skill development.
