"use client";

import GlobeIcon from "@/components/common/GlobeIcon";
import {
  Box,
  Button,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { signIn } from "next-auth/react";
import { useState } from "react";
import GoogleSignInButton from "./GoogleSignInButton";

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
  const isDev = process.env.NODE_ENV !== "production";
  const [devEmail, setDevEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDevLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn("dev-backdoor", {
        email: devEmail,
        redirectTo: redirectPath,
      });
    } catch (error) {
      // TODO: Implement proper error handling/display
      // eslint-disable-next-line no-console
      console.error("Dev login failed:", error);
      setIsLoading(false);
    }
  };

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

        {/* Development Backdoor - Only shown in development */}
        {isDev && (
          <>
            <Box
              component="form"
              onSubmit={handleDevLogin}
              sx={{ width: "100%", mb: 2 }}
            >
              <Typography
                variant="caption"
                color="warning.main"
                sx={{ mb: 1, display: "block", fontWeight: 600 }}
              >
                🔧 Development Backdoor
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="email"
                placeholder="Enter any email"
                value={devEmail}
                onChange={(e) => setDevEmail(e.target.value)}
                required
                sx={{ mb: 1 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="outlined"
                color="warning"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Dev Login"}
              </Button>
            </Box>
            <Divider sx={{ width: "100%", my: 2 }}>OR</Divider>
          </>
        )}

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
