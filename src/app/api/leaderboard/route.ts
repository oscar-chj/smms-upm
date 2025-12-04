import { auth } from "@/auth";
import { prisma } from "../../../../prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
import { EventCategory } from "@/types/api.types";

/**
 * GET /api/leaderboard
 * Get leaderboard data
 * Query params:
 *   - sortBy (optional, default: "total") - "total" | "university" | "faculty" | "college" | "club"
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sortBy = searchParams.get("sortBy") || "total";

    // Get all students
    const students = await prisma.user.findMany({
      where: { role: "STUDENT" },
      include: {
        meritRecords: {
          select: {
            category: true,
            points: true,
          },
        },
      },
    });

    // Calculate points for each student
    const leaderboardData = students.map((student) => {
      const data = {
        id: student.id,
        studentId: student.studentId || "",
        name: student.name,
        faculty: student.faculty || "",
        year: student.year || 0,
        totalPoints: 0,
        universityMerit: 0,
        facultyMerit: 0,
        collegeMerit: 0,
        clubMerit: 0,
      };

      student.meritRecords.forEach((record) => {
        const category = record.category as string;
        data.totalPoints += record.points;

        switch (category) {
          case "UNIVERSITY":
            data.universityMerit += record.points;
            break;
          case "FACULTY":
            data.facultyMerit += record.points;
            break;
          case "COLLEGE":
            data.collegeMerit += record.points;
            break;
          case "CLUB":
            data.clubMerit += record.points;
            break;
        }
      });

      return data;
    });

    // Sort based on the requested criteria
    let sortedData = [...leaderboardData];
    switch (sortBy) {
      case "university":
        sortedData.sort((a, b) => b.universityMerit - a.universityMerit);
        break;
      case "faculty":
        sortedData.sort((a, b) => b.facultyMerit - a.facultyMerit);
        break;
      case "college":
        sortedData.sort((a, b) => b.collegeMerit - a.collegeMerit);
        break;
      case "club":
        sortedData.sort((a, b) => b.clubMerit - a.clubMerit);
        break;
      default:
        sortedData.sort((a, b) => b.totalPoints - a.totalPoints);
    }

    return NextResponse.json({
      success: true,
      data: sortedData,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}

