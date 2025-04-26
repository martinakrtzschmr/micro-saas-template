#NextJs SaaS template project

This project is a boilerplate for future SaaS projects. It will organize files, detail data flow and implement design pattern principles.

## File structure

```
📁 my-nextjs-project/
│
├── 📁 app/
│   ├── 📁 (project)/               # Route group (e.g., main layout/pages)
│   │   ├── 📄 layout.tsx           # Shared layout for the group
│   │   └── 📄 page.tsx             # Home page or root route
│   │
│   ├── 📁 api/                     # API routes
│   │   └── 📁 users/
│   │       └── 📄 route.ts        # API handler for /api/users
│   │
│   ├── 📁 actions/                 # Server Actions (e.g. form submissions)
│   │   └── 📄 submitPost.ts       # `use server` function
│   │
│   ├── 📁 components/              # Reusable UI components
│   │   ├── 📄 Button.tsx
│   │   └── 📄 Navbar.tsx
│   │
│   ├── 📁 hooks/                   # Custom hooks
│   │   └── 📄 useAuth.ts
│   │
│   ├── 📁 lib/                     # Utilities (e.g., helpers, validators)
│   │   └── 📄 formatDate.ts
│   │
│   └── 📁 server/                  # Server-side only logic (DB, APIs)
│       └── 📄 getUserById.ts
│
├── 📁 public/                      # Static assets (images, favicon, etc.)
│   └── 📄 favicon.ico
│
├── 📁 node_modules/               # Project dependencies (auto-generated)
│
├── 📄 .gitignore                  # Ignore unnecessary files in Git
├── 📄 eslint.config.mjs          # ESLint config (flat config)
├── 📄 next-env.d.ts              # Auto-generated Next.js TS types
├── 📄 next.config.ts             # Next.js configuration
├── 📄 package.json               # Project metadata and dependencies
├── 📄 package-lock.json          # Dependency lock file
├── 📄 postcss.config.mjs         # PostCSS (e.g., Tailwind setup)
├── 📄 tsconfig.json              # TypeScript configuration
└── 📄 README.md                  # Project documentation
```

## Concepts Implemented on this project

Stripe integration - Creating subscriptions, item checkout and portal with user information

Firebase integration - Saving users information

Google login integration - Users can login with Google accounts

## Concepts to be implemented

Add product list - Use Stripe for pricing

Create and add App UI - Possibly use Figma for design

Add Mercado Pago integration

Check on page SEO created by Next - not sure if optimized

## Known Issues

--

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
