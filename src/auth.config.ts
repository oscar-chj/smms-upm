import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAuthPage = nextUrl.pathname.startsWith("/auth/");
      const isOnApiAuth = nextUrl.pathname.startsWith("/api/auth");

      // Always allow access to auth pages and API routes
      if (isOnAuthPage || isOnApiAuth) {
        return true;
      }

      // Require authentication for dashboard and protected routes
      if (nextUrl.pathname.startsWith("/dashboard")) {
        return isLoggedIn;
      }

      // Allow root path (will be handled by middleware redirect)
      if (nextUrl.pathname === "/") {
        return true;
      }

      // Default: require authentication for all other pages
      return isLoggedIn;
    },
  },
  providers: [], // Providers will be added in auth.ts
} satisfies NextAuthConfig;
