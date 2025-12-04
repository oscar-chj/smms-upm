import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { Student } from "@/types/api.types";
import { UserRole } from "@/types/auth.types";
import { prisma } from "../../../../../../prisma/prisma";

/**
 * GET /api/students/by-id/[id]
 * Get student by internal user ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get current authenticated user (for authorization check)
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find user by internal ID
    const user = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Student not found" },
        { status: 404 }
      );
    }

    // Ensure user is a student with required fields
    if (
      !user.studentId ||
      !user.faculty ||
      !user.year ||
      !user.program ||
      !user.enrollmentDate
    ) {
      return NextResponse.json(
        { success: false, error: "User is not a student" },
        { status: 400 }
      );
    }

    const student: Student = {
      id: user.id,
      name: user.name ?? "",
      email: user.email,
      emailVerified: user.emailVerified ?? false,
      image: user.image,
      role: UserRole.STUDENT,
      studentId: user.studentId,
      faculty: user.faculty,
      year: user.year,
      program: user.program,
      totalMeritPoints: user.totalMeritPoints,
      enrollmentDate: user.enrollmentDate,
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
