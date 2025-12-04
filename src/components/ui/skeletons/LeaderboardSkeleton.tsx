import {
  Box,
  Card,
  CardContent,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export default function LeaderboardSkeleton() {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 1 }} />
        <Skeleton variant="text" width={350} height={24} />
      </Box>

      {/* Current User Ranking Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Skeleton
              variant="circular"
              width={80}
              height={80}
              sx={{ mx: "auto", mb: 2 }}
            />
            <Skeleton width="60%" sx={{ mx: "auto", mb: 1 }} />
            <Skeleton width="80%" sx={{ mx: "auto", mb: 2 }} />
            <Skeleton width={60} height={40} sx={{ mx: "auto", mb: 0.5 }} />
            <Skeleton width={80} sx={{ mx: "auto" }} />
          </Box>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Box sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}>
        <Box sx={{ display: "flex", gap: 3 }}>
          <Skeleton variant="rectangular" width={120} height={48} />
          <Skeleton variant="rectangular" width={120} height={48} />
          <Skeleton variant="rectangular" width={120} height={48} />
          <Skeleton variant="rectangular" width={120} height={48} />
          <Skeleton variant="rectangular" width={120} height={48} />
        </Box>
      </Box>

      {/* Leaderboard Table */}
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
    </Box>
  );
}
