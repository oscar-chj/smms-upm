import { Event, EventCategory, EventStatus } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma";

/**
 * GET /api/events/[id]
 * Get a single event by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            registrations: true, // Count all registrations regardless of status
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
      date: event.date,
      time: event.time,
      location: event.location,
      organizer: event.organizer,
      category: event.category as EventCategory,
      points: event.points,
      capacity: event.capacity,
      registeredCount: event._count.registrations,
      status: event.status as EventStatus,
      imageUrl: event.imageUrl,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };

    return NextResponse.json({
      success: true,
      data: transformedEvent,
    });
  } catch (error) {
    // TODO: Implement proper error handling/display
    // eslint-disable-next-line no-console
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}
