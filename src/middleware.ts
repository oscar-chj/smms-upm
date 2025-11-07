import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

/**
 * Route configuration for the application
 */
const ROUTES = {
  // Public routes that don't require authentication
  public: ["/auth/login", "/auth/error"],

  // Routes that should bypass middleware entirely
  bypass: ["/_next", "/api", "/favicon.ico", "/public", "/assets", "/images"],

  // Default routes for redirection
  default: {
    authenticated: "/dashboard",
    unauthenticated: "/auth/login",
  },
};

/**
 * Check if the requested path is included in a list of route patterns
 * @param path - The path to check
 * @param routes - Array of route patterns
 * @returns True if the path matches any pattern
 */
const matchesRoutePattern = (path: string, routes: string[]): boolean => {
  return routes.some((route) => path === route || path.startsWith(`${route}/`));
};

/**
 * Check if the requested route is a public route
 * @param path - The path to check
 * @returns True if the path is public
 */
const isPublicRoute = (path: string): boolean => {
  return matchesRoutePattern(path, ROUTES.public);
};

/**
 * Check if the route should bypass the middleware
 * @param path - The path to check
 * @returns True if the path should bypass middleware
 */
const shouldBypass = (path: string): boolean => {
  return matchesRoutePattern(path, ROUTES.bypass);
};

/**
 * Handle root path navigation based on authentication status
 * @param request - The Next.js request object
 * @param isUserAuthenticated - Whether the user is authenticated
 * @returns The appropriate redirect response
 */
const handleRootPath = (
  request: NextRequest,
  isUserAuthenticated: boolean
): NextResponse => {
  const redirectUrl = isUserAuthenticated
    ? ROUTES.default.authenticated
    : ROUTES.default.unauthenticated;

  return NextResponse.redirect(new URL(redirectUrl, request.url));
};

/**
 * Handle protected route access for unauthenticated users
 * @param request - The Next.js request object
 * @param pathname - The current path
 * @returns Redirect to login with return URL
 */
const handleUnauthenticatedAccess = (
  request: NextRequest,
  pathname: string
): NextResponse => {
  const loginUrl = new URL(ROUTES.default.unauthenticated, request.url);
  // Add a ?from= parameter to redirect back after login
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
};

/**
 * Handle public route access for already authenticated users
 * @param request - The Next.js request object
 * @param pathname - The current path
 * @returns Appropriate redirect or next response
 */
const handleAuthenticatedOnPublicRoute = (
  request: NextRequest,
  pathname: string
): NextResponse => {
  // Allow the /auth/logout path even when authenticated
  if (pathname === "/auth/logout") {
    return NextResponse.next();
  }

  // If user is already logged in, redirect them to the dashboard
  return NextResponse.redirect(
    new URL(ROUTES.default.authenticated, request.url)
  );
};

/**
 * Middleware function that executes on every request
 * Handles authentication, redirects, and route protection
 */
export default auth((request) => {
  const { pathname } = request.nextUrl;

  // Skip middleware for static assets and bypass routes
  if (shouldBypass(pathname)) {
    return NextResponse.next();
  }

  // Check authentication status from NextAuth
  const isUserAuthenticated = !!request.auth;

  // Handle root path special case
  if (pathname === "/") {
    return handleRootPath(request, isUserAuthenticated);
  }

  // Handle protected routes - redirect to login if not authenticated
  if (!isPublicRoute(pathname) && !isUserAuthenticated) {
    return handleUnauthenticatedAccess(request, pathname);
  }

  // Handle public routes when user is already authenticated (like login page)
  if (isPublicRoute(pathname) && isUserAuthenticated) {
    return handleAuthenticatedOnPublicRoute(request, pathname);
  }

  // Otherwise, continue to the requested page
  return NextResponse.next();
});

/**
 * Configure which paths this middleware will run on
 */
export const config = {
  // Apply middleware to all routes in the app except static assets
  matcher: [
    "/((?!_next/static|_next/image|images|public|favicon.ico|assets|api/auth).*)",
  ],
};
