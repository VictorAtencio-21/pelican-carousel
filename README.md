This is a pelican carousel or photo slideshow project built in Nextjs. Using shacdn for components and lucide for icons.

## Getting Started

First run (I used pnpm),

```bash
npm install
# or
pnpm install
```

setup the env variables, they are:

```
UNSPLASH_ACCESS_KEY=KEY_SENT_ON_EMAIL
UNSPLASH_SECRET_KEY=KEY_SENT_ON_EMAIL
```

then run the development server using pnpm or npm.

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000] and the carousel should pop up right on screen.

For running the tests run 

```bash
npx vitest --clearCache
npx vitest
```