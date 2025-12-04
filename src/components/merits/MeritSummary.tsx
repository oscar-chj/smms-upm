"use client";

import { getCategoryColor, getCategoryDisplayName } from "@/lib/categoryUtils";
import { EventCategory } from "@/types/api.types";
import { Assessment, CalendarToday } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";

interface MeritSummaryData {
  totalPoints: number;
  universityMerit: number;
  facultyMerit: number;
  collegeMerit: number;
  clubMerit: number;
  recentActivities: number;
  rank: number;
  totalStudents: number;
  targetPoints: number;
  progressPercentage: number;
  targetAchieved: boolean;
  remainingPoints: number;
  exceededPoints: number;
}

interface CategoryCardProps {
  category: EventCategory;
  points: number;
  targetPoints: number;
}

function CategoryCard({ category, points, targetPoints }: CategoryCardProps) {
  const percentage = Math.min((points / targetPoints) * 100, 100);
  const isCompleted = points >= targetPoints;

  return (
    <Card
      sx={{
        height: "100%",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 1,
        },
      }}
    >
      <CardContent sx={{ p: 3, height: "100%" }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontSize: "1rem",
              fontWeight: 600,
              color: "text.primary",
              mb: 1,
            }}
          >
            {getCategoryDisplayName(category)}
          </Typography>
        </Box>

        {/* Progress and stats */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            mb: 3,
          }}
        >
          <Box sx={{ position: "relative", display: "inline-flex" }}>
            <CircularProgress
              variant="determinate"
              value={percentage}
              size={60}
              thickness={4}
              sx={{
                color: getCategoryColor(category),
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="body2"
                component="div"
                sx={{
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "text.primary",
                }}
              >
                {Math.round(percentage)}%
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "text.primary",
                fontSize: "1.75rem",
                lineHeight: 1,
                mb: 0.5,
              }}
            >
              {points}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontSize: "0.875rem",
              }}
            >
              of {targetPoints} points
            </Typography>
          </Box>
        </Box>

        {/* Status */}
        <Typography
          variant="body2"
          sx={{
            color: isCompleted ? "success.main" : "text.secondary",
            fontSize: "0.875rem",
            fontWeight: 500,
          }}
        >
          {isCompleted
            ? `Target achieved${
                points > targetPoints ? ` (+${points - targetPoints})` : ""
              }`
            : `${targetPoints - points} points remaining`}
        </Typography>
      </CardContent>
    </Card>
  );
}

interface MeritSummaryProps {
  meritData: MeritSummaryData;
  onViewReports?: () => void;
}

