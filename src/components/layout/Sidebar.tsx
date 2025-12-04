"use client";

import ProfileAvatar from "@/components/common/ProfileAvatar";
import { useUserProfile } from "@/hooks/useUserProfile";
import { getIconComponent } from "@/lib/iconUtils";
import { UserRole } from "@/types/auth.types";
import { Logout } from "@mui/icons-material";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useMemo } from "react";

export interface NavigationItem {
  text: string;
  iconName: string; // Store icon name instead of JSX
  href: string;
  tooltip?: string;
  roles?: UserRole[];
}

/**
 * Navigation items defined in component to avoid SSR/hydration issues
 */
const mainNavigationItems: NavigationItem[] = [
  {
    text: "Dashboard",
    iconName: "Dashboard",
    href: "/dashboard",
    tooltip: "View your dashboard overview",
  },
  {
    text: "Merit Points",
    iconName: "AssessmentOutlined",
    href: "/dashboard/merits",
    tooltip: "View and track your merit points",
  },
  {
    text: "Events",
    iconName: "EventNote",
    href: "/dashboard/events",
    tooltip: "Browse and register for university events",
  },
  {
    text: "Leaderboard",
    iconName: "Leaderboard",
    href: "/dashboard/leaderboard",
    tooltip: "View student merit rankings",
  },
  {
    text: "Reports",
    iconName: "Assessment",
    href: "/dashboard/reports",
    tooltip: "Generate and view merit reports",
    roles: [UserRole.STUDENT],
  },
  {
    text: "Upload Merit",
    iconName: "Upload",
    href: "/dashboard/admin/merit-upload",
    tooltip: "Upload merit points for events",
    roles: [UserRole.ADMIN],
  },
];

/**
 * Sidebar component props
 */
interface SidebarProps {
  onItemClick?: () => void;
}

/**
 * Sidebar component providing navigation for the dashboard
 */
const Sidebar = memo(function Sidebar({ onItemClick }: SidebarProps) {
  const pathname = usePathname();
  const { student, isLoading } = useUserProfile();

  // Memoize user profile object to prevent unnecessary re-renders
  const userProfile = useMemo(
    () => ({
      name: student?.name || (isLoading ? "Loading..." : "User"),
      role: student?.role || UserRole.STUDENT,
      avatar: student?.image || "/default-avatar.png",
      studentId: student?.studentId || (isLoading ? "..." : "000000"),
      faculty:
        student?.faculty || (isLoading ? "Loading..." : "Unknown Faculty"),
      year: student?.year?.toString() || (isLoading ? "..." : "0"),
    }),
    [student, isLoading]
  );

  // Filter navigation items based on user role
  const visibleNavItems = useMemo(
    () =>
      mainNavigationItems.filter(
        (item) => !item.roles || item.roles.includes(userProfile.role)
      ),
    [userProfile.role]
  );

  const handleItemClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };

  return (
    <>
      {/* User Profile Section */}
      <Box sx={{ p: 2, pt: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 2,
          }}
        >
          <ProfileAvatar
            src={userProfile.avatar}
            alt={userProfile.name}
            sx={{
              width: 80,
              height: 80,
              mb: 1.5,
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {userProfile.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {userProfile.role.toUpperCase()}
          </Typography>
        </Box>

        {/* Student Information Card */}
        {userProfile.role === UserRole.STUDENT && (
          <Stack
            spacing={0.5}
            sx={{
              p: 1.5,
              bgcolor: "background.default",
              borderRadius: 2,
              mb: 3,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Student ID: {userProfile.studentId}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Faculty: {userProfile.faculty}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Year: {userProfile.year}
            </Typography>
          </Stack>
        )}
      </Box>

      <Divider sx={{ mx: 2 }} />

      {/* Main Navigation */}
      <List sx={{ pt: 1, px: 1 }}>
        {visibleNavItems.map((item: NavigationItem) => {
          const isSelected = pathname === item.href;

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip title={item.tooltip || ""} placement="right" arrow>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  selected={isSelected}
                  onClick={handleItemClick}
                  sx={{
                    borderRadius: 1,
                    "&.Mui-selected": {
                      backgroundColor: "primary.main",
                      color: "primary.contrastText",
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                      "& .MuiListItemIcon-root": {
                        color: "primary.contrastText",
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {getIconComponent(item.iconName)}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isSelected ? 500 : 400,
                    }}
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      {/* Spacer */}
      <Box sx={{ flexGrow: 1 }} />

      <Divider sx={{ mx: 2 }} />

      {/* Logout Section */}
      <List sx={{ p: 1 }}>
        <ListItem disablePadding>
          <Tooltip title="Sign out of your account" placement="right" arrow>
            <ListItemButton
              component={Link}
              href="/auth/logout"
              onClick={handleItemClick}
              sx={{
                borderRadius: 1,
                "&:hover": {
                  backgroundColor: "error.lighter",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Logout color="error" />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{ color: "error" }}
              />
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </List>
    </>
  );
});

export default Sidebar;
