# Ardent Archive Automator - Setup Guide

## Step 1: Initialization Commands

Since you are running this in a web-container or need the reference commands for a local Next.js environment, here are the commands requested in the prompt:

```bash
# 1. Initialize Next.js project
npx create-next-app@latest ardent-archive --typescript --tailwind --eslint

# 2. Navigate to directory
cd ardent-archive

# 3. Install dependencies
npm install @google/genai prisma @prisma/client clsx tailwind-merge framer-motion lucide-react

# 4. Initialize Prisma
npx prisma init
```

## Step 2: Database Setup

Ensure your `.env` file contains your database connection string:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ardent_archive?schema=public"
API_KEY="your_gemini_api_key"
```

To run the migration based on `prisma/schema.prisma`:

```bash
npx prisma migrate dev --name init
```

## Current State
The application shell is built with the Ardent aesthetics (Black/Cream/Gold). Types are exported in `types.ts` to match the schema.
