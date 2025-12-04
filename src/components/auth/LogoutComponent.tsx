"use client";

import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

/**
 * Component that handles the logout process and provides visual feedback
 */
export default function LogoutComponent() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Sign out using NextAuth - it will automatically redirect to sign-in page
        await signOut({
          callbackUrl: "/auth/login",
        });
      } catch (e) {
        // TODO: Implement proper error handling/display
        // eslint-disable-next-line no-console
        console.error("Logout error:", e);
        setError("An unexpected error occurred while signing out");
      }
    };

    handleLogout();
  }, []);

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
      {error ? (
        <Alert severity="error" sx={{ mb: 4, maxWidth: 450 }}>
          {error}
        </Alert>
      ) : (
        <CircularProgress size={48} sx={{ mb: 4 }} />
      )}

      <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
        {error ? "Error during sign out" : "Signing you out..."}
      </Typography>

      <Typography variant="body1" color="text.secondary">
        {error
          ? "Please try again"
          : "Thank you for using the Student Merit Management System"}
      </Typography>
    </Box>
  );
}
