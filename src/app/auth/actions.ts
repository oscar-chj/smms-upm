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
  // Extract student ID from email if it's a student email
  const emailLower = data.email.toLowerCase();
  let studentData: {
    studentId?: string;
    enrollmentDate?: Date;
  } = {};

  // Check if email is from student domain and extract student ID
  if (emailLower.endsWith("@student.upm.edu.my")) {
    const studentId = emailLower.split("@")[0];
    studentData = {
      studentId: studentId,
      enrollmentDate: new Date(), // Set enrollment date to current date for new students
    };
  }

  return await prisma.user.upsert({
    where: { email: data.email },
    update: {
      name: data.name ?? "Google User",
      image: data.image,
      emailVerified: true,
      // Update student ID and enrollment date only if not already set
      ...(studentData.studentId && {
        studentId: studentData.studentId,
        enrollmentDate: studentData.enrollmentDate,
      }),
    },
    create: {
      email: data.email,
      name: data.name ?? "Google User",
      image: data.image,
      emailVerified: true,
      ...studentData,
    },
  });
}

/**
 * Save or update a dev backdoor user in the database
 * All dev users are created as ADMIN
 */
export async function saveDevUser(email: string) {
  return await prisma.user.upsert({
    where: { email },
    update: {
      role: "ADMIN",
    },
    create: {
      email,
      name: "Dev User",
      image: null,
      role: "ADMIN",
    },
  });
}
