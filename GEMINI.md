## Project Overview

This is a Next.js 15 application for a Thai restaurant named "APPCHANTHANA". It's a comprehensive solution for managing the restaurant, including customer orders and administrative tasks.

**Key Technologies:**

*   **Framework:** Next.js 15 (with App Router)
*   **Language:** TypeScript
*   **UI:**
    *   **Components:** shadcn/ui, Radix UI
    *   **Styling:** Tailwind CSS v4
*   **Backend:**
    *   **Database & Storage:** Supabase
    *   **Authentication:** Firebase Authentication
*   **State Management:**
    *   **Server State:** TanStack Query (React Query)
    *   **Client State:** React Context API
*   **Forms:** React Hook Form with Zod for validation
*   **E2E Testing:** Playwright

## Building and Running

*   **Development:**
    ```bash
    npm run dev
    ```
    This will start the development server with Turbopack and debugging enabled.

*   **Production Build:**
    ```bash
    npm run build
    ```

*   **Start Production Server:**
    ```bash
    npm start
    ```

*   **Linting:**
    ```bash
    npm run lint
    ```

*   **End-to-End Tests:**
    ```bash
    npm run test:e2e
    ```

## Development Conventions

*   **Path Aliases:** The project uses path aliases for easier imports (e.g., `@/components/*`, `@/lib/*`). These are configured in `tsconfig.json`.
*   **Styling:** The project uses Tailwind CSS for styling, with `tailwind-merge` and `clsx` for utility class composition.
*   **Components:** Components are built using `shadcn/ui` which is based on Radix UI.
*   **State Management:** Server-side state is managed with TanStack Query, while client-side state is handled by the React Context API.
*   **Forms:** Forms are built with React Hook Form and validated with Zod.
*   **Authentication:** Authentication is handled by Firebase, with user data stored in Supabase.
*   **Database:** The project uses Supabase for its database and storage needs.
