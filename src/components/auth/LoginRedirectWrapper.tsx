"use client";

import { useSearchParams } from "next/navigation";
import LoginForm from "./LoginForm";

/**
 * Client component that safely handles search params and passes them to GoogleLoginForm
 */
export default function LoginRedirectWrapper() {
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("from") || "/dashboard";

  return <LoginForm redirectPath={redirectPath} />;
}
