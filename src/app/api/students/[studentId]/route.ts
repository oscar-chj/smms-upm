import { auth } from "@/auth";
import { prisma } from "../../../../../../prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Student } from "@/types/api.types";
import { UserRole } from "@/types/auth.types";

/**
 * GET /api/students/[studentId]
 * Get student by studentId (university student ID, not internal ID)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { studentId: string } }
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

    // Find user by studentId
    const user = await prisma.user.findUnique({
      where: { studentId: params.studentId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Student not found" },
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

