import { Box, Divider, List, ListItem, Skeleton, Stack } from "@mui/material";

interface SidebarSkeletonProps {
  collapsed?: boolean;
}

export default function SidebarSkeleton({
  collapsed = false,
}: SidebarSkeletonProps) {
  return (
    <>
      {/* Collapse Button Spacer */}
      {!collapsed && <Box sx={{ height: 40 }} />}

      {/* User Profile Section */}
      <Box sx={{ p: 2, pt: collapsed ? 2 : 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 2,
          }}
        >
          {/* Avatar */}
          <Skeleton
            variant="circular"
            width={collapsed ? 40 : 80}
            height={collapsed ? 40 : 80}
            sx={{ mb: collapsed ? 1 : 1.5 }}
          />
          {/* Name and Role - only show when not collapsed */}
          {!collapsed && (
            <>
              <Skeleton
                variant="text"
                width={140}
                height={28}
                sx={{ mb: 0.5 }}
              />
              <Skeleton variant="text" width={80} height={20} />
            </>
          )}
        </Box>

        {/* Student Information Card - only show when not collapsed */}
        {!collapsed && (
          <Stack
            spacing={0.5}
            sx={{
              p: 1.5,
              bgcolor: "background.default",
              borderRadius: 2,
              mb: 3,
            }}
          >
            <Skeleton variant="text" width="80%" height={16} />
            <Skeleton variant="text" width="90%" height={16} />
            <Skeleton variant="text" width="60%" height={16} />
          </Stack>
        )}
      </Box>

      <Divider sx={{ mx: 2 }} />

      {/* Navigation Items */}
      <List sx={{ pt: 1, px: 1 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <ListItem key={i} disablePadding sx={{ mb: 0.5 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: collapsed ? "center" : "flex-start",
                width: "100%",
                p: 1,
                px: collapsed ? 0 : 1,
                gap: collapsed ? 0 : 2,
              }}
            >
              <Skeleton variant="circular" width={24} height={24} />
              {!collapsed && (
                <Skeleton variant="text" width="70%" height={24} />
              )}
            </Box>
          </ListItem>
        ))}
      </List>

      {/* Spacer */}
      <Box sx={{ flexGrow: 1 }} />

      <Divider sx={{ mx: 2 }} />

      {/* Logout Section */}
      <List sx={{ p: 1 }}>
        <ListItem disablePadding>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              width: "100%",
              p: 1,
              px: collapsed ? 0 : 1,
              gap: collapsed ? 0 : 2,
            }}
          >
            <Skeleton variant="circular" width={24} height={24} />
            {!collapsed && <Skeleton variant="text" width={60} height={24} />}
          </Box>
        </ListItem>
      </List>
    </>
  );
}
