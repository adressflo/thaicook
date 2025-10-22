# Documentation Brute des Technologies du Projet

Ce document contient les informations brutes extraites de `context7` concernant les technologies clés du projet.

---

# Documentation Next.js

================
CODE SNIPPETS
================
TITLE: Type-Safe Data Fetching in a Next.js Page Component
DESCRIPTION: This example shows how to fetch data within a Next.js App Router page using TypeScript. The `getData` function fetches data from an API, and the `Page` component awaits its response. The key benefit is that the data returned from the server-side fetch is not serialized, allowing for the use of complex types like `Date`, `Map`, and `Set` directly, which provides end-to-end type safety.

SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/05-config/02-typescript.mdx#_snippet_0

LANGUAGE: tsx
CODE:
```
async function getData() {
  const res = await fetch('https://api.example.com/...');
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.
  return res.json();
}

export default async function Page() {
  const name = await getData();

  return '...';
}
```

---

# Documentation Supabase

================
CODE SNIPPETS
================
TITLE: Initialize Supabase Server Client for Next.js App Router
DESCRIPTION: Shows how to create a Supabase server client object for use in Server Components, Server Actions, and Route Handlers in a Next.js App Router application. This approach uses the `@supabase/ssr` package, which is designed for server-side rendering and cookie-based authentication.

SOURCE: https://supabase.com/docs/guides/auth/server-side/nextjs

LANGUAGE: tsxCODE:
```
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `cookies().set()` method can only be called in a Server Component or Route Handler.
            // This error is typically thrown when a Server Action attempts to set a cookie.
            console.warn('Could not set cookie from Server Action:', error);
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            console.warn('Could not remove cookie from Server Action:', error);
          }
        },
      },
    }
  )
}
```

---

# Documentation TanStack React Query

================
CODE SNIPPETS
================
TITLE: Hydrate TanStack Query with `initialData` in Next.js and Remix
DESCRIPTION: This section illustrates a quick method to hydrate TanStack Query data using the `initialData` option in `useQuery`, bypassing the `dehydrate`/`hydrate` APIs. Examples are provided for Next.js with `getServerSideProps` and Remix with `loader` functions. It also outlines several important tradeoffs and limitations of this approach, such as potential issues with data freshness and cache updates.

SOURCE: https://github.com/tanstack/query/blob/main/docs/framework/react/guides/ssr.md#_snippet_1

LANGUAGE: tsx
CODE:
```
export async function getServerSideProps() {
  const posts = await getPosts()
  return { props: { posts } }
}

function Posts(props) {
  const { data } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
    initialData: props.posts,
  })

  // ...
}
```

---

# Documentation Firebase

================
CODE SNIPPETS
================
TITLE: Firebase Authentication Package
DESCRIPTION: The Firebase Authentication package provides SDKs for user authentication with various providers like email/password, Google, Facebook, and more.

SOURCE: https://github.com/firebase/firebase-js-sdk/blob/main/docs-devsite/index.md#_snippet_4

LANGUAGE: APIDOC
CODE:
```
## Auth Package

### Description
Firebase Authentication

### Method
N/A

### Endpoint
N/A

### Parameters
N/A

### Request Example
N/A

### Response
N/A
```

---

# Documentation Radix UI

================
CODE SNIPPETS
================
TITLE: Track Version Changes with pnpm changeset
DESCRIPTION: This command is used to mark the appropriate type of change for packages during the pull request process. These changes are consumed when publishing new versions. It's important to commit these files along with your code changes.

SOURCE: https://github.com/radix-ui/primitives/blob/main/release-process.md#_snippet_0

LANGUAGE: bash
CODE:
```
pnpm changeset
```

---

# Documentation Zod

================
CODE SNIPPETS
================
TITLE: Correcting `any` Type Inference in Zod Schema Parsing with `z.infer` (TypeScript)
DESCRIPTION: To resolve the `any` type inference issue when parsing data with generic Zod schemas, a type assertion using `z.infer<T>` is applied. This crucial addition correctly types the function's return value according to the schema's specific inferred type, thereby restoring full type safety.

SOURCE: https://github.com/colinhacks/zod/blob/main/packages/docs-v3/README.md#_snippet_129

