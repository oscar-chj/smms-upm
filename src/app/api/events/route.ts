import { prisma } from "../../../../prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Event } from "@/types/api.types";

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformedEvents: Event[] = events.map((event: any) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      organizer: event.organizer,
      category: event.category,
      points: event.points,
      capacity: event.capacity,
      registeredCount: event._count.registrations,
      status: event.status,
      imageUrl: event.imageUrl,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
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
    // TODO: Implement proper error handling/display
    // eslint-disable-next-line no-console
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
