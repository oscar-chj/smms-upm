import { auth } from "@/auth";
import { prisma } from "../../../../prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Event, EventCategory, EventStatus } from "@/types/api.types";

const mapPrismaCategoryToFrontend = (category: string): EventCategory => {
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

const mapPrismaStatusToFrontend = (status: string): EventStatus => {
  switch (status) {
    case "UPCOMING":
      return "Upcoming";
    case "ONGOING":
      return "Ongoing";
    case "COMPLETED":
      return "Completed";
    case "CANCELLED":
      return "Cancelled";
    default:
      return "Upcoming";
  }
};

/**
 * GET /api/events
 * Get list of events with pagination and optional filtering
 * Query params:
 *   - page (optional, default: 1)
 *   - limit (optional, default: 10)
 *   - category (optional)
 *   - status (optional)
 *   - search (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {};
    if (category) {
      const prismaCategory = category.toUpperCase();
      where.category = prismaCategory;
    }
    if (status) {
      const prismaStatus = status.toUpperCase();
      where.status = prismaStatus;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get total count
    const total = await prisma.event.count({ where });

    // Get paginated events
    const events = await prisma.event.findMany({
      where,
      orderBy: { date: "asc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        _count: {
          select: {
            registrations: {
              where: {
                status: "REGISTERED",
              },
            },
          },
        },
      },
    });

    const transformedEvents: Event[] = events.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date.toISOString().split("T")[0], // Convert to YYYY-MM-DD
      time: event.time,
      location: event.location,
      organizer: event.organizer,
      category: mapPrismaCategoryToFrontend(event.category),
      points: event.points,
      capacity: event.capacity,
      registeredCount: event._count.registrations,
      status: mapPrismaStatusToFrontend(event.status),
      imageUrl: event.imageUrl || undefined,
    }));

    return NextResponse.json({
      success: true,
      data: transformedEvents,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