LANGUAGE: typescript
CODE:
```
function parseData<T extends z.ZodTypeAny>(data: unknown, schema: T) {
  return schema.parse(data) as z.infer<T>;
  //                        ^^^^^^^^^^^^^^ <- add this
}

parseData("sup", z.string());
// => string
```

---

# Documentation React Hook Form

================
CODE SNIPPETS
================
TITLE: React Hook Form Resolver Type
DESCRIPTION: Documentation for the Resolver type, which allows integration with external validation schema libraries like Yup or Zod.

SOURCE: https://github.com/react-hook-form/react-hook-form/blob/master/examples/README.md#_snippet_31

LANGUAGE: typescript
CODE:
```
// Type definition for Resolver
// See: https://codesandbox.io/s/react-hook-form-resolver-rvspp
```

---

# Documentation Playwright

================
CODE SNIPPETS
================
TITLE: Configure React/Next.js Component Test Hooks in Playwright
DESCRIPTION: These JavaScript/JSX examples detail the use of `beforeMount` hooks for React/Next.js component testing with Playwright. The first snippet shows how to mount a React component and pass mock router data via `hooksConfig`. The second snippet demonstrates how to implement a `beforeMount` hook in `playwright/index.js` to redefine Next.js's `useRouter` hook, allowing tests to control router behavior and inject specific test data.

SOURCE: https://github.com/microsoft/playwright/blob/main/docs/src/release-notes-js.md#_snippet_72

LANGUAGE: javascript
CODE:
```
import { test } from '@playwright/experimental-ct-react';
import { Component } from './mycomponent';

test('should work', async ({ mount }) => {
  const component = await mount(<Component></Component>, {
    // Pass mock value from test into `beforeMount`.
    hooksConfig: {
      router: {
        query: { page: 1, per_page: 10 },
        asPath: '/posts'
      }
    }
  });
});
```

---

# Documentation Tailwind CSS

================
CODE SNIPPETS
================
TITLE: Manage @apply and Theme Variables in Vue/Svelte/CSS Modules with Tailwind CSS v4
DESCRIPTION: Tailwind CSS v4 changes how `@apply` and theme variables behave in separately bundled stylesheets (e.g., Vue/Svelte `<style>` blocks or CSS modules). These examples show two approaches: using the `@reference` directive to import definitions without duplication or directly utilizing CSS variables for improved performance.

SOURCE: https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/docs/upgrade-guide.mdx#_snippet_39

LANGUAGE: html
CODE:
```
<template>
  <h1>Hello world!</h1>
</template>

<style>
  /* [!code highlight:2] */
  @reference "../../app.css";

  h1 {
    @apply text-2xl font-bold text-red-500;
  }
</style>
```

---

# Documentation Recharts

================
CODE SNIPPETS
================
TITLE: Render a basic LineChart with Recharts in React
DESCRIPTION: This example demonstrates how to create a simple LineChart component using Recharts. It showcases the declarative composition of Recharts components by including an X-axis, Tooltip, CartesianGrid, and two Line series within the chart.

SOURCE: https://github.com/recharts/recharts/blob/main/README.md#_snippet_0

LANGUAGE: jsx
CODE:
```
<LineChart width={400} height={400} data={data}>
  <XAxis dataKey="name" />
  <Tooltip />
  <CartesianGrid stroke="#f5f5f5" />
  <Line type="monotone" dataKey="uv" stroke="#ff7300" />
  <Line type="monotone" dataKey="pv" stroke="#387908" />
</LineChart>
```

---

# Documentation n8n

================
CODE SNIPPETS
================
TITLE: Create, Activate, and Trigger Webhook Workflow (API Test)
DESCRIPTION: Tests creating a workflow via API, activating it, triggering an external webhook, and verifying the execution status and output.

SOURCE: https://github.com/n8n-io/n8n/blob/master/packages/testing/playwright/CONTRIBUTING.md#_snippet_14

LANGUAGE: typescript
CODE:
```
test('should create workflow via API, activate it, trigger webhook externally @auth:owner', async ({ api }) => {
  const workflowDefinition = JSON.parse(
    readFileSync(resolveFromRoot('workflows', 'simple-webhook-test.json'), 'utf8'),
  );

  const createdWorkflow = await api.workflowApi.createWorkflow(workflowDefinition);
  await api.workflowApi.setActive(createdWorkflow.id, true);

  const testPayload = { message: 'Hello from Playwright test' };
  const webhookResponse = await api.workflowApi.triggerWebhook('test-webhook', { data: testPayload });
  expect(webhookResponse.ok()).toBe(true);

  const execution = await api.workflowApi.waitForExecution(createdWorkflow.id, 10000);
  expect(execution.status).toBe('success');

  const executionDetails = await api.workflowApi.getExecution(execution.id);
  expect(executionDetails.data).toContain('Hello from Playwright test');
});
```

