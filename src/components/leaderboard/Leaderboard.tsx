"use client";

import { useSession } from "next-auth/react";
import { UserRole } from "@/types/auth.types";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Paper,
  Skeleton,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

interface LeaderboardEntry {
  id: string;
  studentId: string;
  name: string;
  faculty: string;
  year: number;
  totalPoints: number;
  universityPoints: number;
  facultyPoints: number;
  collegePoints: number;
  clubPoints: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`leaderboard-tabpanel-${index}`}
      aria-labelledby={`leaderboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function getRankColor(rank: number): string {
  switch (rank) {
    case 1:
      return "#FFD700"; // Gold
    case 2:
      return "#C0C0C0"; // Silver
    case 3:
      return "#CD7F32"; // Bronze
    default:
      return "#757575"; // Gray
  }
}

function getRankIcon(rank: number): string {
  switch (rank) {
    case 1:
      return "🥇";
    case 2:
      return "🥈";
    case 3:
      return "🥉";
    default:
      return `#${rank}`;
  }
}

interface LeaderboardTableProps {
  sortBy: "total" | "university" | "faculty" | "college" | "club";
  currentUserId?: string;
}

async function getCurrentUserRanking(
  currentUserId: string,
  sortBy: "total" | "university" | "faculty" | "college" | "club"
) {
  try {
    const response = await fetch(`/api/leaderboard?sortBy=${sortBy}`);
    if (!response.ok) return null;

    const data = await response.json();
    if (!data.success || !data.data) return null;

    const sortedData = data.data;
    const userIndex = sortedData.findIndex(
      (entry: { id: string }) => entry.id === currentUserId
    );

    if (userIndex === -1) return null;

    const userEntry = sortedData[userIndex];
    const rank = userIndex + 1;

    let points = userEntry.totalPoints;
    switch (sortBy) {
      case "university":
        points = userEntry.universityMerit;
        break;
      case "faculty":
        points = userEntry.facultyMerit;
        break;
      case "college":
        points = userEntry.collegeMerit;
        break;
      case "club":
        points = userEntry.clubMerit;
        break;
    }

    return { rank, points, total: sortedData.length };
  } catch (error) {
    // TODO: Implement proper error handling/display
    // eslint-disable-next-line no-console
    console.error("Error getting user ranking:", error);
    return null;
  }
}

interface CurrentUserRankingProps {
  currentUserId: string;
  sortBy: "total" | "university" | "faculty" | "college" | "club";
  isStudent: boolean;
}

