import { Box, Grid, Skeleton } from "@mui/material";

export default function MeritSummarySkeleton() {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="text" width={250} height={40} />
        <Skeleton variant="text" width={400} />
      </Box>

      {/* Summary Card */}
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
      </Box>

      {/* Category Breakdown */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[1, 2, 3, 4].map((i) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
            <Skeleton
              variant="rectangular"
              height={180}
              sx={{ borderRadius: 1 }}
            />
          </Grid>
        ))}
      </Grid>

      {/* Recent Activities */}
      <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 1 }} />
    </Box>
  );
}