---

# Documentation Prisma ORM

================
CODE SNIPPETS
================
TITLE: Define Prisma Schema for PostgreSQL with Next.js Types
DESCRIPTION: This example shows how to define a Prisma schema for a PostgreSQL database with models, relations, and type-safe field definitions. Prisma automatically generates TypeScript types that can be used throughout your Next.js application for end-to-end type safety.

SOURCE: https://www.prisma.io/docs/orm/prisma-schema/data-model/models

LANGUAGE: prisma
CODE:
```
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  orders    Order[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Order {
  id          String      @id @default(cuid())
  userId      String
  user        User        @relation(fields: [userId], references: [id])
  items       OrderItem[]
  totalPrice  Decimal     @db.Decimal(10, 2)
  status      String
  createdAt   DateTime    @default(now())
}

model OrderItem {
  id       String  @id @default(cuid())
  orderId  String
  order    Order   @relation(fields: [orderId], references: [id])
  productId String
  quantity Int
  price    Decimal @db.Decimal(10, 2)
}
```

================
CODE SNIPPETS
================
TITLE: Type-Safe Database Queries with Prisma Client in Next.js
DESCRIPTION: Demonstrates how to use the generated Prisma Client for fully type-safe database operations. The client provides autocomplete and compile-time type checking for all database queries, mutations, and relations.

SOURCE: https://www.prisma.io/docs/orm/prisma-client/queries/crud

LANGUAGE: typescript
CODE:
```
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Type-safe query with relations
async function getUserWithOrders(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      orders: {
        include: {
          items: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })
  return user
}

// Type-safe mutations
async function createOrder(userId: string, items: Array<{ productId: string; quantity: number; price: number }>)
async function createOrder(userId: string, items: Array<{ productId: string; quantity: number; price: number }>) {
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const order = await prisma.order.create({
    data: {
      userId,
      totalPrice,
      status: 'pending',
      items: {
        create: items
      }
    },
    include: {
      items: true
    }
  })

  return order
}
```

================
CODE SNIPPETS
================
TITLE: Prisma Migrations for Database Schema Evolution
DESCRIPTION: Shows how to use Prisma Migrate to evolve your database schema safely. Migrations are automatically generated from schema changes and can be applied to development and production databases with full version control.

SOURCE: https://www.prisma.io/docs/orm/prisma-migrate/workflows/development-and-production

LANGUAGE: bash
CODE:
```
# Create a new migration from schema changes
npx prisma migrate dev --name add_order_status

# Apply migrations to production
npx prisma migrate deploy

# Generate Prisma Client after schema changes
npx prisma generate

# Reset database and apply all migrations (dev only)
npx prisma migrate reset
```

================
CODE SNIPPETS
================
TITLE: TypedSQL for Raw SQL Queries with Type Safety
DESCRIPTION: Prisma's TypedSQL feature allows you to write raw SQL queries while maintaining full TypeScript type safety. Query results are automatically typed based on the SQL query structure.

SOURCE: https://www.prisma.io/docs/orm/prisma-client/using-raw-sql/typedsql

LANGUAGE: typescript
CODE:
```
-- sql/getUserOrders.sql
SELECT
  u.id as userId,
  u.name as userName,
  o.id as orderId,
  o.totalPrice,
  o.status,
  o.createdAt
FROM "User" u
JOIN "Order" o ON u.id = o.userId
WHERE u.id = $1
ORDER BY o.createdAt DESC;

// TypeScript usage with auto-generated types
import { getUserOrders } from '@prisma/client/sql'

async function getOrdersByUser(userId: string) {
  const orders = await prisma.$queryRawTyped(getUserOrders(userId))
  // orders is fully typed based on SQL query structure
  return orders
}
```

---

# Documentation Inngest

================
CODE SNIPPETS
================
TITLE: Define Durable TypeScript Workflow with Step Functions
DESCRIPTION: Shows how to create a durable workflow function with Inngest that automatically handles retries, state persistence, and error handling. Each step is executed independently with automatic retry logic.