export default function MeritSummary({
  meritData,
  onViewReports,
}: MeritSummaryProps) {
  return (
    <Box sx={{ width: "100%" }}>
      {/* Overall Summary Card */}
      <Card
        sx={{
          mb: 4,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          borderRadius: { xs: 4, sm: 4 },
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(102, 126, 234, 0.25)",
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4, md: 4 } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "center", sm: "flex-start" },
              gap: { xs: 4, sm: 4 },
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            {/* Left section - Points */}
            <Box sx={{ flex: 1, width: { xs: "100%", sm: "auto" } }}>
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: "3.5rem", sm: "3.5rem", md: "4rem" },
                  lineHeight: 0.9,
                  mb: { xs: 1, sm: 1 },
                  background:
                    "linear-gradient(45deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {meritData.totalPoints}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  mb: { xs: 3, sm: 2 },
                  opacity: 0.95,
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                }}
              >
                Merit Points Earned
              </Typography>
              {/* Progress message */}
              <Box
                sx={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderRadius: 2,
                  p: 2.5,
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 500,
                    fontSize: { xs: "1rem", sm: "0.95rem", md: "1.1rem" },
                    lineHeight: 1.5,
                  }}
                >
                  {meritData.targetAchieved
                    ? meritData.exceededPoints > 0
                      ? `Outstanding! You've exceeded your goal by ${meritData.exceededPoints} points.`
                      : "Congratulations! You've reached your merit goal."
                    : `You're ${meritData.progressPercentage}% of the way to your goal.`}
                </Typography>
              </Box>
            </Box>

            {/* Right section - Rank & Status */}
            <Box
              sx={{
                textAlign: { xs: "center", sm: "right" },
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "center", sm: "flex-end" },
                gap: { xs: 3, sm: 2 },
                width: { xs: "100%", sm: "auto" },
                minWidth: { sm: 200 },
              }}
            >
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: "2.5rem", sm: "2rem", md: "2.5rem" },
                    lineHeight: 1,
                    mb: 0.5,
                  }}
                >
                  #{meritData.rank}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    opacity: 0.9,
                    fontWeight: 500,
                    fontSize: { xs: "1rem", sm: "0.9rem" },
                  }}
                >
                  out of {meritData.totalStudents} students
                </Typography>
              </Box>
              <Chip
                label={
                  meritData.targetAchieved
                    ? meritData.exceededPoints > 0
                      ? `+${meritData.exceededPoints} bonus points`
                      : "Goal achieved"
                    : `${meritData.remainingPoints} points to goal`
                }
                sx={{
                  backgroundColor: meritData.targetAchieved
                    ? "#4caf50"
                    : "rgba(255,255,255,0.9)",
                  color: meritData.targetAchieved ? "white" : "#1976d2",
                  fontWeight: 700,
                  fontSize: { xs: "0.95rem", sm: "0.9rem" },
                  height: "auto",
                  py: { xs: 2, sm: 1.5 },
                  px: { xs: 4, sm: 3 },
                  borderRadius: 20,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  border: meritData.targetAchieved
                    ? "none"
                    : "2px solid rgba(255,255,255,0.3)",
                  minWidth: { xs: 200, sm: "auto" },
                }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>
      {/* Progress Insight */}
      <Alert
        severity={meritData.targetAchieved ? "success" : "info"}
        sx={{
          mb: 4,
          borderRadius: 2,
          p: 3,
        }}
      >
        <Typography
          variant="body1"
          gutterBottom
          sx={{
            fontWeight: 600,
            mb: 1,
          }}
        >
          Progress Overview
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 1,
            lineHeight: 1.5,
          }}
        >
          {meritData.targetAchieved
            ? meritData.exceededPoints > 0
              ? `You've exceeded your target by ${meritData.exceededPoints} points.`
              : "You've successfully reached your merit goal."
            : `${meritData.remainingPoints} more points needed to reach your goal.`}
        </Typography>
        {!meritData.targetAchieved && (
          <Typography
            variant="body2"
            sx={{
              opacity: 0.8,
              lineHeight: 1.4,
            }}
          >
            Tip: International and Faculty events typically offer higher point
            values.
          </Typography>
        )}
      </Alert>
      {/* Action Buttons - Above breakdown, without leaderboard */}
      {onViewReports && (
        <Box
          sx={{
            display: "flex",
            gap: { xs: 2, sm: 2 },
            flexWrap: "wrap",
            mb: 4,
            justifyContent: { xs: "center", sm: "flex-start" },
          }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<Assessment />}
            onClick={onViewReports}
            sx={{
              minWidth: { xs: 250, sm: 200 },
              height: { xs: 50, sm: "auto" },
              fontSize: { xs: "1rem", sm: "0.875rem" },
              py: { xs: 1.5, sm: 1 },
              borderRadius: { xs: 3, sm: 1 },
            }}
          >
            View Detailed Report
          </Button>
        </Box>
      )}
      {/* Merit Categories */}
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{
          mb: { xs: 3, sm: 3 },
          fontSize: { xs: "1.5rem", sm: "1.5rem" },
          fontWeight: 600,
          textAlign: { xs: "center", sm: "left" },
        }}
      >
        Merit Categories Breakdown
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr", // 1 column on mobile for better readability
            sm: "repeat(2, 1fr)", // 2 columns on tablet
            lg: "repeat(4, 1fr)", // 4 columns on desktop
          },
          gap: { xs: 3, sm: 3 },
          mb: 4,
        }}
      >
        <CategoryCard
          category={EventCategory.UNIVERSITY}
          points={meritData.universityMerit}
          targetPoints={50}
        />
        <CategoryCard
          category={EventCategory.FACULTY}
          points={meritData.facultyMerit}
          targetPoints={50}
        />
        <CategoryCard
          category={EventCategory.COLLEGE}
          points={meritData.collegeMerit}
          targetPoints={30}
        />
        <CategoryCard
          category={EventCategory.CLUB}
          points={meritData.clubMerit}
          targetPoints={20}
        />
      </Box>
      {/* Quick Stats */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
          },
          gap: { xs: 3, sm: 3 },
          mb: 4,
        }}
      >
        <Paper
          sx={{
            p: { xs: 4, sm: 3 },
            textAlign: "center",
            borderRadius: { xs: 3, sm: 2 },
            transition:
              "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: 2,
            },
            minHeight: { xs: 140, sm: "auto" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CalendarToday
            color="primary"
            sx={{
              fontSize: { xs: 40, sm: 40 },
              mb: { xs: 2, sm: 1 },
            }}
          />
          <Typography
            variant="h4"
            fontWeight="bold"
            color="primary"
            sx={{
              fontSize: { xs: "2rem", sm: "2rem" },
              mb: { xs: 1, sm: 0.5 },
            }}
          >
            {meritData.recentActivities}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: { xs: "0.9rem", sm: "0.875rem" },
              fontWeight: 500,
            }}
          >
            Recent Activities
          </Typography>
        </Paper>

        <Paper
          sx={{
            p: { xs: 4, sm: 3 },
            textAlign: "center",
            borderRadius: { xs: 3, sm: 2 },
            transition:
              "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: 2,
            },
            minHeight: { xs: 140, sm: "auto" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Assessment
            color="success"
            sx={{
              fontSize: { xs: 40, sm: 40 },
              mb: { xs: 2, sm: 1 },
            }}
          />
          <Typography
            variant="h4"
            fontWeight="bold"
            color="success.main"
            sx={{
              fontSize: { xs: "2rem", sm: "2rem" },
              mb: { xs: 1, sm: 0.5 },
            }}
          >
            {Math.round(meritData.progressPercentage)}%
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: { xs: "0.9rem", sm: "0.875rem" },
              fontWeight: 500,
            }}
          >
            Target Achievement
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}
