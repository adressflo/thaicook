
import { createSafeActionClient } from "next-safe-action";

/**
 * This is our public action client.
 * It can be used to create actions that don't require authentication.
 */
export const action = createSafeActionClient();