SOURCE: https://www.inngest.com/docs/reference/functions/step-run

LANGUAGE: typescript
CODE:
```
import { inngest } from './client'

export const processOrderWorkflow = inngest.createFunction(
  { id: 'process-order', retries: 3 },
  { event: 'order/created' },
  async ({ event, step }) => {
    // Step 1: Validate payment
    const payment = await step.run('validate-payment', async () => {
      return await validatePayment(event.data.orderId)
    })

    // Step 2: Update inventory (only runs if payment succeeds)
    await step.run('update-inventory', async () => {
      return await updateInventory(event.data.items)
    })

    // Step 3: Send confirmation email with 5-minute delay
    await step.sleep('wait-before-email', '5m')

    await step.run('send-email', async () => {
      return await sendEmail({
        to: event.data.customerEmail,
        subject: 'Order Confirmation',
        orderId: event.data.orderId
      })
    })

    return { success: true, orderId: event.data.orderId }
  }
)
```

================
CODE SNIPPETS
================
TITLE: Configure Inngest Client for Next.js App Router
DESCRIPTION: Demonstrates how to set up the Inngest client and serve functions via Next.js Route Handler. The client handles event dispatching and function execution with built-in development UI.

SOURCE: https://www.inngest.com/docs/sdk/serve

LANGUAGE: typescript
CODE:
```
// lib/inngest/client.ts
import { Inngest } from 'inngest'

export const inngest = new Inngest({
  id: 'chanthana-thai-cook',
  schemas: new EventSchemas().fromRecord<{
    'order/created': {
      data: {
        orderId: string
        customerEmail: string
        items: Array<{ productId: string; quantity: number }>
        totalPrice: number
      }
    }
    'notification/send': {
      data: {
        userId: string
        message: string
        type: 'email' | 'sms' | 'push'
      }
    }
  }>()
})

// app/api/inngest/route.ts
import { serve } from 'inngest/next'
import { inngest } from '@/lib/inngest/client'
import { processOrderWorkflow } from '@/lib/inngest/functions/processOrder'

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    processOrderWorkflow,
    // Add more functions here
  ]
})
```

================
CODE SNIPPETS
================
TITLE: Trigger Events and Monitor Execution Status
DESCRIPTION: Shows how to send events to trigger Inngest workflows and monitor their execution status. Events are type-safe based on the schema definition.

SOURCE: https://www.inngest.com/docs/reference/client/send

LANGUAGE: typescript
CODE:
```
import { inngest } from '@/lib/inngest/client'

// Send event to trigger workflow
async function createOrder(orderData: OrderData) {
  // Create order in database first
  const order = await prisma.order.create({ data: orderData })

  // Trigger Inngest workflow
  await inngest.send({
    name: 'order/created',
    data: {
      orderId: order.id,
      customerEmail: order.user.email,
      items: order.items,
      totalPrice: order.totalPrice
    }
  })

  return order
}

// Send multiple events in batch
async function sendNotifications(userIds: string[], message: string) {
  await inngest.send(
    userIds.map(userId => ({
      name: 'notification/send',
      data: { userId, message, type: 'push' }
    }))
  )
}
```

================
CODE SNIPPETS
================
TITLE: AI Workflow Orchestration with Multi-Step LLM Calls
DESCRIPTION: Demonstrates how to build AI workflows with Inngest that orchestrate multiple LLM calls, handle streaming responses, and implement retry logic for AI operations.

SOURCE: https://www.inngest.com/docs/guides/ai-orchestration

LANGUAGE: typescript
CODE:
```
import { inngest } from './client'
import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'

export const generateMenuDescription = inngest.createFunction(
  { id: 'generate-menu-description', retries: 2 },
  { event: 'menu/description-request' },
  async ({ event, step }) => {
    // Step 1: Generate initial description
    const description = await step.ai.wrap('generate-description', async () => {
      const { text } = await generateText({
        model: openai('gpt-4-turbo'),
        prompt: `Generate an appetizing description for this Thai dish: ${event.data.dishName}.\n                 Ingredients: ${event.data.ingredients.join(', ')}.\n                 Make it enticing and authentic.`
      })
      return text
    })

    // Step 2: Translate to French
    const frenchDescription = await step.ai.wrap('translate-french', async () => {
      const { text } = await generateText({
        model: openai('gpt-4-turbo'),
        prompt: `Translate this Thai dish description to French, keeping the appetizing tone: ${description}`
      })
      return text
    })

    // Step 3: Update database
    await step.run('update-database', async () => {
      return await prisma.plat.update({
        where: { id: event.data.dishId },
        data: {
          description_en: description,
          description_fr: frenchDescription
        }
      })
    })

    return { description, frenchDescription }
  }
)
```

