"use client";

import meritService from "@/services/merit/meritService";
import { EventCategory } from "@/types/api.types";
import { formatDate } from "@/lib/dateUtils";
import { getCategoryColor, getCategoryDisplayName } from "@/lib/categoryUtils";
import { ArrowForward, Assignment } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { memo, useEffect, useState } from "react";

/**
 * Props for the RecentActivities component
 */
interface RecentActivitiesProps {
  studentId: string;
}

interface ActivityItem {
  id: string;
  title: string;
  category: EventCategory;
  points: number;
  date: string;
  description: string;
}

/**
 * Component that displays a list of recent merit activities
 */
const RecentActivities = memo(function RecentActivities({
  studentId,
}: RecentActivitiesProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    // Get student's recent merit records from API
    const fetchActivities = async () => {
      try {
        const response = await meritService.getStudentMeritRecords(studentId, {
          limit: 5,
        });

        if (response.success && response.data) {
          // Convert merit records to activities format
          const recentActivities = response.data.records
            .map((record) => ({
              id: record.id,
              title: record.description,
              category: record.category,
              points: record.points,
              date: record.date,
              description: record.description,
            }));

          setActivities(recentActivities);
        }
      } catch (error) {
        console.error("Error fetching recent activities:", error);
      }
    };

    fetchActivities();
  }, [studentId]);
  // Handle empty state
  if (!activities || activities.length === 0) {
    return (
      <Card
        elevation={0}
        sx={{ borderRadius: 2, border: "1px solid rgba(0, 0, 0, 0.05)" }}
      >
        <CardContent sx={{ textAlign: "center", py: 4 }}>
          <Assignment
            sx={{ fontSize: 48, color: "text.secondary", mb: 2, opacity: 0.5 }}
          />
          <Typography variant="h6" gutterBottom>
            No Recent Activities
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Participate in university events to earn merit points.
          </Typography>
          <Button
            component={Link}
            href="/dashboard/events"
            variant="outlined"
            endIcon={<ArrowForward />}
          >
            Browse Events
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      elevation={0}
      sx={{ borderRadius: 2, border: "1px solid rgba(0, 0, 0, 0.05)" }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">Recent Activities</Typography>
          <Button
            component={Link}
            href="/dashboard/merits"
            endIcon={<ArrowForward fontSize="small" />}
            size="small"
          >
            View All
          </Button>
        </Box>

        <List disablePadding>
          {activities.map((activity, index) => (
            <Box key={activity.id}>
              <ListItem alignItems="flex-start" sx={{ py: 1.5, px: 0 }}>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: `${getCategoryColor(activity.category)}.light`,
                      fontWeight: "bold",
                    }}
                  >
                    {activity.points}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, mb: 0.5 }}
                    >
                      {activity.title}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        variant="body2"
                        component="span"
                        display="block"
                        sx={{ color: "text.secondary" }}
                      >
                        {formatDate(activity.date)}
                      </Typography>
                      <Typography
                        component="span"
                        display="block"
                        sx={{ mt: 0.5 }}
                      >
                        <Chip
                          label={getCategoryDisplayName(activity.category)}
                          color={getCategoryColor(activity.category)}
                          size="small"
                          sx={{ fontSize: "0.7rem" }}
                        />
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              {index < activities.length - 1 && <Divider variant="inset" />}
            </Box>
          ))}
        </List>
      </CardContent>
    </Card>
  );
});

export default RecentActivities;
