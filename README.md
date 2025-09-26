# Lifetuna

A productivity application that delivers AI-powered, personalized tips and insights to help you focus on what's truly important. Lifetuna combines intelligent priority management with emotional intelligence to provide personalized guidance for personal development and goal achievement.

## About

Lifetuna uses advanced AI to analyze your priorities, emotions, and goals, delivering personalized daily micro-actions and insights. The app features intelligent question generation, priority analysis, and emotionally-aware recommendations to help you stay aligned with your most important goals and make meaningful progress.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Ollama (for local AI processing)

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

3. Install and set up Ollama (for AI features):
```bash
# Install Ollama
brew install ollama

# Start Ollama service
ollama serve

# Download Llama 3 model (in a new terminal)
ollama run llama3
```

4. Set up the database:
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Open Prisma Studio to view/edit data
npx prisma studio
```

5. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Database

The application uses **SQLite** for development with Prisma ORM. The database file (`dev.db`) is created automatically when you run migrations.

- **Prisma Studio**: Available at [http://localhost:5555](http://localhost:5555) when running `npx prisma studio`
- **Database Schema**: Located in `prisma/schema.prisma`
- **Migrations**: Stored in `prisma/migrations/`

For production, the database can be easily migrated to PostgreSQL by updating the `DATABASE_URL` in `.env`.


## Future Development Steps

- **Enhanced AI Models**: Support for additional local models (Mistral, Code Llama)
- **Advanced Analytics**: Deeper insights into user behavior and progress
- **Mobile App**: Native mobile application for on-the-go priority tracking
- **Production Database**: Migrate from SQLite to PostgreSQL
- **Release**: Production deployment and user onboarding
- **Team Features**: Collaborative priority setting and shared goals

## Tech Stack

### Frontend & Backend
- [Next.js](https://nextjs.org) - React framework with API routes
- TypeScript - Type safety
- Tailwind CSS - Styling
- shadcn/ui - Component library

### Database & ORM
- [Prisma](https://prisma.io) - Database ORM
- SQLite - Development database
- PostgreSQL - Production database (planned)

### AI & Machine Learning
- [Ollama](https://ollama.ai) - Local LLM server
- [Llama 3](https://llama.meta.com) - 8B parameter model for emotional intelligence
- Local Processing - 100% privacy-first AI

### Development Tools
- ESLint - Code linting
- Prettier - Code formatting
- Prisma Studio - Database management

## Inspiration

This project was inspired by the prioritization and training methodology outlined in Eric Horst's book "Maximum Climbing", which emphasizes structured, systematic approaches to goal achievement and skill development.