---

# Documentation React Email

================
CODE SNIPPETS
================
TITLE: Create Responsive Email Template with React Email Components
DESCRIPTION: Shows how to build a type-safe email template using React Email's component library. The template uses JSX/TSX syntax and compiles to production-ready HTML emails with inline CSS.

SOURCE: https://react.email/docs/components/html

LANGUAGE: tsx
CODE:
```
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface OrderConfirmationEmailProps {
  customerName: string
  orderId: string
  orderItems: Array<{
    name: string
    quantity: number
    price: number
  }>
  totalPrice: number
  estimatedDelivery: string
}

export function OrderConfirmationEmail({
  customerName,
  orderId,
  orderItems,
  totalPrice,
  estimatedDelivery
}: OrderConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Votre commande #{orderId} est confirmée chez Chanthana Thai Cook</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://your-domain.com/logo.png"
            width="150"
            height="50"
            alt="Chanthana Thai Cook"
            style={logo}
          />
          <Heading style={h1}>Merci pour votre commande!</Heading>
          <Text style={text}>
            Bonjour {customerName},
          </Text>
          <Text style={text}>
            Votre commande <strong>#{orderId}</strong> a été confirmée et est en préparation.
          </Text>

          <Section style={orderDetails}>
            <Heading as="h2" style={h2}>Détails de la commande</Heading>
            {orderItems.map((item, index) => (
              <div key={index} style={orderItem}>
                <Text style={itemName}>
                  {item.quantity}x {item.name}
                </Text>
                <Text style={itemPrice}>
                  {(item.price * item.quantity).toFixed(2)}€
                </Text>
              </div>
            ))}
            <div style={totalRow}>
              <Text style={totalLabel}>Total</Text>
              <Text style={totalPrice}>{totalPrice.toFixed(2)}€</Text>
            </div>
          </Section>

          <Text style={text}>
            Livraison estimée: <strong>{estimatedDelivery}</strong>
          </Text>

          <Button
            style={button}
            href={`https://your-domain.com/commandes/${orderId}`}
          >
            Suivre ma commande
          </Button>

          <Text style={footer}>
            Questions? Contactez-nous à{' '}
            <Link href="mailto:contact@chanthana.com" style={link}>
              contact@chanthana.com
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const logo = {
  margin: '0 auto',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
}

const h2 = {
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '24px 0 16px',
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
}

const orderDetails = {
  backgroundColor: '#f4f4f4',
  padding: '24px',
  borderRadius: '8px',
  margin: '24px 0',
}

const orderItem = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '12px',
}

const itemName = {
  color: '#333',
  fontSize: '14px',
  margin: '0',
}

const itemPrice = {
  color: '#666',
  fontSize: '14px',
  margin: '0',
  fontWeight: 'bold',
}

const totalRow = {
  display: 'flex',
  justifyContent: 'space-between',
  borderTop: '2px solid #ddd',
  paddingTop: '12px',
  marginTop: '12px',
}

const totalLabel = {
  color: '#333',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0',
}

const totalPrice = {
  color: '#D97706',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0',
}

const button = {
  backgroundColor: '#D97706',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  padding: '12px',
  margin: '24px 0',
}

const footer = {
  color: '#666',
  fontSize: '12px',
  lineHeight: '24px',
  textAlign: 'center' as const,
  marginTop: '48px',
}

