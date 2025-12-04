import { auth } from "@/auth";
import { prisma } from "../../../../../prisma/prisma";
import { NextResponse } from "next/server";
import { Student } from "@/types/api.types";
import { UserRole } from "@/types/auth.types";

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

    const student: Student = {
      id: user.id,
      name: user.name,
      email: user.email,
      studentId: user.studentId || "",
      faculty: user.faculty || "",
      year: user.year || 0,
      program: user.program || "",
      totalMeritPoints: user.totalMeritPoints,
      enrollmentDate: user.enrollmentDate
        ? user.enrollmentDate.toISOString().split("T")[0]
        : "",
      profileImage: user.image || undefined,
      role: (user.role as UserRole) || UserRole.STUDENT,
    };

    return NextResponse.json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error("Error fetching student data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch student data" },
      { status: 500 }
    );
  }
}

