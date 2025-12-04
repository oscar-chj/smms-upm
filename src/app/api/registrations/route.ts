import { auth } from "@/auth";
import { prisma } from "../../../../prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

const mapPrismaStatusToFrontend = (status: string): string => {
  switch (status) {
    case "REGISTERED":
      return "Registered";
    case "WAITLISTED":
      return "Waitlisted";
    case "CANCELLED":
      return "Cancelled";
    case "ATTENDED":
      return "Attended";
    default:
      return "Registered";
  }
};

/**
 * GET /api/registrations
 * Get registrations
 * Query params:
 *   - studentId (optional, defaults to current user)
 *   - eventId (optional)
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

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const studentIdParam = searchParams.get("studentId");
    const eventIdParam = searchParams.get("eventId");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    // Use provided studentId or current user's id
    const studentId = studentIdParam || user.id;

    // Build where clause
    const where: { studentId: string; eventId?: string } = { studentId };
    if (eventIdParam) {
      where.eventId = eventIdParam;
    }

    // Get total count
    const total = await prisma.eventRegistration.count({ where });

    // Get paginated registrations
    const registrations = await prisma.eventRegistration.findMany({
      where,
      include: {
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            category: true,
            points: true,
          },
        },
      },
      orderBy: { registrationDate: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const transformedRegistrations = registrations.map((reg) => ({
      id: reg.id,
      eventId: reg.eventId,
      studentId: reg.studentId,
      registrationDate: reg.registrationDate.toISOString().split("T")[0],
      status: mapPrismaStatusToFrontend(reg.status),
      attendanceMarked: reg.attendanceMarked,
      pointsAwarded: reg.pointsAwarded,
    }));

    return NextResponse.json({
      success: true,
      data: transformedRegistrations,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    // TODO: Implement proper error handling/display
    // eslint-disable-next-line no-console
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch registrations" },
      { status: 500 }
    );
  }
}