const link = {
  color: '#D97706',
  textDecoration: 'underline',
}
```

================
CODE SNIPPETS
================
TITLE: Send Emails with React Email in Next.js using Resend
DESCRIPTION: Demonstrates how to integrate React Email with Resend API to send transactional emails from Next.js Server Actions or Route Handlers.

SOURCE: https://react.email/docs/integrations/resend

LANGUAGE: typescript
CODE:
```
import { Resend } from 'resend'
import { OrderConfirmationEmail } from '@/emails/OrderConfirmation'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOrderConfirmation(orderData: {
  customerEmail: string
  customerName: string
  orderId: string
  orderItems: any[]
  totalPrice: number
  estimatedDelivery: string
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Chanthana Thai Cook <orders@chanthana.com>',
      to: [orderData.customerEmail],
      subject: `Confirmation de commande #${orderData.orderId}`,
      react: OrderConfirmationEmail({
        customerName: orderData.customerName,
        orderId: orderData.orderId,
        orderItems: orderData.orderItems,
        totalPrice: orderData.totalPrice,
        estimatedDelivery: orderData.estimatedDelivery
      }),
    })

    if (error) {
      console.error('Email sending error:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Email sending exception:', error)
    return { success: false, error }
  }
}
```

================
CODE SNIPPETS
================
TITLE: Preview and Test Emails with React Email Dev Server
DESCRIPTION: Shows how to use React Email's built-in development server to preview and test email templates in the browser before sending them.

SOURCE: https://react.email/docs/introduction

LANGUAGE: bash
CODE:
```
# Install React Email
npm install react-email @react-email/components

# Add to package.json scripts
{
  "scripts": {
    "email:dev": "email dev",
    "email:export": "email export"
  }
}

# Start development server (http://localhost:3000)
npm run email:dev

# Export emails to static HTML
npm run email:export
```

================
CODE SNIPPETS
================
TITLE: Email Template with Tailwind CSS Support
DESCRIPTION: React Email supports Tailwind CSS classes that are automatically compiled to inline styles for maximum email client compatibility.

SOURCE: https://react.email/docs/components/tailwind

LANGUAGE: tsx
CODE:
```
import { Button, Html, Tailwind } from '@react-email/components'

export function WelcomeEmail({ userName }: { userName: string }) {
  return (
    <Html>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                'thai-orange': '#D97706',
                'thai-green': '#059669',
              },
            },
          },
        }}
      >
        <div className="bg-gray-100 py-12">
          <div className="mx-auto max-w-2xl bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Bienvenue {userName}!
            </h1>
            <p className="text-gray-700 mb-6">
              Merci de rejoindre Chanthana Thai Cook. Découvrez notre menu authentique de plats thaïlandais.
            </p>
            <Button
              className="bg-thai-orange text-white font-bold py-3 px-6 rounded-lg"
              href="https://chanthana.com/menu"
            >
              Voir le menu
            </Button>
          </div>
        </div>
      </Tailwind>
    </Html>
  )
}
```

---

# Documentation Next Safe Action

================
CODE SNIPPETS
================
TITLE: Create Type-Safe Server Action with Zod Validation
DESCRIPTION: Shows how to define a Server Action with automatic input validation using Zod schema. The action is fully type-safe from client to server with built-in error handling.

SOURCE: https://next-safe-action.dev/docs/getting-started

LANGUAGE: typescript
CODE:
```
'use server'

import { createSafeActionClient } from 'next-safe-action'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// Initialize safe action client
const action = createSafeActionClient()

// Define validation schema
const createOrderSchema = z.object({
  userId: z.string().cuid(),
  items: z.array(z.object({
    productId: z.string().cuid(),
    quantity: z.number().int().positive(),
    price: z.number().positive()
  })).min(1),
  deliveryAddress: z.string().min(10),
  deliveryDate: z.string().datetime(),
  notes: z.string().optional()
})

// Create type-safe server action
export const createOrderAction = action
  .schema(createOrderSchema)
  .action(async ({ parsedInput }) => {
    // Input is automatically validated and typed
    const { userId, items, deliveryAddress, deliveryDate, notes } = parsedInput

    // Calculate total price
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    // Create order in database
    const order = await prisma.order.create({
      data: {
        userId,
        totalPrice,
        deliveryAddress,
        deliveryDate: new Date(deliveryDate),
        notes,
        status: 'pending',
        items: {
          create: items
        }
      },
      include: {
        items: true
      }
    })

    // Return success result
    return {
      success: true,
      orderId: order.id,
      totalPrice: order.totalPrice
    }
  })
