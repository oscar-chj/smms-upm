import { Box, Grid, Skeleton } from "@mui/material";

export default function EventListSkeleton() {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="text" width={350} />
      </Box>

      {/* Filter Bar */}
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
      </Box>

      {/* Tabs */}
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="rectangular" height={48} width={400} />
      </Box>

      {/* Event Cards Grid */}
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
            <Skeleton
              variant="rectangular"
              height={320}
              sx={{ borderRadius: 1 }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
