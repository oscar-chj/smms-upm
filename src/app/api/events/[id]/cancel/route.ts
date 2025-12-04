import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../prisma/prisma";

/**
 * POST /api/events/[id]/cancel
 * Cancel registration for an event
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

    // Find the registration
    const registration = await prisma.eventRegistration.findUnique({
      where: {
        eventId_studentId: {
          eventId,
          studentId,
        },
      },
    });

    if (!registration) {
      return NextResponse.json(
        { success: false, error: "Registration not found" },
        { status: 404 }
      );
    }

    // Check if the registration can be cancelled
    if (registration.status === "ATTENDED") {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot cancel registration after attendance has been marked",
        },
        { status: 400 }
      );
    }

    // Delete the registration
    await prisma.eventRegistration.delete({
      where: {
        id: registration.id,
      },
    });

    // Move someone from waitlist to registered if available
    if (registration.status === "REGISTERED") {
      const waitlistedRegistration = await prisma.eventRegistration.findFirst({
        where: {
          eventId,
          status: "WAITLISTED",
        },
        orderBy: {
          registrationDate: "asc",
        },
      });

      if (waitlistedRegistration) {
        await prisma.eventRegistration.update({
          where: { id: waitlistedRegistration.id },
          data: { status: "REGISTERED" },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Registration cancelled successfully",
    });
  } catch (error) {
    // TODO: Implement proper error handling/display
    // eslint-disable-next-line no-console
    console.error("Error cancelling registration:", error);
    return NextResponse.json(
      { success: false, error: "Failed to cancel registration" },
      { status: 500 }
    );
  }
}