```

================
CODE SNIPPETS
================
TITLE: Use Server Action in Client Component with useAction Hook
DESCRIPTION: Demonstrates how to call a Server Action from a Client Component using the type-safe useAction hook. The hook provides loading states, error handling, and automatic type inference.

SOURCE: https://next-safe-action.dev/docs/usage-from-client/hooks/useaction

LANGUAGE: tsx
CODE:
```
'use client'

import { useAction } from 'next-safe-action/hooks'
import { createOrderAction } from '@/actions/orderActions'
import { useState } from 'react'
import { toast } from 'sonner'

export function OrderForm() {
  const [items, setItems] = useState([
    { productId: 'dish-1', quantity: 2, price: 12.99 }
  ])

  const { execute, status, result } = useAction(createOrderAction, {
    onSuccess: ({ data }) => {
      toast.success(`Commande #${data?.orderId} créée avec succès!`)
    },
    onError: ({ error }) => {
      toast.error(error.serverError || 'Une erreur est survenue')
    }
  })

  async function handleSubmit(formData: FormData) {
    const orderData = {
      userId: formData.get('userId') as string,
      items,
      deliveryAddress: formData.get('address') as string,
      deliveryDate: formData.get('date') as string,
      notes: formData.get('notes') as string | undefined
    }

    execute(orderData)
  }

  return (
    <form action={handleSubmit}>
      {/* Form fields */}
      <input type="text" name="address" required />
      <input type="datetime-local" name="date" required />
      <textarea name="notes" />

      <button
        type="submit"
        disabled={status === 'executing'}
      >
        {status === 'executing' ? 'Traitement...' : 'Commander'}
      </button>

      {result?.validationErrors && (
        <div className="text-red-500">
          {JSON.stringify(result.validationErrors)}
        </div>
      )}
    </form>
  )
}
```

================
CODE SNIPPETS
================
TITLE: Add Middleware for Authentication and Authorization
DESCRIPTION: Shows how to create a safe action client with middleware to handle cross-cutting concerns like authentication, logging, and authorization before action execution.

SOURCE: https://next-safe-action.dev/docs/middleware

LANGUAGE: typescript
CODE:
```
import { createSafeActionClient } from 'next-safe-action'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Create base action client with authentication middleware
export const authenticatedAction = createSafeActionClient({
  middleware: async () => {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      throw new Error('Vous devez être connecté pour effectuer cette action')
    }

    return {
      userId: session.user.id,
      userRole: session.user.role
    }
  }
})

// Create admin-only action client
export const adminAction = authenticatedAction.use(async ({ next, ctx }) => {
  if (ctx.userRole !== 'admin') {
    throw new Error('Action réservée aux administrateurs')
  }

  return next({ ctx })
})

// Usage: Create action with automatic auth check
import { z } from 'zod'

export const deleteOrderAction = adminAction
  .schema(z.object({
    orderId: z.string().cuid()
  }))
  .action(async ({ parsedInput, ctx }) => {
    // ctx.userId and ctx.userRole are available from middleware
    console.log(`Admin ${ctx.userId} deleting order ${parsedInput.orderId}`)

    await prisma.order.delete({
      where: { id: parsedInput.orderId }
    })

    return { success: true }
  })
```

================
CODE SNIPPETS
================
TITLE: Handle Form Actions with useStateAction for Optimistic Updates
DESCRIPTION: Demonstrates how to use useStateAction hook for form handling with optimistic UI updates and automatic error recovery.

SOURCE: https://next-safe-action.dev/docs/usage-from-client/hooks/usestateaction

LANGUAGE: tsx
CODE:
```
'use client'

import { useStateAction } from 'next-safe-action/hooks'
import { updateProfileAction } from '@/actions/profileActions'
import { useState } from 'react'

