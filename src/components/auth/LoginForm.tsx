"use client";

import GlobeIcon from "@/components/common/GlobeIcon";
import GoogleSignInButton from "./GoogleSignInButton";
import { Box, Paper, Typography } from "@mui/material";

/**
 * Props for LoginForm component
 */
interface LoginFormProps {
  redirectPath?: string;
}

/**
 * LoginForm component provides Google OAuth authentication
 */
export default function LoginForm({
  redirectPath = "/dashboard",
}: LoginFormProps) {
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
          maxWidth: "450px",
          borderRadius: 2,
        }}
      >
        {/* Logo and Title */}
        <AppLogo />

        {/* Google Sign In Button */}
        <Box sx={{ width: "100%", mt: 2 }}>
          <GoogleSignInButton redirectPath={redirectPath} />
        </Box>

        {/* Footer Text */}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 3, textAlign: "center" }}
        >
          By signing in, you agree to our Terms of Service and Privacy Policy
        </Typography>
      </Paper>

      <Typography variant="body2" color="white" sx={{ mt: 4, opacity: 0.9 }}>
        © {new Date().getFullYear()} eKolej Merit System
      </Typography>
    </Box>
  );
}

/**
 * App logo and title component
 */
function AppLogo() {
  return (
    <Box sx={{ mb: 4, textAlign: "center" }}>
      <GlobeIcon
        width={80}
        height={80}
        sx={{
          display: "block",
          margin: "0 auto",
          mb: 1,
        }}
      />
      <Typography
        variant="h4"
        component="h1"
        sx={{ mt: 2, fontWeight: 700, color: "primary.main" }}
      >
        Student&apos;s Merit Management System
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Sign in with your university account to continue
      </Typography>
    </Box>
  );
}
