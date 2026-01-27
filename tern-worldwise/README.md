This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

or

```bash
npx next dev -p 8000
```

Open [http://localhost:8000] with your browser to see the result.


## Database (Prisma + PostgreSQL / Neon)
### Prisma workflow (IMPORTANT – Windows)

⚠️ Do NOT run `next dev` or Prisma Studio while running Prisma CLI commands.
Windows locks the Prisma engine DLL.

Correct order:
# 1 Stop all node processes (next dev, prisma studio, etc.)
# 2 Reset DB and apply migrations
npx prisma migrate reset --force

# 3 Generate Prisma client
npx prisma generate

# 4 (Optional) Open Prisma Studio
npx prisma studio

# 5 Start Next.js AFTER Prisma commands
npm run dev


Make sure the `.env` file contains a valid connection string

```ts
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
```

Apply migrations and generate Prisma client

npx prisma migrate dev --name init
npx prisma generate
```

Open Prisma Studio (local DB UI) at [http://localhost:5555]:

npx prisma studio


## Editing the page

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

Deploy using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
