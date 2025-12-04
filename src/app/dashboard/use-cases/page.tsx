"use client";

import EventListService from "@/services/event/eventListService";
import {
  Assessment,
  CheckCircle,
  Error,
  EventNote,
  Info,
  Leaderboard,
  Login,
  Report,
  Upload,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UseCase {
  id: string;
  title: string;
  description: string;
  status: "implemented" | "partial" | "demo";
  route?: string;
  icon: React.ReactNode;
  features: string[];
}

const useCases: UseCase[] = [
  {
    id: "UC1",
    title: "Login",
    description:
      "Students and merit admins securely access the system by entering their ID and password. After successful login, the system fetches the latest event list.",
    status: "implemented",
    route: "/auth/login",
    icon: <Login />,
    features: [
      "Secure authentication with email/student ID",
      "Password validation",
      "Automatic event list fetching post-login",
      "Session management with cookies",
      "Error handling for failed logins",
    ],
  },
  {
    id: "UC2",
    title: "Provide Event List",
    description:
      "System fetches and caches the most up-to-date list of merit-related events. Events are cached for 15 minutes for optimal performance.",
    status: "implemented",
    route: "/dashboard/events",
    icon: <EventNote />,
    features: [
      "15-minute cache mechanism",
      "Automatic refresh when cache expires",
      "Manual refresh functionality",
      "Error handling with fallback to stale cache",
      "Cache status indicators",
    ],
  },
  {
    id: "UC3",
    title: "Update Merit",
    description:
      "Admins assign or modify merit points for students based on event participation by uploading CSV files with student data and merit values.",
    status: "implemented",
    route: "/dashboard/admin/merit-upload",
    icon: <Upload />,
    features: [
      "CSV file upload with validation",
      "Step-by-step upload process",
      "Data validation and error reporting",
      "Preview before submission",
      "Bulk merit assignment",
    ],
  },
  {
    id: "UC4",
    title: "Check Merit",
    description:
      "Users view a summary of their current merit points across all categories with progress indicators and target tracking.",
    status: "implemented",
    route: "/dashboard/merits",
    icon: <Assessment />,
    features: [
      "Merit summary by category",
      "Progress tracking towards targets",
      "Circular progress indicators",
      "Rank and position display",
      "Quick navigation to detailed reports",
    ],
  },
  {
    id: "UC5",
    title: "Browse Events",
    description:
      "Users explore a categorized list of all events (past, ongoing, and upcoming) with detailed information and registration status.",
    status: "implemented",
    route: "/dashboard/events",
    icon: <EventNote />,
    features: [
      "Tabbed interface by event status",
      "Event filtering by category",
      "Detailed event information cards",
      "Registration status tracking",
      "Merit points display per event",
    ],
  },
  {
    id: "UC6",
    title: "View Merit Report",
    description:
      "Users view detailed breakdown of merit points across categories and activities with download and print capabilities.",
    status: "implemented",
    route: "/dashboard/reports",
    icon: <Report />,
    features: [
      "Detailed merit records by category",
      "PDF download functionality (demo)",
      "Print report capability",
      "Certificate viewing links",
    ],
  },
  {
    id: "UC7",
    title: "View Merit Leaderboard",
    description:
      "Users view ranked list of students based on total merit points with sorting options by different categories.",
    status: "implemented",
    route: "/dashboard/leaderboard",
    icon: <Leaderboard />,
    features: [
      "Top 3 podium display",
      "Sortable leaderboard by category",
      "Student ranking and statistics",
      "Current user highlighting",
      "Multiple sorting criteria",
    ],
  },
];

function getStatusColor(status: string): "success" | "warning" | "info" {
  switch (status) {
    case "implemented":
      return "success";
    case "partial":
      return "warning";
    case "demo":
      return "info";
    default:
      return "info";
  }
}

function getStatusIcon(status: string): React.ReactElement {
  switch (status) {
    case "implemented":
      return <CheckCircle color="success" />;
    case "partial":
      return <Error color="warning" />;
    case "demo":
      return <Info color="info" />;
    default:
      return <Info color="info" />;
  }
}

export default function UseCasesOverviewPage() {
  const router = useRouter();
  const [cacheStatus, setCacheStatus] = useState<{
    isCached: boolean;
    isValid: boolean;
    cacheAge: number;
    nextRefresh: number;
  } | null>(null);

  useEffect(() => {
    // Get cache status for demonstration
    const status = EventListService.getCacheStatus();
    setCacheStatus(status);
  }, []);

  const handleNavigate = (route?: string) => {
    if (route) {
      router.push(route);
    }
  };

  const implementedCount = useCases.filter(
    (uc) => uc.status === "implemented"
  ).length;

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Student Merit Management System
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Use Cases Implementation Overview
        </Typography>
        <Alert severity="success" sx={{ mt: 2 }}>
          <Typography variant="body1">
            <strong>Implementation Complete!</strong> All {implementedCount}
            use cases have been implemented with core logic and sample data.
          </Typography>
        </Alert>
      </Box>

      {/* System Status */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            System Status
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 2,
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h3" color="primary" fontWeight="bold">
                {implementedCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Use Cases Implemented
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h3" color="success.main" fontWeight="bold">
                4
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Merit Categories
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h3" color="warning.main" fontWeight="bold">
                150
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Target Merit Points
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h3" color="info.main" fontWeight="bold">
                {cacheStatus?.isValid ? "✓" : "✗"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Event Cache Status
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Merit Categories */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Merit Categories
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Chip
              label="International/National/University Merit"
              color="primary"
            />
            <Chip label="Faculty Merit" color="secondary" />
            <Chip label="College Merit" color="info" />
            <Chip label="Association/Club Merit" color="warning" />
          </Box>
        </CardContent>
      </Card>

      {/* Use Cases Grid */}
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
        Implemented Use Cases
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: 3,
        }}
      >
        {useCases.map((useCase) => (
          <Card
            key={useCase.id}
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box sx={{ mr: 2 }}>{useCase.icon}</Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3">
                    {useCase.id}: {useCase.title}
                  </Typography>
                  <Chip
                    label={useCase.status}
                    color={getStatusColor(useCase.status)}
                    size="small"
                    icon={getStatusIcon(useCase.status)}
                  />
                </Box>
              </Box>

              <Typography variant="body2" color="text.secondary" paragraph>
                {useCase.description}
              </Typography>

              <Typography variant="subtitle2" gutterBottom>
                Key Features:
              </Typography>
              <List dense>
                {useCase.features.map((feature, index) => (
                  <ListItem key={index} sx={{ py: 0 }}>
                    <ListItemIcon sx={{ minWidth: 24 }}>
                      <CheckCircle fontSize="small" color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary={feature}
                      primaryTypographyProps={{ variant: "body2" }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>

            <Divider />

            <Box sx={{ p: 2 }}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleNavigate(useCase.route)}
                disabled={!useCase.route}
              >
                {useCase.route ? "View Implementation" : "Not Available"}
              </Button>
            </Box>
          </Card>
        ))}
      </Box>

      {/* Technical Notes */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Technical Implementation Notes
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Info color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Sample Data"
                secondary="All implementations use realistic sample data for demonstration purposes. In production, these would connect to actual APIs and databases."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Info color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Caching System"
                secondary="Event list caching is implemented with 15-minute expiry and fallback mechanisms for offline scenarios."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Info color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Error Handling"
                secondary="Comprehensive error handling with user-friendly messages and retry mechanisms throughout the application."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Info color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Responsive Design"
                secondary="All pages are built with responsive design principles and work across desktop, tablet, and mobile devices."
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}