function CurrentUserRanking({
  currentUserId,
  sortBy,
  isStudent,
}: CurrentUserRankingProps) {
  const [ranking, setRanking] = React.useState<{
    rank: number;
    points: number;
    total: number;
  } | null>(null);

  useEffect(() => {
    if (!isStudent) return;

    getCurrentUserRanking(currentUserId, sortBy).then(setRanking);
  }, [currentUserId, sortBy, isStudent]);

  if (!isStudent || !ranking) return null;
  const categoryNames = {
    total: "Overall",
    university: "University Merit",
    faculty: "Faculty Merit",
    college: "College Merit",
    club: "Club Merit",
  };

  return (
    <Card sx={{ mb: 3, bgcolor: "primary.main", color: "white" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Your {categoryNames[sortBy]} Ranking
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Box>
            <Typography variant="h3" fontWeight="bold">
              #{ranking.rank}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              out of {ranking.total} students
            </Typography>
          </Box>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {ranking.points}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              points earned
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function LeaderboardTable({
  sortBy,
  currentUserId = "1",
}: LeaderboardTableProps) {
  const [sortedData, setSortedData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/leaderboard?sortBy=${sortBy}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setSortedData(data.data);
          }
        }
      } catch (error) {
        // TODO: Implement proper error handling/display
        // eslint-disable-next-line no-console
        console.error("Error fetching leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [sortBy]);

  // Show only top 10 students for leaderboard
  const displayData = sortedData.slice(0, 10);

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 80, minWidth: 80 }}>Rank</TableCell>
                  <TableCell sx={{ width: 220, minWidth: 220 }}>
                    Student
                  </TableCell>
                  <TableCell sx={{ width: 150, minWidth: 150 }}>
                    Faculty
                  </TableCell>
                  <TableCell sx={{ width: 100, minWidth: 100 }}>Year</TableCell>
                  <TableCell align="right" sx={{ width: 140, minWidth: 140 }}>
                    Points
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...Array(10)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton variant="circular" width={32} height={32} />
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Skeleton variant="circular" width={32} height={32} />
                        <Box sx={{ flex: 1 }}>
                          <Skeleton width="60%" />
                          <Skeleton width="40%" />
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Skeleton width="80%" />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={60} />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton width={40} sx={{ ml: "auto" }} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 80, minWidth: 80 }}>Rank</TableCell>
                <TableCell sx={{ width: 220, minWidth: 220 }}>
                  Student
                </TableCell>
                <TableCell sx={{ width: 150, minWidth: 150 }}>
                  Faculty
                </TableCell>
                <TableCell sx={{ width: 100, minWidth: 100 }}>Year</TableCell>
                <TableCell align="right" sx={{ width: 140, minWidth: 140 }}>
                  {sortBy === "total" && "Total Points"}
                  {sortBy === "university" && "University Merit"}
                  {sortBy === "faculty" && "Faculty Merit"}
                  {sortBy === "college" && "College Merit"}
                  {sortBy === "club" && "Club Merit"}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayData.map((entry) => {
                // Calculate actual rank based on original position
                const actualIndex = sortedData.findIndex(
                  (item) => item.id === entry.id
                );
                const displayRank = actualIndex + 1;
                const isCurrentUser = entry.id === currentUserId;

                let points = entry.totalPoints;

                switch (sortBy) {
                  case "university":
                    points = entry.universityPoints;
                    break;
                  case "faculty":
                    points = entry.facultyPoints;
                    break;
                  case "college":
                    points = entry.collegePoints;
                    break;
                  case "club":
                    points = entry.clubPoints;
                    break;
                }

                return (
                  <TableRow
                    key={entry.id}
                    sx={{
                      "&:nth-of-type(odd)": { backgroundColor: "action.hover" },
                      ...(isCurrentUser && {
                        color: "primary.contrastText",
                        border: "2px solid",
                        borderColor: "primary.main",
                      }),
                    }}
                  >
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            color: getRankColor(displayRank),
                            fontWeight: "bold",
                          }}
                        >
                          {getRankIcon(displayRank)}
                        </Typography>
                        {isCurrentUser && (
                          <Chip label="You" size="small" color="primary" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {entry.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {entry.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {entry.studentId}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{entry.faculty}</TableCell>
                    <TableCell>
                      <Chip
                        label={`Year ${entry.year}`}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="h6"
                        color="primary"
                        fontWeight="bold"
                      >
                        {points}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}

function TopThreePodium({ currentUserId = "1" }: { currentUserId?: string }) {
  const [top3, setTop3] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTop3 = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/leaderboard?sortBy=total");
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setTop3(data.data.slice(0, 3));
          }
        }
      } catch (error) {
        // TODO: Implement proper error handling/display
        // eslint-disable-next-line no-console
        console.error("Error fetching top 3:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTop3();
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          🏆 Top Performers
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          {[...Array(3)].map((_, index) => (
            <Card
              key={index}
              sx={{
                minWidth: 200,
                textAlign: "center",
                border: "2px solid #FFD700",
              }}
            >
              <CardContent>
                <Skeleton
                  variant="circular"
                  width={64}
                  height={64}
                  sx={{ mx: "auto", mb: 2 }}
                />
                <Skeleton width="60%" sx={{ mx: "auto", mb: 1 }} />
                <Skeleton width="80%" sx={{ mx: "auto", mb: 2 }} />
                <Skeleton width={60} height={40} sx={{ mx: "auto", mb: 0.5 }} />
                <Skeleton width={80} sx={{ mx: "auto" }} />
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        🏆 Top Performers
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        {top3.map((student, index) => {
          const isCurrentUser = student.id === currentUserId;
          return (
            <Card
              key={student.id}
              sx={{
                minWidth: 200,
                textAlign: "center",
                position: "relative",
                border: "2px solid #FFD700",
                ...(isCurrentUser && {
                  boxShadow: "0 0 20px rgba(25, 118, 210, 0.4)",
                  border: "2px solid",
                  borderColor: "primary.main",
                }),
              }}
            >
              <CardContent>
                {index === 0 && (
                  <Box sx={{ position: "absolute", top: -8, right: 0 }}>
                    <Typography fontSize="2rem">👑</Typography>
                  </Box>
                )}
                {isCurrentUser && (
                  <Box sx={{ position: "absolute", top: 8, left: 8 }}>
                    <Chip label="You!" size="small" color="primary" />
                  </Box>
                )}
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    mx: "auto",
                    mb: 2,
                    bgcolor: getRankColor(index + 1),
                  }}
                >
                  {student.name.charAt(0)}
                </Avatar>
                <Typography variant="h6" fontWeight="bold">
                  {student.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {student.faculty} • Year {student.year}
                </Typography>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  {student.totalPoints}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total Points
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}

export default function Leaderboard() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string>("1"); // Default fallback
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(
    UserRole.STUDENT
  );
  const { data: session } = useSession();

  useEffect(() => {
    // Get current user from NextAuth session
    if (session?.user?.id) {
      setCurrentUserId(session.user.id);
      // @ts-expect-error - role is added in auth callbacks
      setCurrentUserRole(session.user.role as UserRole);
    }
  }, [session]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };
  const sortByOptions: Array<
    "total" | "university" | "faculty" | "college" | "club"
  > = ["total", "university", "faculty", "college", "club"];

  const currentSortBy = sortByOptions[selectedTab];
  const isStudent = currentUserRole === UserRole.STUDENT;

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Merit Leaderboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          See how you rank among your peers across different merit categories
        </Typography>
      </Box>
      {/* Show current user's ranking if they're a student */}
      <CurrentUserRanking
        currentUserId={currentUserId}
        sortBy={currentSortBy}
        isStudent={isStudent}
      />
      <TopThreePodium currentUserId={currentUserId} />
      <Paper>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Overall Ranking" />
          <Tab label="University Merit" />
          <Tab label="Faculty Merit" />
          <Tab label="College Merit" />
          <Tab label="Club Merit" />
        </Tabs>
        <TabPanel value={selectedTab} index={0}>
          <LeaderboardTable sortBy="total" currentUserId={currentUserId} />
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
          <LeaderboardTable sortBy="university" currentUserId={currentUserId} />
        </TabPanel>
        <TabPanel value={selectedTab} index={2}>
          <LeaderboardTable sortBy="faculty" currentUserId={currentUserId} />
        </TabPanel>
        <TabPanel value={selectedTab} index={3}>
          <LeaderboardTable sortBy="college" currentUserId={currentUserId} />
        </TabPanel>
        <TabPanel value={selectedTab} index={4}>
          <LeaderboardTable sortBy="club" currentUserId={currentUserId} />
        </TabPanel>
      </Paper>
    </Box>
  );
}
