"use client";

import MeritSummary from "@/components/merits/MeritSummary";
import meritService from "@/services/merit/meritService";
import { Alert, Box, Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";

interface MeritSummaryData {
  totalPoints: number;
  targetPoints: number;
  universityMerit: number;
  facultyMerit: number;
  collegeMerit: number;
  clubMerit: number;
  recentActivities: number;
  rank: number;
  totalStudents: number;
  progressPercentage: number;
  targetAchieved: boolean;
  remainingPoints: number;
  exceededPoints: number;
}

export default function MeritsPage() {
  const [meritData, setMeritData] = useState<MeritSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    // Fetch merit data from API
    const fetchMeritData = async () => {
      try {
        setIsLoading(true);

        // Get merit data from API (will use current user from NextAuth session)
        // If studentId is not provided, the API will use the current authenticated user
        const response = await meritService.getStudentMeritSummary();

        if (response.success && response.data) {
          setMeritData(response.data);
        } else {
          if (response.error?.includes("Unauthorized")) {
            setError("No authenticated user found. Please log in again.");
          } else {
            setError(response.error || "Failed to load merit data.");
          }
        }
      } catch (err) {
        // TODO: Implement proper error handling/display
        // eslint-disable-next-line no-console
        console.error("Error fetching merit data:", err);
        setError("Failed to load merit data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeritData();
  }, []);

  const handleViewReports = () => {
    // In production, this would navigate to reports page
    window.location.href = "/dashboard/reports";
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !meritData) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error ||
            "Unable to load merit data. Please check if event data is available."}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <MeritSummary meritData={meritData} onViewReports={handleViewReports} />
  );
}
