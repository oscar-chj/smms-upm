"use client";

import { useSearchParams } from "next/navigation";
import LoginForm from "./LoginForm";

/**
 * Client component that safely handles search params and passes them to GoogleLoginForm
 */
export default function LoginRedirectWrapper() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  // Determine redirect path
  // Don't redirect back to login or auth pages
  const isAuthPage = from?.startsWith("/auth/");
  const redirectPath = from && !isAuthPage ? from : "/dashboard";

  console.warn("Redirect path:", redirectPath);

  return <LoginForm redirectPath={redirectPath} />;
}
