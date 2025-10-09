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