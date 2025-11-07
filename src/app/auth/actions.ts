"use server";

import { signIn } from "@/auth";

export async function handleGoogleSignIn(redirectPath: string = "/dashboard") {
  await signIn("google", { redirectTo: redirectPath });
}
