import { Box, Grid, Skeleton } from "@mui/material";

export default function DashboardSkeleton() {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width={280} height={40} />
        <Skeleton variant="text" width={350} />
      </Box>

      {/* Merit Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Skeleton
            variant="rectangular"
            height={280}
            sx={{ borderRadius: 1 }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Skeleton
            variant="rectangular"
            height={280}
            sx={{ borderRadius: 1 }}
          />
        </Grid>
      </Grid>

      {/* Points Breakdown */}
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 1 }} />
      </Box>

      {/* Recent Activities and Upcoming Events */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Skeleton
            variant="rectangular"
            height={250}
            sx={{ borderRadius: 1 }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Skeleton
            variant="rectangular"
            height={250}
            sx={{ borderRadius: 1 }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
