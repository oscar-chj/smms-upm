"use client";

import type { NextRequest } from "next/server";

// Public routes that don't require authentication
const publicRoutes = ["/auth/login"];

/**
 * Check if the requested route is a public route
 */
const isPublicRoute = (path: string): boolean => {
  return publicRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );
};

/**
 * Check if the user is authenticated
 * This is a simplified version - in a real app, you would check an auth token or cookie
 */
const isAuthenticated = (request: NextRequest): boolean => {
  // For development purposes, we'll check for an auth cookie
  // In a real app, you would verify the session token with your auth provider
  const authCookie = request.cookies.get("auth_token")?.value;
  return !!authCookie;
};

export { isAuthenticated, isPublicRoute };
