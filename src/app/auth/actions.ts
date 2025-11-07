"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { prisma } from "../../../prisma/prisma";

export async function handleGoogleSignIn(redirectPath: string = "/dashboard") {
  try {
    await signIn("google", { redirectTo: redirectPath });
  } catch (error) {
    if (error instanceof AuthError) {
      // Redirect to error page with error type
      return { error: error.type };
    }
    throw error;
  }
}

/**
 * Save or update a Google OAuth user in the database
 */
export async function saveGoogleUser(data: {
  email: string;
  name?: string;
  image?: string;
}) {
  return await prisma.user.upsert({
    where: { email: data.email },
    update: {
      name: data.name,
      image: data.image,
      emailVerified: true,
    },
    create: {
      email: data.email,
      name: data.name,
      image: data.image,
      emailVerified: true,
    },
  });
}

/**
 * Save or update a dev backdoor user in the database
 */
export async function saveDevUser(email: string) {
  return await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Dev User",
      image: null,
    },
  });
}
