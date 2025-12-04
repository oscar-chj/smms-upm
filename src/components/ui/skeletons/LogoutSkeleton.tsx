import { Box, CircularProgress, Typography } from "@mui/material";

export default function LogoutSkeleton() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
        p: 2,
      }}
    >
      <CircularProgress size={48} sx={{ mb: 4 }} />

      <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
        Signing you out...
      </Typography>

      <Typography variant="body1" color="text.secondary">
        Thank you for using the Student Merit Management System
      </Typography>
    </Box>
  );
}
