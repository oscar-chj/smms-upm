import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../prisma/prisma";

/**
 * POST /api/events/[id]/register
 * Register current user for an event
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: eventId } = await params;
    const studentId = user.id;

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
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

    // Check if already registered
    const existingRegistration = await prisma.eventRegistration.findUnique({
      where: {
        eventId_studentId: {
          eventId,
          studentId,
        },
      },
    });

    if (existingRegistration) {
      return NextResponse.json(
        {
          success: false,
          error: "Already registered for this event",
          data: existingRegistration,
        },
        { status: 400 }
      );
    }

    // Check if event is at capacity
    const registrationStatus =
      event._count.registrations < event.capacity ? "REGISTERED" : "WAITLISTED";

    // Create registration
    const registration = await prisma.eventRegistration.create({
      data: {
        eventId,
        studentId,
        status: registrationStatus,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: registration.id,
        eventId: registration.eventId,
        studentId: registration.studentId,
        registrationDate: registration.registrationDate
          .toISOString()
          .split("T")[0],
        status:
          registration.status === "REGISTERED" ? "Registered" : "Waitlisted",
        attendanceMarked: registration.attendanceMarked,
        pointsAwarded: registration.pointsAwarded,
      },
      message:
        registrationStatus === "REGISTERED"
          ? "Successfully registered for the event"
          : "Added to the waitlist for the event",
    });
  } catch (error) {
    // TODO: Implement proper error handling/display
    // eslint-disable-next-line no-console
    console.error("Error registering for event:", error);
    return NextResponse.json(
      { success: false, error: "Failed to register for event" },
      { status: 500 }
    );
  }
}