export function ProfileForm({ initialData }: { initialData: UserProfile }) {
  const { execute, status, result, optimisticState } = useStateAction(
    updateProfileAction,
    {
      initResult: { data: initialData },
      onSuccess: () => {
        toast.success('Profil mis à jour avec succès!')
      }
    }
  )

  // Use optimistic state for instant UI updates
  const profile = optimisticState ?? initialData

  async function handleSubmit(formData: FormData) {
    const updates = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string
    }

    // Optimistically update UI before server response
    execute(updates, {
      optimisticState: {
        ...profile,
        ...updates
      }
    })
  }

  return (
    <form action={handleSubmit}>
      <input
        name="name"
        defaultValue={profile.name}
        placeholder="Nom complet"
      />
      <input
        name="phone"
        defaultValue={profile.phone}
        placeholder="Téléphone"
      />
      <textarea
        name="address"
        defaultValue={profile.address}
        placeholder="Adresse"
      />

      <button
        type="submit"
        disabled={status === 'executing'}
      >
        {status === 'executing' ? 'Enregistrement...' : 'Sauvegarder'}
      </button>

      {result?.validationErrors && (
        <ErrorDisplay errors={result.validationErrors} />
      )}
    </form>
  )
}
```

---

# Documentation Better Auth

"Better Auth" appears to be a highly suitable option for a modern, free, MIT-licensed, and GitHub-hosted TypeScript authentication solution.

Key features and details of "Better Auth" include:
*   **Comprehensive Framework**: It's described as the "most comprehensive authentication framework for TypeScript," offering a wide range of features out-of-the-box.
*   **Framework-Agnostic**: It can be used with various frameworks, including Next.js, Astro, Remix, and even for mobile with Expo.
*   **Extensive Features**: It supports email and password authentication, multiple OAuth providers (like GitHub, Google, Discord), two-factor authentication (2FA), multi-tenant support, magic links, one-time codes, trusted devices, and session cookies.
*   **Plugin Ecosystem**: It has a plugin ecosystem that simplifies adding advanced functionalities.
*   **MIT License**: "Better Auth" is an open-source project released under the MIT License, allowing free use, modification, and distribution.
*   **TypeScript-first**: It is built with TypeScript, ensuring type safety and better tooling.
*   **GitHub Presence**: The project is actively maintained on GitHub.

--- 

# Documentation nuqs

`nuqs` is a powerful, type-safe JavaScript library designed to manage application state by synchronizing it with URL query strings, primarily within React applications. It offers a `useState`-like API to store and retrieve state directly from the browser's address bar, making application states shareable, bookmarkable, and SEO-friendly.

Key features and benefits of `nuqs` include:
*   **Type Safety**: `nuqs` provides end-to-end type safety, leveraging TypeScript to ensure consistency between server and client components.
*   **URL as Source of Truth**: It ensures that the URL accurately reflects the current application state, which is crucial for shareability and bookmarking.
*   **Framework Compatibility**: `nuqs` supports a wide range of React frameworks, including Next.js (both app and pages routers), plain React (SPA), Remix, React Router, and TanStack Router.
*   **Simplified State Management**: The library reduces boilerplate code associated with handling URL parameters, offering a declarative API that is intuitive and easy to maintain.
*   **History Management**: Developers can control browser history by replacing or appending entries, allowing for seamless back navigation through state changes.
*   **Built-in Parsers and Customization**: `nuqs` includes built-in parsers for common data types like integers, floats, booleans, and dates, and also allows for the creation of custom parsers and serializers.
*   **Server-Side Support**: It provides type-safe access to search parameters in server components, which is particularly useful for frameworks like Next.js.
*   **Performance Optimization**: `nuqs` performs efficient parameter updates without triggering full page reloads (shallow routing by default) and supports features like key isolation, where components only re-render when their specific search parameter changes.

The core hooks provided by `nuqs` are `useQueryState` for managing individual query parameters and `useQueryStates` for handling multiple related query keys simultaneously, which is beneficial for features like filtering, sorting, and pagination.

To use `nuqs`, you typically install it via a package manager (e.g., `npm install nuqs`), wrap your component tree with an appropriate adapter for your chosen framework, and then utilize the `useQueryState` or `useQueryStates` hooks to manage your URL-based state.

--- 

# Documentation GlitchTip

GlitchTip is an open-source error monitoring tool that helps developers track errors, monitor application performance, and check website uptime. It serves as an alternative to Sentry, offering compatibility with Sentry client SDKs while aiming for a simpler and easier-to-run experience.

Key features of GlitchTip include:
*   **Error Tracking**: Automatically captures and organizes errors from applications in real-time.
*   **Application Performance Monitoring (APM)**: Helps identify slowdowns and optimize response times.
*   **Uptime Monitoring**: Continuously monitors website or application availability.
*   **Alert Notifications**: Provides instant notifications for identified issues.

GlitchTip can be self-hosted on your own server, offering control over your data and setup, or you can opt for a hosted service. Its backend is built using Python 3 and Django, and it uses PostgreSQL for data storage.
