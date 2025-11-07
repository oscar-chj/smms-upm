"use client";

import { useSearchParams } from "next/navigation";
import { Box, Paper, Typography, Button } from "@mui/material";
import Link from "next/link";
import GlobeIcon from "@/components/common/GlobeIcon";
import { Suspense } from "react";

// Error messages mapping
const errorMessages: Record<string, { title: string; description: string }> = {
  Configuration: {
    title: "Server Configuration Error",
    description: "There is a problem with the server configuration.",
  },
  AccessDenied: {
    title: "Access Denied",
    description:
      "You do not have permission to sign in. Please use a valid UPM email address.",
  },
  Verification: {
    title: "Email Not Verified",
    description:
      "Your email address is not verified. Please verify your email and try again.",
  },
  OAuthSignin: {
    title: "OAuth Sign In Error",
    description: "Error in constructing an authorization URL.",
  },
  OAuthCallback: {
    title: "OAuth Callback Error",
    description: "Error in handling the response from an OAuth provider.",
  },
  OAuthCreateAccount: {
    title: "Could Not Create Account",
    description: "Could not create OAuth provider user in the database.",
  },
  EmailCreateAccount: {
    title: "Could Not Create Account",
    description: "Could not create email provider user in the database.",
  },
  Callback: {
    title: "Authentication Error",
    description: "Error in the OAuth callback handler route.",
  },
  OAuthAccountNotLinked: {
    title: "Account Already Exists",
    description:
      "This email is already associated with another account. Please sign in using the original method.",
  },
  EmailSignin: {
    title: "Email Sign In Error",
    description: "Check your email address and try again.",
  },
  CredentialsSignin: {
    title: "Sign In Failed",
    description: "Sign in failed. Check the details you provided are correct.",
  },
  SessionRequired: {
    title: "Session Required",
    description: "You must be signed in to access this page.",
  },
  Default: {
    title: "Authentication Error",
    description: "An unexpected error occurred. Please try again.",
  },
};

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "Default";

  const errorInfo = errorMessages[error] || errorMessages.Default;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        p: 2,
        backgroundColor: "background.default",
      }}
    >
      <Paper
        elevation={2}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: { xs: 3, md: 6 },
          width: "100%",
          maxWidth: "500px",
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <GlobeIcon
          width={60}
          height={60}
          sx={{
            display: "block",
            margin: "0 auto",
            mb: 2,
            opacity: 0.8,
          }}
        />

        {/* Error Icon */}
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            backgroundColor: "error.light",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="h3"
            sx={{ color: "error.main", fontWeight: "bold" }}
          >
            ⚠
          </Typography>
        </Box>

        {/* Error Title */}
        <Typography
          variant="h5"
          component="h1"
          sx={{ fontWeight: 600, mb: 2, color: "text.primary" }}
        >
          {errorInfo.title}
        </Typography>

        {/* Error Description */}
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 3, maxWidth: "400px" }}
        >
          {errorInfo.description}
        </Typography>

        {/* Error Code (for debugging) */}
        {error !== "Default" && (
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ mb: 3, fontFamily: "monospace" }}
          >
            Error Code: {error}
          </Typography>
        )}

        {/* Action Buttons */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            gap: 2,
            flexDirection: "column",
          }}
        >
          <Button
            component={Link}
            href="/auth/login"
            variant="contained"
            size="large"
            fullWidth
          >
            Try Again
          </Button>
          <Button
            component={Link}
            href="/"
            variant="outlined"
            size="large"
            fullWidth
          >
            Go to Home
          </Button>
        </Box>
      </Paper>

      <Typography variant="body2" color="white" sx={{ mt: 4, opacity: 0.9 }}>
        © {new Date().getFullYear()} eKolej Merit System
      </Typography>
    </Box>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <Typography>Loading...</Typography>
        </Box>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
