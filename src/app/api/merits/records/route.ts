import { auth } from "@/auth";
import { prisma } from "../../../../../prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
import { EventCategory } from "@/types/api.types";

const mapPrismaCategoryToFrontend = (
  category: string
): EventCategory => {
  switch (category) {
    case "UNIVERSITY":
      return EventCategory.UNIVERSITY;
    case "FACULTY":
      return EventCategory.FACULTY;
    case "COLLEGE":
      return EventCategory.COLLEGE;
    case "CLUB":
      return EventCategory.CLUB;
    default:
      return EventCategory.UNIVERSITY;
  }
};

/**
 * GET /api/merits/records
 * Get merit records for a student
 * Query params:
 *   - studentId (optional, defaults to current user)
 *   - page (optional, default: 1)
 *   - limit (optional, default: 50)
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

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const studentIdParam = searchParams.get("studentId");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

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

    // Get total count for pagination
    const total = await prisma.meritRecord.count({
      where: { studentId },
    });

    // Get paginated merit records
    const records = await prisma.meritRecord.findMany({
      where: { studentId },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            category: true,
          },
        },
      },
      orderBy: { date: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Transform to match frontend MeritRecord type
    const transformedRecords = records.map((record) => ({
      id: record.id,
      studentId: record.studentId,
      eventId: record.eventId || undefined,
      category: mapPrismaCategoryToFrontend(record.category as string),
      points: record.points,
      description: record.description,
      date: record.date.toISOString().split("T")[0], // Convert to YYYY-MM-DD format
      isVerified: record.isVerified,
      meritType: record.meritType || undefined,
    }));

    return NextResponse.json({
      success: true,
      data: {
        records: transformedRecords,
        total,
        pagination: {
          totalItems: total,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
          itemsPerPage: limit,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching merit records:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch merit records" },
      { status: 500 }
    );
  }
}

