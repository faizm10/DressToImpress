# Dress For Success Platform

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org) (App Router)
- **Languages:** TypeScript, JavaScript
- **Styling:** Tailwind CSS (utility-first CSS framework)
- **UI:** Custom React components, Lucide icons
- **Backend/Database:** [Supabase](https://supabase.com) (auth, storage, database)
- **Email Notifications:** Resend/SendGrid/SMTP support
- **Package Management:** npm
- **Other:** PostCSS, ESLint, [Geist font](https://vercel.com/font)

## Project Structure

```
frontend/
├── app/              # Next.js app directory (routes, pages, layouts)
│   ├── auth/         # Authentication pages (login, signup, etc.)
│   ├── dashboard/    # Main dashboard and related pages
│   └── ...
├── components/       # Reusable React components (UI, forms, etc.)
├── hooks/            # Custom React hooks
├── lib/              # Library code (e.g., Supabase client)
├── public/           # Static assets (images, logos, etc.)
├── types/            # TypeScript type definitions
├── node_modules/     # Installed dependencies
├── package.json      # Project metadata and dependencies
├── tsconfig.json     # TypeScript configuration
├── next.config.ts    # Next.js configuration
├── postcss.config.mjs# PostCSS configuration
├── eslint.config.mjs # ESLint configuration
└── README.md         # Project documentation
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Email Notifications

The system includes automatic email notifications for attire requests. When a user submits an attire request, an email is sent to `langcareers3@gmail.com` with details about the request.

### Setup

See [EMAIL_SETUP.md](./EMAIL_SETUP.md) for detailed setup instructions.

### Features

- **Production Ready:** Fully configured and tested email service
- **Professional Templates:** HTML-formatted emails with student and request details
- **Error Handling:** Graceful fallback if email service fails
- **Reliable Delivery:** Using Resend for high deliverability
- **Environment Configurable:** Easy to change recipient via environment variables

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
