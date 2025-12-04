import { auth } from "@/auth";
import { prisma } from "../../../../../prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Event, EventCategory } from "@/types/api.types";

// Map Prisma enum to frontend enum
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

// Map Prisma status to frontend status
const mapPrismaStatusToFrontend = (status: string): string => {
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
 * GET /api/events/[id]
 * Get a single event by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: params.id },
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

    if (!event) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    // Transform to match frontend Event type
    const transformedEvent: Event = {
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date.toISOString().split("T")[0],
      time: event.time,
      location: event.location,
      organizer: event.organizer,
      category: mapPrismaCategoryToFrontend(event.category),
      points: event.points,
      capacity: event.capacity,
      registeredCount: event._count.registrations,
      status: mapPrismaStatusToFrontend(event.status) as any,
      imageUrl: event.imageUrl || undefined,
    };

    return NextResponse.json({
      success: true,
      data: transformedEvent,
    });
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

