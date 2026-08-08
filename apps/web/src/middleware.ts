import { clerkMiddleware } from "@clerk/nextjs/server";

export default process.env.CLERK_SECRET_KEY
  ? clerkMiddleware()
  : () => undefined;

export const config = {
  // Cover API routes (no dot segments) and page routes; skip _next and static files.
  matcher: ["/((?!_next|.*\\..*).*)"],
};
