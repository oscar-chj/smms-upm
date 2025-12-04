"use client";

import React, { Suspense } from "react";
import LoginRedirectWrapper from "@/components/auth/LoginRedirectWrapper";
import AuthSkeleton from "@/components/ui/skeletons/AuthSkeleton";

/**
 * Login page with proper Suspense boundary for useSearchParams
 */
export default function LoginPage() {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <LoginRedirectWrapper />
    </Suspense>
  );
}
