# Testing Guide - APPChanthana

## Table of Contents

1. [Overview](#overview)
2. [Testing Strategy](#testing-strategy)
3. [E2E Testing with Playwright](#e2e-testing-with-playwright)
4. [Test Organization](#test-organization)
5. [Writing Tests](#writing-tests)
6. [Page Object Model](#page-object-model)
7. [Test Data Management](#test-data-management)
8. [Running Tests](#running-tests)
9. [Debugging Tests](#debugging-tests)
10. [CI/CD Integration](#cicd-integration)
11. [Code Coverage](#code-coverage)
12. [Best Practices](#best-practices)
13. [Common Test Patterns](#common-test-patterns)
14. [Anti-Patterns to Avoid](#anti-patterns-to-avoid)

---

## Overview

APPChanthana uses **Playwright 1.55.0** for end-to-end testing, ensuring the application works correctly from a user's perspective across multiple browsers.

### Current Test Coverage

- **E2E Coverage**: 3% (1 basic navigation test)
- **Target Coverage**: 40% minimum
- **Browsers Tested**: Chromium, Firefox, WebKit (Safari)
- **Test Port**: http://localhost:3001 (separate from dev server)

### Testing Philosophy

- **User-Centric**: Test real user workflows, not implementation details
- **Real Data**: Use actual Supabase data where possible, seed data for consistency
- **Isolation**: Each test should be independent and repeatable
- **Speed**: Fast test execution with parallel running
- **Reliability**: Flake-free tests with proper waiting strategies

---

## Testing Strategy

### Testing Pyramid for APPChanthana

```
              /\
             /  \
           /  E2E  \          ← Playwright (3% → 40% target)
          /  Tests  \
         /____________\
        /              \
       /   Integration  \     ← TanStack Query + Supabase mocks
      /      Tests       \
     /____________________\
    /                      \
   /     Unit Tests         \  ← Component unit tests (future)
  /__________________________\
```

### What to Test with E2E (Playwright)

- ✅ **Critical User Flows**: Login, order creation, profile update
- ✅ **Multi-Page Workflows**: Cart → checkout → confirmation
- ✅ **Authentication**: Firebase login/logout, role-based access
- ✅ **Real-time Features**: Order status updates (when activated Phase 4)
- ✅ **Admin Functionality**: Dashboard, client management, order management
- ✅ **Responsive Behavior**: Mobile/tablet/desktop breakpoints

### What NOT to Test with E2E

- ❌ **Implementation Details**: Internal state, context values
- ❌ **Styling**: Visual appearance (use visual regression tools)
- ❌ **Pure Functions**: Utility functions (use unit tests)
- ❌ **API Responses**: Mock Supabase responses (use integration tests)

---

## E2E Testing with Playwright

### Playwright Configuration

**File**: `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'npm run dev -- -p 3001',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
  },
})
```

### Test Directory Structure

```
tests/
├── auth.spec.ts              # Authentication flows
├── order-flow.spec.ts        # Complete order workflow
├── admin.spec.ts             # Admin dashboard tests
├── profile.spec.ts           # User profile management
├── menu.spec.ts              # Menu browsing and filtering
├── cart.spec.ts              # Shopping cart operations
├── events.spec.ts            # Event booking
├── fixtures/
│   ├── test-users.ts         # Test user data
│   ├── test-plats.ts         # Test dish data
│   └── test-commandes.ts     # Test order data
└── utils/
    ├── auth-helpers.ts       # Authentication utilities
    ├── data-helpers.ts       # Data seeding utilities
    └── assertions.ts         # Custom assertions
```

---

## Test Organization

### Test File Naming Convention

```bash
# ✅ GOOD - Descriptive kebab-case names
auth.spec.ts
order-flow.spec.ts
admin-dashboard.spec.ts
user-profile.spec.ts

# ❌ AVOID - Vague or inconsistent names
test1.spec.ts
myTest.spec.ts
AuthTests.spec.ts
```

### Test Structure Pattern

```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  // Setup runs before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Common setup logic
  })

  // Teardown runs after each test
  test.afterEach(async ({ page }) => {
    // Cleanup logic (logout, clear data, etc.)
  })

  test('should perform specific action', async ({ page }) => {
    // Arrange
    await page.click('[data-testid="login-button"]')

    // Act
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.click('[data-testid="submit-login"]')

    // Assert
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible()
    await expect(page).toHaveURL(/.*profil/)
  })
})
```

---

## Writing Tests

### Test Naming Convention

```typescript
// ✅ GOOD - Descriptive test names with "should"
test('should allow user to login with valid credentials', async ({ page }) => {})
test('should display error message for invalid email', async ({ page }) => {})
test('should add item to cart when clicking add button', async ({ page }) => {})

// ❌ AVOID - Vague or technical test names
test('login works', async ({ page }) => {})
test('test email validation', async ({ page }) => {})
test('click button', async ({ page }) => {})
```

### Using data-testid Attributes

**Component with test attributes**:

```typescript
// components/LoginForm.tsx
export function LoginForm() {
  return (
    <form data-testid="login-form">
      <input
        type="email"
        data-testid="email-input"
        placeholder="Email"
      />
      <input
        type="password"
        data-testid="password-input"
        placeholder="Password"
      />
      <button
        type="submit"
        data-testid="submit-login"
      >
        Login
      </button>
    </form>
  )
}
```

**Test using data-testid**:

```typescript
test('should submit login form', async ({ page }) => {
  await page.goto('/login')

  await page.fill('[data-testid="email-input"]', 'user@example.com')
  await page.fill('[data-testid="password-input"]', 'password123')
  await page.click('[data-testid="submit-login"]')

  await expect(page.locator('[data-testid="user-menu"]')).toBeVisible()
})
```

### Waiting Strategies

```typescript
// ✅ GOOD - Wait for specific element
await page.waitForSelector('[data-testid="order-confirmation"]', {
  state: 'visible',
  timeout: 5000,
})

// ✅ GOOD - Wait for network request
await page.waitForResponse(
  response => response.url().includes('/api/commandes') && response.status() === 200
)

// ✅ GOOD - Wait for navigation
await Promise.all([
  page.waitForNavigation({ waitUntil: 'networkidle' }),
  page.click('[data-testid="submit-order"]'),
])

// ❌ AVOID - Arbitrary sleep
await page.waitForTimeout(3000)  // Flaky and slow
```

### Assertions

```typescript
// ✅ GOOD - Specific assertions
await expect(page.locator('[data-testid="total-price"]')).toHaveText('€25.50')
await expect(page.locator('[data-testid="error-message"]')).toBeVisible()
await expect(page).toHaveURL(/.*profil/)
await expect(page.locator('[data-testid="order-status"]')).toContainText('en_preparation')

// ✅ GOOD - Multiple assertions
const orderCard = page.locator('[data-testid="order-card-1"]')
await expect(orderCard).toBeVisible()
await expect(orderCard.locator('[data-testid="order-total"]')).toHaveText('€42.00')
await expect(orderCard.locator('[data-testid="order-status"]')).toHaveText('Prête')

// ❌ AVOID - Vague assertions
await expect(page.locator('div')).toBeVisible()
await expect(page).toHaveURL(/.*/)
```

---

## Page Object Model

Page Object Model (POM) reduces code duplication and improves test maintainability by encapsulating page-specific logic.

### Example: LoginPage

**File**: `tests/pages/LoginPage.ts`

```typescript
import { Page, Locator } from '@playwright/test'

export class LoginPage {
  readonly page: Page
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly submitButton: Locator
  readonly errorMessage: Locator

  constructor(page: Page) {
    this.page = page
    this.emailInput = page.locator('[data-testid="email-input"]')
    this.passwordInput = page.locator('[data-testid="password-input"]')
    this.submitButton = page.locator('[data-testid="submit-login"]')
    this.errorMessage = page.locator('[data-testid="error-message"]')
  }

  async goto() {
    await this.page.goto('/login')
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.submitButton.click()
  }

  async loginAndWaitForNavigation(email: string, password: string) {
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'networkidle' }),
      this.login(email, password),
    ])
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent()
  }
}
```

### Using Page Object in Tests

```typescript
import { test, expect } from '@playwright/test'
import { LoginPage } from './pages/LoginPage'

test.describe('Login', () => {
  test('should login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page)

    await loginPage.goto()
    await loginPage.loginAndWaitForNavigation('user@example.com', 'password123')

    await expect(page).toHaveURL(/.*profil/)
  })

  test('should display error for invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page)

    await loginPage.goto()
    await loginPage.login('invalid@example.com', 'wrongpassword')

    const errorMessage = await loginPage.getErrorMessage()
    expect(errorMessage).toContain('Invalid credentials')
  })
})
```

### Example: OrderFlowPage

**File**: `tests/pages/OrderFlowPage.ts`

```typescript
import { Page, Locator } from '@playwright/test'

export class OrderFlowPage {
  readonly page: Page
  readonly addToCartButtons: Locator
  readonly cartIcon: Locator
  readonly checkoutButton: Locator
  readonly confirmOrderButton: Locator

  constructor(page: Page) {
    this.page = page
    this.addToCartButtons = page.locator('[data-testid^="add-to-cart-"]')
    this.cartIcon = page.locator('[data-testid="cart-icon"]')
    this.checkoutButton = page.locator('[data-testid="checkout-button"]')
    this.confirmOrderButton = page.locator('[data-testid="confirm-order"]')
  }

  async gotoMenu() {
    await this.page.goto('/commander')
  }

  async addDishToCart(dishId: number) {
    await this.page.locator(`[data-testid="add-to-cart-${dishId}"]`).click()
  }

  async openCart() {
    await this.cartIcon.click()
  }

  async proceedToCheckout() {
    await this.checkoutButton.click()
  }

  async confirmOrder() {
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'networkidle' }),
      this.confirmOrderButton.click(),
    ])
  }

  async getCartItemCount(): Promise<string> {
    const cartBadge = this.page.locator('[data-testid="cart-badge"]')
    return await cartBadge.textContent() || '0'
  }
}
```

---

## Test Data Management

### Fixtures for Test Data

**File**: `tests/fixtures/test-users.ts`

```typescript
export const testUsers = {
  admin: {
    email: 'admin@chanthana.com',
    password: 'Admin123!',
    auth_user_id: 'test-admin-uid-001',
    role: 'admin' as const,
  },
  client: {
    email: 'client@example.com',
    password: 'Client123!',
    auth_user_id: 'test-client-uid-001',
    nom: 'Dupont',
    prenom: 'Jean',
    role: 'client' as const,
  },
  guest: {
    email: 'guest@example.com',
    password: 'Guest123!',
  },
}
```

**File**: `tests/fixtures/test-plats.ts`

```typescript
export const testPlats = [
  {
    id: 1,
    nom: 'Pad Thai Crevettes',
    description: 'Nouilles de riz sautées aux crevettes',
    prix: 12.50,
    categorie: 'Plats principaux',
    disponible: true,
    image: 'https://example.com/pad-thai.jpg',
  },
  {
    id: 2,
    nom: 'Tom Yum Goong',
    description: 'Soupe épicée aux crevettes',
    prix: 9.00,
    categorie: 'Soupes',
    disponible: true,
    image: 'https://example.com/tom-yum.jpg',
  },
]
```

### Seeding Test Data

**File**: `tests/utils/data-helpers.ts`

```typescript
import { supabase } from '@/lib/supabase'
import { testUsers, testPlats } from '../fixtures'

export async function seedTestData() {
  // Clear existing test data
  await supabase.from('client_db').delete().ilike('email', '%@example.com')
  await supabase.from('plats_db').delete().in('id', testPlats.map(p => p.id))

  // Insert test users
  await supabase.from('client_db').insert([
    {
      auth_user_id: testUsers.client.auth_user_id,
      email: testUsers.client.email,
      nom: testUsers.client.nom,
      prenom: testUsers.client.prenom,
      role: testUsers.client.role,
    },
  ])

  // Insert test plats
  await supabase.from('plats_db').insert(testPlats)
}

export async function cleanupTestData() {
  await supabase.from('client_db').delete().ilike('email', '%@example.com')
  await supabase.from('plats_db').delete().in('id', testPlats.map(p => p.id))
}
```

### Using Fixtures in Tests

```typescript
import { test } from '@playwright/test'
import { seedTestData, cleanupTestData } from './utils/data-helpers'

test.beforeAll(async () => {
  await seedTestData()
})

test.afterAll(async () => {
  await cleanupTestData()
})

test('should display test dishes in menu', async ({ page }) => {
  await page.goto('/commander')

  // Test uses seeded data
  await expect(page.locator('[data-testid="dish-1"]')).toContainText('Pad Thai Crevettes')
  await expect(page.locator('[data-testid="dish-2"]')).toContainText('Tom Yum Goong')
})
```

---

## Running Tests

### Command Line

```bash
# Run all tests (3 browsers in parallel)
npm run test:e2e

# Run specific test file
npm run test:e2e -- tests/auth.spec.ts

# Run tests in headed mode (visible browser)
npm run test:e2e -- --headed

# Run tests with UI mode (interactive)
npm run test:e2e -- --ui

# Run tests in specific browser
npm run test:e2e -- --project=chromium
npm run test:e2e -- --project=firefox
npm run test:e2e -- --project=webkit

# Run tests matching a pattern
npm run test:e2e -- --grep "login"

# Generate HTML report
npm run test:e2e -- --reporter=html

# Run with specific number of workers
npm run test:e2e -- --workers=4
```

### package.json Scripts

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:chromium": "playwright test --project=chromium",
    "test:e2e:report": "playwright show-report"
  }
}
```

---

## Debugging Tests

### Debug Mode

```bash
# Debug specific test
npm run test:e2e -- tests/auth.spec.ts --debug

# Debug with breakpoints
npm run test:e2e -- --debug

# Then use Playwright Inspector:
# - Step through test
# - Inspect selectors
# - View console logs
```

### Debug in VS Code

**`.vscode/launch.json`**:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Playwright: Debug E2E",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/playwright",
      "args": ["test", "--debug"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    },
    {
      "name": "Playwright: Debug Current File",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/playwright",
      "args": ["test", "${file}", "--debug"],
      "console": "integratedTerminal"
    }
  ]
}
```

### Screenshots and Traces

```typescript
// Automatic screenshot on failure (already configured)
use: {
  screenshot: 'only-on-failure',
  trace: 'on-first-retry',
}

// Manual screenshot
await page.screenshot({ path: 'screenshots/error-state.png' })

// Manual trace
await context.tracing.start({ screenshots: true, snapshots: true })
await page.goto('/')
// ... perform actions
await context.tracing.stop({ path: 'traces/trace.zip' })
```

### Viewing Traces

```bash
# Open trace file
npx playwright show-trace traces/trace.zip

# Trace includes:
# - Screenshots at each step
# - Network requests
# - Console logs
# - Timeline of actions
```

---

## CI/CD Integration

### GitHub Actions Workflow

**File**: `.github/workflows/playwright.yml`

```yaml
name: Playwright Tests

on:
  push:
    branches: [main, dev]
  pull_request:
    branches: [main, dev]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Run Playwright tests
        run: npm run test:e2e
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
          NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

### CI Environment Variables

Store sensitive credentials in GitHub Secrets:

```bash
# Required secrets
SUPABASE_URL
SUPABASE_ANON_KEY
FIREBASE_API_KEY
FIREBASE_AUTH_DOMAIN
FIREBASE_PROJECT_ID
FIREBASE_STORAGE_BUCKET
FIREBASE_MESSAGING_SENDER_ID
FIREBASE_APP_ID
```

---

## Code Coverage

### Current Coverage Status

- **E2E Coverage**: 3%
- **Target**: 40% minimum
- **Coverage Calculation**: (Tested user flows / Critical user flows) × 100

### Coverage Goals

| Feature | Current | Target | Priority |
|---------|---------|--------|----------|
| Authentication | 10% | 80% | 🔥 High |
| Order Flow | 0% | 100% | 🔥 High |
| Admin Dashboard | 0% | 60% | 🟡 Medium |
| Profile Management | 0% | 40% | 🟡 Medium |
| Menu Browsing | 5% | 30% | 🟢 Low |
| Events Booking | 0% | 30% | 🟢 Low |

### Tracking Coverage

**File**: `tests/coverage-tracking.md`

```markdown
# E2E Test Coverage Tracker

## Authentication (10% → 80%)
- [x] Navigate to login page
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Logout
- [ ] Session persistence
- [ ] Role-based access (admin vs client)

## Order Flow (0% → 100%)
- [ ] Browse menu
- [ ] Add item to cart
- [ ] Update cart quantities
- [ ] Remove item from cart
- [ ] Proceed to checkout
- [ ] Complete order
- [ ] View order confirmation
- [ ] View order history

## Admin Dashboard (0% → 60%)
- [ ] Access admin dashboard
- [ ] View all orders
- [ ] Update order status
- [ ] View client list
- [ ] Add new dish
- [ ] Edit existing dish
- [ ] Delete dish
```

---

## Best Practices

### 1. Test Independence

```typescript
// ✅ GOOD - Each test is self-contained
test('should add item to cart', async ({ page }) => {
  await page.goto('/commander')
  await page.click('[data-testid="add-to-cart-1"]')
  await expect(page.locator('[data-testid="cart-badge"]')).toHaveText('1')
})

test('should remove item from cart', async ({ page }) => {
  // Setup: Add item first
  await page.goto('/commander')
  await page.click('[data-testid="add-to-cart-1"]')

  // Test: Remove item
  await page.click('[data-testid="cart-icon"]')
  await page.click('[data-testid="remove-item-1"]')
  await expect(page.locator('[data-testid="cart-badge"]')).toHaveText('0')
})

// ❌ AVOID - Tests depend on execution order
test('add item', async ({ page }) => {
  await page.click('[data-testid="add-to-cart-1"]')
})

test('remove item', async ({ page }) => {
  // FAILS if run alone - depends on previous test
  await page.click('[data-testid="remove-item-1"]')
})
```

### 2. Use Specific Selectors

```typescript
// ✅ GOOD - data-testid attributes
await page.locator('[data-testid="submit-order"]').click()

// ✅ GOOD - Role-based selectors
await page.getByRole('button', { name: 'Submit Order' }).click()

// ❌ AVOID - CSS classes (can change)
await page.locator('.btn-primary').click()

// ❌ AVOID - Positional selectors (brittle)
await page.locator('div:nth-child(3) > button:first-child').click()
```

### 3. Avoid Hard-Coded Waits

```typescript
// ✅ GOOD - Wait for specific condition
await page.waitForSelector('[data-testid="order-success"]', { state: 'visible' })

// ✅ GOOD - Wait for network request
await page.waitForResponse(response =>
  response.url().includes('/api/commandes') && response.ok()
)

// ❌ AVOID - Arbitrary timeout
await page.waitForTimeout(5000)
```

### 4. Group Related Tests

```typescript
// ✅ GOOD - Logical grouping with describe blocks
test.describe('Order Flow', () => {
  test.describe('Cart Operations', () => {
    test('should add item to cart', async ({ page }) => {})
    test('should remove item from cart', async ({ page }) => {})
    test('should update item quantity', async ({ page }) => {})
  })

  test.describe('Checkout', () => {
    test('should proceed to checkout', async ({ page }) => {})
    test('should complete order', async ({ page }) => {})
  })
})
```

### 5. Use Page Object Model for Complex Pages

```typescript
// ✅ GOOD - Page Object encapsulates logic
const adminPage = new AdminDashboardPage(page)
await adminPage.goto()
await adminPage.updateOrderStatus(123, 'prete')
await adminPage.verifyOrderStatusUpdated(123, 'prete')

// ❌ AVOID - Inline selectors everywhere
await page.goto('/admin')
await page.click('[data-testid="order-123"]')
await page.selectOption('[data-testid="status-select"]', 'prete')
await page.click('[data-testid="save-status"]')
await expect(page.locator('[data-testid="order-123-status"]')).toHaveText('prete')
```

---

## Common Test Patterns

### Authentication Test Pattern

```typescript
// tests/auth.spec.ts
import { test, expect } from '@playwright/test'
import { LoginPage } from './pages/LoginPage'
import { testUsers } from './fixtures/test-users'

test.describe('Authentication', () => {
  test('should login client user', async ({ page }) => {
    const loginPage = new LoginPage(page)

    await loginPage.goto()
    await loginPage.loginAndWaitForNavigation(
      testUsers.client.email,
      testUsers.client.password
    )

    await expect(page).toHaveURL(/.*profil/)
    await expect(page.locator('[data-testid="user-name"]')).toContainText('Jean Dupont')
  })

  test('should login admin user and redirect to admin dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page)

    await loginPage.goto()
    await loginPage.loginAndWaitForNavigation(
      testUsers.admin.email,
      testUsers.admin.password
    )

    await expect(page).toHaveURL(/.*admin/)
    await expect(page.locator('[data-testid="admin-menu"]')).toBeVisible()
  })

  test('should logout user', async ({ page }) => {
    const loginPage = new LoginPage(page)

    // Login first
    await loginPage.goto()
    await loginPage.loginAndWaitForNavigation(
      testUsers.client.email,
      testUsers.client.password
    )

    // Logout
    await page.click('[data-testid="user-menu"]')
    await page.click('[data-testid="logout-button"]')

    await expect(page).toHaveURL('/')
    await expect(page.locator('[data-testid="login-button"]')).toBeVisible()
  })
})
```

### Order Flow Test Pattern

```typescript
// tests/order-flow.spec.ts
import { test, expect } from '@playwright/test'
import { OrderFlowPage } from './pages/OrderFlowPage'
import { LoginPage } from './pages/LoginPage'
import { testUsers } from './fixtures/test-users'

test.describe('Order Flow', () => {
  let orderPage: OrderFlowPage
  let loginPage: LoginPage

  test.beforeEach(async ({ page }) => {
    orderPage = new OrderFlowPage(page)
    loginPage = new LoginPage(page)

    // Login before each test
    await loginPage.goto()
    await loginPage.loginAndWaitForNavigation(
      testUsers.client.email,
      testUsers.client.password
    )
  })

  test('should complete full order flow', async ({ page }) => {
    // Browse menu
    await orderPage.gotoMenu()
    await expect(page.locator('[data-testid="menu-title"]')).toBeVisible()

    // Add items to cart
    await orderPage.addDishToCart(1)
    await orderPage.addDishToCart(2)

    // Verify cart count
    const cartCount = await orderPage.getCartItemCount()
    expect(cartCount).toBe('2')

    // Open cart
    await orderPage.openCart()
    await expect(page.locator('[data-testid="cart-drawer"]')).toBeVisible()

    // Proceed to checkout
    await orderPage.proceedToCheckout()
    await expect(page).toHaveURL(/.*checkout/)

    // Confirm order
    await orderPage.confirmOrder()

    // Verify order confirmation
    await expect(page).toHaveURL(/.*confirmation/)
    await expect(page.locator('[data-testid="order-success-message"]')).toBeVisible()
  })

  test('should persist cart items across page refresh', async ({ page }) => {
    await orderPage.gotoMenu()
    await orderPage.addDishToCart(1)

    // Refresh page
    await page.reload()

    // Verify cart persisted
    const cartCount = await orderPage.getCartItemCount()
    expect(cartCount).toBe('1')
  })
})
```

### Admin Dashboard Test Pattern

```typescript
// tests/admin.spec.ts
import { test, expect } from '@playwright/test'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { LoginPage } from './pages/LoginPage'
import { testUsers } from './fixtures/test-users'

test.describe('Admin Dashboard', () => {
  let adminPage: AdminDashboardPage
  let loginPage: LoginPage

  test.beforeEach(async ({ page }) => {
    adminPage = new AdminDashboardPage(page)
    loginPage = new LoginPage(page)

    // Login as admin
    await loginPage.goto()
    await loginPage.loginAndWaitForNavigation(
      testUsers.admin.email,
      testUsers.admin.password
    )
  })

  test('should access admin dashboard', async ({ page }) => {
    await adminPage.goto()

    await expect(page).toHaveURL(/.*admin/)
    await expect(page.locator('[data-testid="admin-title"]')).toHaveText('Admin Dashboard')
  })

  test('should update order status', async ({ page }) => {
    await adminPage.goto()

    // Select order
    await adminPage.selectOrder(1)

    // Update status
    await adminPage.updateOrderStatus('prete')

    // Verify success message
    await expect(page.locator('[data-testid="success-toast"]')).toContainText('Order status updated')

    // Verify status changed
    const status = await adminPage.getOrderStatus(1)
    expect(status).toBe('prete')
  })

  test('should add new dish to menu', async ({ page }) => {
    await adminPage.gotoMenuManagement()
    await adminPage.clickAddDish()

    await adminPage.fillDishForm({
      nom: 'Test Dish',
      description: 'Test Description',
      prix: 15.00,
      categorie: 'Plats principaux',
    })

    await adminPage.submitDishForm()

    await expect(page.locator('[data-testid="success-toast"]')).toContainText('Dish added successfully')
    await expect(page.locator('[data-testid="dish-list"]')).toContainText('Test Dish')
  })
})
```

### Responsive Test Pattern

```typescript
// tests/responsive.spec.ts
import { test, expect, devices } from '@playwright/test'

test.describe('Responsive Design', () => {
  test('should display mobile navigation', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize(devices['iPhone 12'].viewport)

    await page.goto('/')

    // Mobile menu should be visible
    await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible()

    // Desktop menu should be hidden
    await expect(page.locator('[data-testid="desktop-menu"]')).not.toBeVisible()
  })

  test('should display desktop navigation', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })

    await page.goto('/')

    // Desktop menu should be visible
    await expect(page.locator('[data-testid="desktop-menu"]')).toBeVisible()

    // Mobile menu button should be hidden
    await expect(page.locator('[data-testid="mobile-menu-button"]')).not.toBeVisible()
  })
})
```

---

## Anti-Patterns to Avoid

### 1. Testing Implementation Details

```typescript
// ❌ AVOID - Testing internal state
test('should update state variable', async ({ page }) => {
  // Don't test React state directly
  await page.evaluate(() => {
    const state = window.__REACT_STATE__
    return state.isOpen === true
  })
})

// ✅ GOOD - Test user-visible behavior
test('should open modal', async ({ page }) => {
  await page.click('[data-testid="open-modal"]')
  await expect(page.locator('[data-testid="modal"]')).toBeVisible()
})
```

### 2. Overly Broad Selectors

```typescript
// ❌ AVOID - Generic selectors
await page.click('button')
await page.locator('div').textContent()

// ✅ GOOD - Specific selectors
await page.click('[data-testid="submit-order"]')
await page.locator('[data-testid="order-total"]').textContent()
```

### 3. Not Cleaning Up After Tests

```typescript
// ❌ AVOID - Leaving test data behind
test('should create order', async ({ page }) => {
  // Creates order but doesn't clean up
  await createOrder()
})

// ✅ GOOD - Clean up after test
test('should create order', async ({ page }) => {
  const orderId = await createOrder()

  // Test logic...

  // Cleanup
  await deleteOrder(orderId)
})

// ✅ EVEN BETTER - Use afterEach
test.afterEach(async () => {
  await cleanupTestData()
})
```

### 4. Hardcoded Test Data

```typescript
// ❌ AVOID - Hardcoded values in tests
test('should login', async ({ page }) => {
  await page.fill('[data-testid="email"]', 'test@example.com')
  await page.fill('[data-testid="password"]', 'password123')
})

// ✅ GOOD - Use fixtures
import { testUsers } from './fixtures/test-users'

test('should login', async ({ page }) => {
  await page.fill('[data-testid="email"]', testUsers.client.email)
  await page.fill('[data-testid="password"]', testUsers.client.password)
})
```

### 5. Ignoring Test Flakiness

```typescript
// ❌ AVOID - Masking flakiness with retries
test.describe('Flaky Tests', () => {
  test.use({ retries: 5 })  // Bad practice!

  test('sometimes fails', async ({ page }) => {
    // Race condition not fixed
  })
})

// ✅ GOOD - Fix root cause
test('reliable test', async ({ page }) => {
  // Proper waiting strategy
  await page.waitForSelector('[data-testid="element"]', { state: 'visible' })
})
```

---

## Related Documentation

- [Development Setup](./development-setup.md) - Environment configuration for testing
- [Coding Standards](./coding-standards.md) - TypeScript and React best practices
- [State Management](./state-management.md) - TanStack Query testing patterns
- [Performance Optimization](./performance-optimization.md) - Lighthouse testing strategies
- [CI/CD Guide](./deployment-checklist.md) - Automated test pipelines

---

**Last Updated**: 2025-10-06
**Target E2E Coverage**: 40% (Current: 3%)
**Playwright Version**: 1.55.0
**Test Browsers**: Chromium, Firefox, WebKit
