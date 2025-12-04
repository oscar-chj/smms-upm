import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma";

/**
 * GET /api/merits/summary
 * Get merit summary for a student
 * Query params: studentId (optional, defaults to current user)
 */
export async function GET(request: NextRequest) {
  try {
    // Get current authenticated user
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get studentId from query params or use current user
    const searchParams = request.nextUrl.searchParams;
    const studentIdParam = searchParams.get("studentId");

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Use provided studentId or current user's id
    const studentId = studentIdParam || user.id;

    // Get all merit records for this student
    const meritRecords = await prisma.meritRecord.findMany({
      where: { studentId },
      include: { event: true },
      orderBy: { date: "desc" },
    });

    // Calculate summary
    const summary = {
      totalPoints: 0,
      universityMerit: 0,
      facultyMerit: 0,
      collegeMerit: 0,
      clubMerit: 0,
      recentActivities: 0,
      rank: 1,
      totalStudents: 0,
      targetPoints: 50,
      progressPercentage: 0,
      targetAchieved: false,
      remainingPoints: 0,
      exceededPoints: 0,
    };

    // Calculate points by category
    meritRecords.forEach((record) => {
      summary.totalPoints += record.points;
      const category = record.category as string;
      switch (category) {
        case "UNIVERSITY":
          summary.universityMerit += record.points;
          break;
        case "FACULTY":
          summary.facultyMerit += record.points;
          break;
        case "COLLEGE":
          summary.collegeMerit += record.points;
          break;
        case "CLUB":
          summary.clubMerit += record.points;
          break;
      }
    });

    // Count recent activities (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    summary.recentActivities = meritRecords.filter(
      (record) => new Date(record.date) > thirtyDaysAgo
    ).length;

    // Calculate progress percentage and status
    summary.progressPercentage = Math.min(
      Math.round((summary.totalPoints / summary.targetPoints) * 100),
      100
    );

    summary.targetAchieved = summary.totalPoints >= summary.targetPoints;
    summary.remainingPoints = summary.targetAchieved
      ? 0
      : summary.targetPoints - summary.totalPoints;
    summary.exceededPoints = summary.targetAchieved
      ? summary.totalPoints - summary.targetPoints
      : 0;

    // Calculate rank - get all students with their total points
    const allStudents = await prisma.user.findMany({
      where: { role: "STUDENT" },
      include: {
        meritRecords: {
          select: { points: true },
        },
      },
    });

    const studentTotals = allStudents.map((s) => ({
      studentId: s.id,
      total: s.meritRecords.reduce((sum, r) => sum + r.points, 0),
    }));

    studentTotals.sort((a, b) => b.total - a.total);
    summary.totalStudents = studentTotals.length;
    summary.rank =
      studentTotals.findIndex((s) => s.studentId === studentId) + 1 || 1;

    return NextResponse.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    // TODO: Implement proper error handling/display
    // eslint-disable-next-line no-console
    console.error("Error fetching merit summary:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch merit summary" },
      { status: 500 }
    );
  }
}
