"use client";

import { DRAWER_WIDTH, DRAWER_WIDTH_COLLAPSED } from "@/lib/constants";
import { useSession } from "next-auth/react";
import { Menu as MenuIcon } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Container,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { memo, useEffect, useState } from "react";
import Sidebar from "./Sidebar";

/**
 * Props for DashboardLayout component
 */
interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

// Constants for layout dimensions
// Imported from constants file

/**
 * Dashboard layout component that provides the main application structure
 * with responsive sidebar and app bar
 */
const DashboardLayout = memo(function DashboardLayout({
  children,
  title = "Dashboard",
}: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [, setCurrentUserName] = useState<string>("User");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { data: session } = useSession();

  useEffect(() => {
    // Update current user name from NextAuth session
    if (session?.user?.name) {
      setCurrentUserName(session.user.name);
    }
  }, [session]);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleDesktopToggle = () => {
    setDesktopCollapsed((prevState) => !prevState);
  };

  const currentDrawerWidth = desktopCollapsed
    ? DRAWER_WIDTH_COLLAPSED
    : DRAWER_WIDTH;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Desktop sidebar - permanent drawer on larger screens */}
      <Box
        component="nav"
        sx={{
          width: { sm: currentDrawerWidth },
          flexShrink: { sm: 0 },
        }}
        aria-label="main navigation"
      >
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: currentDrawerWidth,
              borderRight: "1px solid rgba(0, 0, 0, 0.08)",
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: "hidden",
            },
          }}
          open
        >
          <Sidebar
            collapsed={desktopCollapsed}
            onToggleCollapse={handleDesktopToggle}
          />
        </Drawer>

        {/* Mobile drawer - temporary and conditionally rendered */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }} // Better mobile performance
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
            },
          }}
        >
          <Sidebar onItemClick={() => isMobile && setMobileOpen(false)} />
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          overflow: "auto",
        }}
      >
        <AppBar
          position="fixed"
          color="default"
          elevation={0}
          sx={{
            width: { sm: `calc(100% - ${currentDrawerWidth}px)` },
            ml: { sm: `${currentDrawerWidth}px` },
            backgroundColor: "background.paper",
            borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
            transition: theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
              {title}
            </Typography>
          </Toolbar>
        </AppBar>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: { xs: 8, sm: 9 }, // Toolbar offset
            px: { xs: 2, sm: 4 },
            pb: 4,
            backgroundColor: "background.default",
          }}
        >
          <Container maxWidth="lg" sx={{ my: 4 }}>
            {children}
          </Container>
        </Box>
      </Box>
    </Box>
  );
});

export default DashboardLayout;
