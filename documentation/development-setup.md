# Development Setup - APPChanthana

## Prerequisites

### Required Software

| Software | Version | Installation |
|----------|---------|--------------|
| **Node.js** | ≥18.17.0 | [nodejs.org](https://nodejs.org) |
| **npm** | ≥9.0.0 | Bundled with Node.js |
| **Git** | Latest | [git-scm.com](https://git-scm.com) |
| **VS Code** | Latest | [code.visualstudio.com](https://code.visualstudio.com) (recommended) |

### Verify Installations

```bash
node --version   # Should be ≥18.17.0
npm --version    # Should be ≥9.0.0
git --version    # Any recent version
```

---

## Initial Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd APPChanthana
```

### 2. Install Dependencies

```bash
npm install
```

**Dependencies Installed** (from package.json):
- Next.js 15.5.4
- React 19.1.1
- Supabase 2.58.0
- Firebase 12.3.0
- TanStack Query 5.90.2
- Tailwind CSS 4.1.12
- shadcn/ui components
- Playwright 1.55.0

### 3. Environment Variables Setup

Create `.env.local` file at project root:

```bash
# Copy from .env.example
cp .env.example .env.local
```

**Required Environment Variables**:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://lkaiwnkyoztebplqoifc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_DB_PASSWORD=your_db_password

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

**Security Note**: `.env.local` is gitignored - NEVER commit credentials!

### 4. Verify Supabase Connection

```bash
# Test script to verify Supabase connection
node scripts/get_db_data.js
```

Expected output:
```
✅ Connexion Supabase réussie
📊 Tables disponibles: client_db, commande_db, details_commande_db, plats_db, extras_db, evenements_db
```

---

## Development Workflow

### Start Development Server

```bash
npm run dev
```

**Server Details**:
- URL: http://localhost:3000
- Hot reload: Enabled
- Debug mode: Enabled (Node.js inspector)
- Turbopack: Enabled for faster builds

**Console Output**:
```
▲ Next.js 15.5.4
- Local:        http://localhost:3000
- Environments: .env.local

✓ Ready in 2.3s
○ Compiling /
✓ Compiled / in 1.8s
```

### Access Application

- **Homepage**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **Menu/Order**: http://localhost:3000/commander
- **Events**: http://localhost:3000/evenements
- **Profile**: http://localhost:3000/profil (requires login)

---

## Database Setup

### Local Supabase (Optional)

For local development with Supabase CLI:

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize local project
supabase init

# Start local Supabase
supabase start
```

**Local URLs**:
- API: http://localhost:54321
- Studio: http://localhost:54323
- Inbucket (Email): http://localhost:54324

### Seed Database (Production)

Run seed scripts to populate initial data:

```bash
# Create sample clients
node scripts/seed-clients.js

# Create sample plats
node scripts/seed-plats.js

# Create sample extras
node scripts/seed-extras.js
```

---

## Firebase Setup

### Firebase Console Configuration

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project or create new one
3. Enable Authentication > Email/Password provider
4. Copy configuration to `.env.local`

### Test Firebase Auth

```bash
# Test signup flow
node scripts/test-firebase-auth.js
```

---

## Development Scripts

### Core Scripts

```bash
# Development server with debug mode
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code (ESLint + TypeScript)
npm run lint

# Type checking
npm run type-check

# Format code (Prettier - if configured)
npm run format
```

### Testing Scripts

```bash
# Run E2E tests (Playwright)
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e -- --ui

# Run specific test file
npm run test:e2e -- tests/auth.spec.ts

# Generate test report
npm run test:e2e -- --reporter=html

# Debug E2E tests
npm run test:e2e -- --debug
```

### Database Scripts

```bash
# Get database data (all tables)
node scripts/get_db_data.js

# Analyze database structure
node scripts/analyze-db-structure.js

# Debug client link (Firebase UID sync)
node scripts/debug-client-link.js

# Test RLS policies (when activated)
node scripts/test-rls-policies.js
```

### Docker Scripts (if using Docker)

```bash
# Check Docker status
npm run docker:status

# Clean Supabase local containers
npm run docker:clean:supalocal
```

---

## VS Code Setup (Recommended)

### Required Extensions

Install from Extensions marketplace:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",          // ESLint
    "esbenp.prettier-vscode",          // Prettier
    "bradlc.vscode-tailwindcss",       // Tailwind IntelliSense
    "ms-playwright.playwright",        // Playwright Test Runner
    "supabase.supabase-vscode",        // Supabase integration
    "firebase.vscode-firebase-explorer" // Firebase explorer
  ]
}
```

Save as `.vscode/extensions.json` in project root.

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ],
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

### Debugging Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    },
    {
      "name": "Playwright: Debug E2E",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/playwright",
      "args": ["test", "--debug"]
    }
  ]
}
```

---

## Git Workflow

### Branch Strategy

```bash
# Main branch (production-ready)
main

# Development branch
dev

# Feature branches
feature/nom-fonctionnalite

# Bugfix branches
bugfix/nom-bug

# Hotfix branches (production)
hotfix/nom-hotfix
```

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org):

