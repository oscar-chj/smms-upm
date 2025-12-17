/* eslint-disable no-console */
import {
  PrismaClient,
  UserRole,
  EventCategory,
  EventStatus,
  RegistrationStatus,
} from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clean existing data (in correct order to respect foreign keys)
  console.log("🧹 Cleaning existing data...");
  await prisma.meritRecord.deleteMany({});
  await prisma.eventRegistration.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.user.deleteMany({});
  console.log("✅ Cleaned existing data");

  // Create Admin Users
  console.log("👤 Creating admin users...");
  await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@upm.edu.my",
      emailVerified: true,
      role: UserRole.ADMIN,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    },
  });

  await prisma.user.create({
    data: {
      name: "System Administrator",
      email: "sysadmin@upm.edu.my",
      emailVerified: true,
      role: UserRole.ADMIN,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sysadmin",
    },
  });
  console.log(`✅ Created ${2} admin users`);

  // Create Student Users
  console.log("👨‍🎓 Creating student users...");
  const students = await Promise.all([
    prisma.user.create({
      data: {
        name: "Ahmad Hafiz bin Abdullah",
        email: "ahmad.hafiz@student.upm.edu.my",
        emailVerified: true,
        role: UserRole.STUDENT,
        studentId: "S12345678",
        faculty: "Faculty of Engineering",
        year: 3,
        program: "Software Engineering",
        totalMeritPoints: 0,
        enrollmentDate: new Date("2022-09-01"),
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=ahmad",
      },
    }),
    prisma.user.create({
      data: {
        name: "Siti Nurhaliza binti Hassan",
        email: "siti.nurhaliza@student.upm.edu.my",
        emailVerified: true,
        role: UserRole.STUDENT,
        studentId: "S23456789",
        faculty: "Faculty of Computer Science",
        year: 2,
        program: "Computer Science",
        totalMeritPoints: 0,
        enrollmentDate: new Date("2023-09-01"),
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=siti",
      },
    }),
    prisma.user.create({
      data: {
        name: "Muhammad Azmi bin Yusof",
        email: "azmi.yusof@student.upm.edu.my",
        emailVerified: true,
        role: UserRole.STUDENT,
        studentId: "S34567890",
        faculty: "Faculty of Engineering",
        year: 4,
        program: "Electrical Engineering",
        totalMeritPoints: 0,
        enrollmentDate: new Date("2021-09-01"),
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=azmi",
      },
    }),
    prisma.user.create({
      data: {
        name: "Nurul Izzah binti Rahman",
        email: "nurul.izzah@student.upm.edu.my",
        emailVerified: true,
        role: UserRole.STUDENT,
        studentId: "S45678901",
        faculty: "Faculty of Science",
        year: 1,
        program: "Biotechnology",
        totalMeritPoints: 0,
        enrollmentDate: new Date("2024-09-01"),
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=nurul",
      },
    }),
    prisma.user.create({
      data: {
        name: "Lee Wei Ming",
        email: "lee.weiming@student.upm.edu.my",
        emailVerified: true,
        role: UserRole.STUDENT,
        studentId: "S56789012",
        faculty: "Faculty of Computer Science",
        year: 3,
        program: "Information Technology",
        totalMeritPoints: 0,
        enrollmentDate: new Date("2022-09-01"),
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=lee",
      },
    }),
  ]);
  console.log(`✅ Created ${students.length} student users`);

  // Create Events
  console.log("📅 Creating events...");
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const events = await Promise.all([
    // Upcoming Events
    prisma.event.create({
      data: {
        title: "UPM Innovation Summit 2025",
        description:
          "Annual innovation summit showcasing student research and projects. Network with industry leaders and present your innovations.",
        date: nextWeek,
        time: "09:00 AM - 5:00 PM",
        location: "Dewan Besar, Canselori Putra",
        organizer: "Office of Innovation and Commercialization",
        category: EventCategory.UNIVERSITY,
        points: 50,
        capacity: 500,
        registeredCount: 0,
        status: EventStatus.UPCOMING,
        imageUrl: "https://picsum.photos/seed/innovation/800/400",
      },
    }),
    prisma.event.create({
      data: {
        title: "Engineering Faculty Career Fair",
        description:
          "Meet with top employers from engineering industries. Internship and job opportunities available.",
        date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        time: "10:00 AM - 4:00 PM",
        location: "Faculty of Engineering Hall",
        organizer: "Faculty of Engineering",
        category: EventCategory.FACULTY,
        points: 30,
        capacity: 300,
        registeredCount: 0,
        status: EventStatus.UPCOMING,
        imageUrl: "https://picsum.photos/seed/careerfair/800/400",
      },
    }),
    prisma.event.create({
      data: {
        title: "Hackathon 2025: Code for Change",
        description:
          "48-hour coding marathon to develop solutions for social good. Win prizes and gain recognition!",
        date: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000),
        time: "Friday 6:00 PM - Sunday 6:00 PM",
        location: "Computer Science Lab, Block A",
        organizer: "Computer Science Students Association",
        category: EventCategory.COLLEGE,
        points: 75,
        capacity: 100,
        registeredCount: 0,
        status: EventStatus.UPCOMING,
        imageUrl: "https://picsum.photos/seed/hackathon/800/400",
      },
    }),
    prisma.event.create({
      data: {
        title: "Photography Club Workshop: Portrait Lighting",
        description:
          "Learn professional portrait lighting techniques. Bring your camera!",
        date: tomorrow,
        time: "2:00 PM - 5:00 PM",
        location: "Photography Club Studio, Kolej Tun Dr. Ismail",
        organizer: "UPM Photography Club",
        category: EventCategory.CLUB,
        points: 15,
        capacity: 25,
        registeredCount: 0,
        status: EventStatus.UPCOMING,
        imageUrl: "https://picsum.photos/seed/photography/800/400",
      },
    }),
    prisma.event.create({
      data: {
        title: "Research Methodology Seminar",
        description:
          "Essential seminar for postgraduate and final year students on research methodologies and academic writing.",
        date: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
        time: "9:00 AM - 12:00 PM",
        location: "Bilik Seminar, Perpustakaan Sultanah Zanariah",
        organizer: "Graduate School",
        category: EventCategory.UNIVERSITY,
        points: 40,
        capacity: 150,
        registeredCount: 0,
        status: EventStatus.UPCOMING,
        imageUrl: "https://picsum.photos/seed/research/800/400",
      },
    }),

    // Completed Events
    prisma.event.create({
      data: {
        title: "UPM Sports Day 2024",
        description:
          "Annual inter-faculty sports competition with various sporting events.",
        date: lastMonth,
        time: "8:00 AM - 6:00 PM",
        location: "UPM Sports Complex",
        organizer: "Sports and Recreation Unit",
        category: EventCategory.UNIVERSITY,
        points: 35,
        capacity: 1000,
        registeredCount: 0, // Will be updated after registrations
        status: EventStatus.COMPLETED,
        imageUrl: "https://picsum.photos/seed/sports/800/400",
      },
    }),
    prisma.event.create({
      data: {
        title: "Leadership Training Camp",
        description:
          "Three-day leadership development camp for student leaders.",
        date: lastWeek,
        time: "All Day",
        location: "Port Dickson, Negeri Sembilan",
        organizer: "Student Affairs Division",
        category: EventCategory.UNIVERSITY,
        points: 60,
        capacity: 80,
        registeredCount: 0, // Will be updated after registrations
        status: EventStatus.COMPLETED,
        imageUrl: "https://picsum.photos/seed/leadership/800/400",
      },
    }),
    prisma.event.create({
      data: {
        title: "Charity Run for Education",
        description:
          "10km charity run to raise funds for underprivileged students.",
        date: new Date(lastMonth.getTime() - 7 * 24 * 60 * 60 * 1000),
        time: "6:00 AM - 10:00 AM",
        location: "UPM Campus Loop",
        organizer: "UPM Volunteer Club",
        category: EventCategory.CLUB,
        points: 25,
        capacity: 500,
        registeredCount: 0, // Will be updated after registrations
        status: EventStatus.COMPLETED,
        imageUrl: "https://picsum.photos/seed/charity/800/400",
      },
    }),
  ]);
  console.log(`✅ Created ${events.length} events`);

  // Create Event Registrations and Merit Records
  console.log("📝 Creating event registrations and merit records...");
  const completedEvents = events.filter(
    (e) => e.status === EventStatus.COMPLETED
  );
  const upcomingEvents = events.filter(
    (e) => e.status === EventStatus.UPCOMING
  );
  let registrationCount = 0;
  let meritCount = 0;

  // Register students for COMPLETED events (with merit records)
  for (const event of completedEvents) {
    // Register all students for completed events so we have enough data
    const selectedStudents = students;

    for (const student of selectedStudents) {
      // Create registration
      await prisma.eventRegistration.create({
        data: {
          eventId: event.id,
          studentId: student.id,
          registrationDate: new Date(
            event.date.getTime() - 7 * 24 * 60 * 60 * 1000
          ), // Registered a week before
          status: RegistrationStatus.ATTENDED,
          attendanceMarked: true,
          pointsAwarded: event.points,
        },
      });
      registrationCount++;

      // Create merit record
      await prisma.meritRecord.create({
        data: {
          studentId: student.id,
          eventId: event.id,
          category: event.category,
          points: event.points,
          description: `Attended: ${event.title}`,
          date: event.date,
          isVerified: true,
          meritType: "Event Attendance",
        },
      });
      meritCount++;

      // Update student total merit points
      await prisma.user.update({
        where: { id: student.id },
        data: {
          totalMeritPoints: {
            increment: event.points,
          },
        },
      });
    }

    // Update event registered count
    await prisma.event.update({
      where: { id: event.id },
      data: {
        registeredCount: selectedStudents.length,
      },
    });
  }

  // Register students for UPCOMING events (various statuses, no merit yet)
  for (let i = 0; i < upcomingEvents.length; i++) {
    const event = upcomingEvents[i];
    // Register 2-4 students for each upcoming event
    const numRegistrations = Math.floor(Math.random() * 3) + 2;

    for (let j = 0; j < numRegistrations && j < students.length; j++) {
      const student = students[j];
      // Vary the registration status
      const statuses = [
        RegistrationStatus.REGISTERED,
        RegistrationStatus.REGISTERED,
        RegistrationStatus.WAITLISTED,
      ];
      const status = statuses[j % statuses.length];

      await prisma.eventRegistration.create({
        data: {
          eventId: event.id,
          studentId: student.id,
          registrationDate: new Date(), // Just registered
          status: status,
          attendanceMarked: false,
          pointsAwarded: 0,
        },
      });
      registrationCount++;
    }

    // Update event registered count
    await prisma.event.update({
      where: { id: event.id },
      data: {
        registeredCount: numRegistrations,
      },
    });
  }

  console.log(`✅ Created ${registrationCount} event registrations`);
  console.log(`✅ Created ${meritCount} merit records`);

  // Add some additional merit records for variety
  console.log("🏆 Creating additional merit records...");
  const additionalMerits = [
    {
      studentId: students[0].id,
      category: EventCategory.UNIVERSITY,
      points: 100,
      description: "Dean's List Award - Semester 1, 2024/2025",
      date: new Date("2024-12-01"),
      meritType: "Academic Achievement",
    },
    {
      studentId: students[1].id,
      category: EventCategory.FACULTY,
      points: 50,
      description: "Best Student Project Award",
      date: new Date("2024-11-15"),
      meritType: "Academic Achievement",
    },
    {
      studentId: students[2].id,
      category: EventCategory.CLUB,
      points: 30,
      description: "Community Service - Beach Cleanup",
      date: new Date("2024-10-20"),
      meritType: "Volunteer Work",
    },
    {
      studentId: students[0].id,
      category: EventCategory.UNIVERSITY,
      points: 75,
      description: "Inter-University Debate Competition - 2nd Place",
      date: new Date("2024-09-30"),
      meritType: "Competition",
    },
  ];

  for (const merit of additionalMerits) {
    await prisma.meritRecord.create({
      data: merit,
    });

    // Update student total merit points
    await prisma.user.update({
      where: { id: merit.studentId },
      data: {
        totalMeritPoints: {
          increment: merit.points,
        },
      },
    });
  }
  console.log(`✅ Created ${additionalMerits.length} additional merit records`);

  // Summary
  console.log("\n📊 Seed Summary:");
  console.log("================");
  const userCount = await prisma.user.count();
  const eventCount = await prisma.event.count();
  const registrationCountTotal = await prisma.eventRegistration.count();
  const meritCountTotal = await prisma.meritRecord.count();

  console.log(
    `👥 Total Users: ${userCount} (${await prisma.user.count({
      where: { role: UserRole.ADMIN },
    })} admins, ${await prisma.user.count({
      where: { role: UserRole.STUDENT },
    })} students)`
  );
  console.log(
    `📅 Total Events: ${eventCount} (${await prisma.event.count({
      where: { status: EventStatus.UPCOMING },
    })} upcoming, ${await prisma.event.count({
      where: { status: EventStatus.COMPLETED },
    })} completed)`
  );
  console.log(`📝 Total Registrations: ${registrationCountTotal}`);
  console.log(`🏆 Total Merit Records: ${meritCountTotal}`);

  console.log("\n🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
