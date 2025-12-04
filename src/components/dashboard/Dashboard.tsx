"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { ErrorDisplay, LoadingDisplay } from "@/components/ui/ErrorDisplay";
import { useUserProfile } from "@/hooks/useUserProfile";
import eventService from "@/services/event/eventService";
import { Event } from "@/types/api.types";
import { Box, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import MeritSummaryCard from "./MeritSummaryCard";
import PointsBreakdown from "./PointsBreakdown";
import ProgressInsights from "./ProgressInsights";
import RecentActivities from "./RecentActivities";
import UpcomingEvents from "./UpcomingEvents";

export default function Dashboard() {
  const { student, meritSummary, isLoading, error, refresh } = useUserProfile();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);

  // Fetch upcoming events
  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const response = await eventService.getEvents(
          { page: 1, limit: 5 },
          { status: "Upcoming" }
        );
        if (response.success && response.data) {
          setUpcomingEvents(response.data);
        }
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
      }
    };

    fetchUpcomingEvents();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout title="Merit Dashboard">
        <LoadingDisplay message="Loading your dashboard..." />
      </DashboardLayout>
    );
  }

  if (error || !student || !meritSummary) {
    return (
      <DashboardLayout title="Merit Dashboard">
        <ErrorDisplay
          message={
            error || "Unable to load dashboard data. Please try again later."
          }
          showRetry
          onRetry={refresh}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Merit Dashboard">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Your Merit Progress
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Track your merit points and upcoming activities
        </Typography>
      </Box>

      {/* Merit Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <MeritSummaryCard
            totalPoints={meritSummary.totalPoints}
            targetPoints={meritSummary.targetPoints}
            targetAchieved={meritSummary.targetAchieved}
            remainingPoints={meritSummary.remainingPoints}
            exceededPoints={meritSummary.exceededPoints}
            progressPercentage={meritSummary.progressPercentage}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ProgressInsights
            targetAchieved={meritSummary.targetAchieved}
            remainingPoints={meritSummary.remainingPoints}
            exceededPoints={meritSummary.exceededPoints}
            progressPercentage={meritSummary.progressPercentage}
          />
        </Grid>
      </Grid>

      {/* Points Breakdown */}
      <Box sx={{ mb: 4 }}>
        <PointsBreakdown
          universityMerit={meritSummary.universityMerit}
          facultyMerit={meritSummary.facultyMerit}
          collegeMerit={meritSummary.collegeMerit}
          clubMerit={meritSummary.clubMerit}
        />
      </Box>

      {/* Recent Activities and Upcoming Events */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <RecentActivities studentId={student.id} />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <UpcomingEvents events={upcomingEvents} />
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
