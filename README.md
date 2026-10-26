# Avatar Creator

Fun UI Avatar Creator

Live at **https://mimsy.me/**

Built using:
React, Vite, pnpm, Dart Sass, and a little help from my friend Claude

### Install dependencies
```
pnpm install
```

### Start dev environment
```
pnpm start
```

### Build production environment
```
pnpm build
```

### Deploy production environment
Pushes to `main` deploy automatically through GitHub Actions (`.github/workflows/deploy.yml`): install, `pnpm build`, then `pnpm run deploy`. To deploy manually from your machine:
```
pnpm run deploy
```
Deploy doesn't build, so run `pnpm build` first. It rsyncs `dist/` to the server behind https://mimsy.me/ (`/var/www/mimsy.me`).
(`pnpm deploy` on its own is a built-in pnpm command, so the `run` is required.)