```bash
# Features
git commit -m "feat: add real-time order updates"
git commit -m "feat(auth): implement admin role detection"

# Bug fixes
git commit -m "fix: resolve date validation issue in profile"
git commit -m "fix(cart): prevent duplicate items"

# Documentation
git commit -m "docs: update hybrid auth architecture"

# Refactoring
git commit -m "refactor: split mega file useSupabaseData.ts"

# Tests
git commit -m "test: add E2E tests for order flow"

# Performance
git commit -m "perf: optimize image loading with next/image"

# Chores
git commit -m "chore: update dependencies to latest versions"
```

### Daily Workflow

```bash
# Start work on new feature
git checkout dev
git pull origin dev
git checkout -b feature/nouvelle-fonctionnalite

# Make changes and commit
git add .
git commit -m "feat: implement nouvelle fonctionnalite"

# Push to remote
git push origin feature/nouvelle-fonctionnalite

# Create Pull Request on GitHub
# After review and merge, delete feature branch
git checkout dev
git pull origin dev
git branch -d feature/nouvelle-fonctionnalite
```

---

## Troubleshooting

### Issue: Port 3000 Already in Use

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>

# Alternative: Use different port
npm run dev -- -p 3001
```

### Issue: Supabase Connection Failed

**Check**:
1. Environment variables in `.env.local`
2. Internet connection
3. Supabase project status at https://app.supabase.com

```bash
# Test connection
node scripts/get_db_data.js

# Expected error messages:
# - "Invalid API key" → Check NEXT_PUBLIC_SUPABASE_ANON_KEY
# - "Network error" → Check internet connection
# - "RLS policy violation" → RLS disabled, should work
```

### Issue: Firebase Auth Not Working

**Check**:
1. Firebase config in `.env.local`
2. Email/Password provider enabled in Firebase Console
3. Firebase project billing status (free tier limits)

```bash
# Test Firebase connection
node scripts/test-firebase-auth.js
```

### Issue: TypeScript Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Type check
npm run type-check
```

### Issue: E2E Tests Failing

```bash
# Install Playwright browsers
npx playwright install

# Run tests in headed mode (visible browser)
npm run test:e2e -- --headed

# Debug specific test
npm run test:e2e -- tests/auth.spec.ts --debug
```

---

## Performance Optimization

### Development Build Speed

**Turbopack** is enabled by default in `next.config.ts`:

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  experimental: {
    turbo: true, // Faster builds in development
  },
}
```

### Hot Module Replacement (HMR)

Fast Refresh is enabled by default - changes reload instantly without full page refresh.

### Build Analysis

```bash
# Analyze production bundle size
npm run build
npm run analyze

# Check bundle size
du -sh .next/static/**/*.js
```

---

## Environment Management

### Multiple Environments

```bash
# Development (local)
.env.local              # Gitignored, local overrides

# Production (Vercel/deployment)
.env.production         # Production-specific variables

# Test (E2E)
.env.test              # Test-specific variables
```

### Environment Validation

Create `lib/env-validation.ts`:

```typescript
// Validate required environment variables on startup
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
]

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`)
  }
})
```

---

## Database Migrations

### Supabase Migrations (Future)

```bash
# Create new migration
supabase migration new add_rls_policies

# Apply migrations
supabase db push

# Reset database (caution!)
supabase db reset
```

---

## Deployment Checklist

Before deploying to production:

- [ ] Environment variables configured in hosting platform
- [ ] `.env.local` not committed to Git
- [ ] RLS policies activated (Phase 4)
- [ ] Real-time subscriptions configured (Phase 4)
- [ ] E2E tests passing (npm run test:e2e)
- [ ] Production build successful (npm run build)
- [ ] Lighthouse score >90 (Performance, Accessibility)
- [ ] No console.logs in production code
- [ ] Firebase billing configured (if needed)
- [ ] Supabase project upgraded (if needed)

---

## Useful Resources

### Documentation Links

- [Next.js 15 Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev)
- [Supabase Docs](https://supabase.com/docs)
- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [Playwright Docs](https://playwright.dev/docs/intro)

### Internal Documentation

- [Architecture Overview](./architecture-overview.md)
- [Hybrid Auth Architecture](./hybrid-auth-architecture.md)
- [Database Schema](./database-schema.md)
- [State Management](./state-management.md)
- [Coding Standards](./coding-standards.md)

---

## Support & Community

- **GitHub Issues**: Report bugs and feature requests
- **Discord**: Join developer community (if applicable)
- **Email**: support@chanthana.com (if applicable)

---

## Quick Start Summary

```bash
# 1. Clone repository
git clone <repository-url>
cd APPChanthana

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# 4. Start development server
npm run dev

# 5. Open browser
# → http://localhost:3000

# 6. Run tests (optional)
npm run test:e2e

# 7. Build for production (when ready)
npm run build
```

**You're ready to develop!** 🚀
