import { auth } from "@/auth";
import { prisma } from "../../../../../prisma/prisma";
import { NextResponse } from "next/server";
import { Student, UserRole } from "@/types/api.types";

/**
 * GET /api/students/me
 * Get current authenticated user's student data
 */
export async function GET() {
  try {
    // Get current authenticated user
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Anyone with @student.upm.edu.my email is a student
    // Other fields can be filled during onboarding
    const student: Student = {
      id: user.id,
      name: user.name ?? "",
      email: user.email,
      emailVerified: user.emailVerified ?? false,
      image: user.image,
      role: UserRole.STUDENT,
      studentId: user.studentId ?? user.email.split("@")[0],
      faculty: user.faculty ?? "",
      year: user.year ?? 1,
      program: user.program ?? "",
      totalMeritPoints: user.totalMeritPoints,
      enrollmentDate: user.enrollmentDate ?? user.createdAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json({
      success: true,
      data: student,
    });
  } catch (error) {
    // TODO: Implement proper error handling/display
    // eslint-disable-next-line no-console
    console.error("Error fetching student data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch student data" },
      { status: 500 }
    );
  }
}
