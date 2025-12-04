"use client";

import { getCategoryColor, getCategoryDisplayName } from "@/lib/categoryUtils";
import { formatDate } from "@/lib/dateUtils";
import meritService from "@/services/merit/meritService";
import { EventCategory, MeritRecord } from "@/types/api.types";
import { Download, Print } from "@mui/icons-material";
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
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`merit-report-tabpanel-${index}`}
      aria-labelledby={`merit-report-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

interface MeritReportsProps {
  studentId: string;
  onDownloadReport?: () => void;
  onPrintReport?: () => void;
  targetPoints?: number;
}

export default function MeritReports({
  studentId,
  onDownloadReport,
  onPrintReport,
  targetPoints = 150,
}: MeritReportsProps) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [records, setRecords] = useState<MeritRecord[]>([]);

  useEffect(() => {
    // Fetch data from API
    const fetchRecords = async () => {
      try {
        const response = await meritService.getStudentMeritRecords(studentId, {
          limit: 1000, // Get all records for reports
        });

        if (response.success && response.data) {
          setRecords(response.data.records);
        }
      } catch (error) {
        console.error("Error fetching merit records:", error);
      }
    };

    fetchRecords();
  }, [studentId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleDownloadReport = () => {
    if (onDownloadReport) {
      onDownloadReport();
    } else {
      // Default behavior
      alert("Merit report download started (demo functionality)");
    }
  };

  const handlePrintReport = () => {
    if (onPrintReport) {
      onPrintReport();
    } else {
      // Default behavior
      window.print();
    }
  };

  const renderMeritRecords = (meritRecords: MeritRecord[]) => {
    if (meritRecords.length === 0) {
      return (
        <Alert severity="info" sx={{ mt: 2 }}>
          No merit records found for this category.
        </Alert>
      );
    }

    return (
      <List sx={{ mt: 2 }}>
        {meritRecords.map((record, index) => (
          <Box key={record.id}>
            <ListItem
              sx={{ flexDirection: "column", alignItems: "flex-start", py: 2 }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  mb: 1,
                }}
              >
                <Typography variant="h6" component="h3">
                  {record.description}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <Chip
                    label={getCategoryDisplayName(record.category)}
                    size="small"
                    color={getCategoryColor(record.category)}
                    sx={{ color: "white", fontWeight: 600 }}
                  />
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    +{record.points} pts
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  mt: 1,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Date: {formatDate(record.date)}
                </Typography>
              </Box>
            </ListItem>
            {index < meritRecords.length - 1 && <Divider />}
          </Box>
        ))}
      </List>
    );
  };

  // Calculate totals based on provided records
  const totalPoints = records.reduce((sum, record) => sum + record.points, 0);

  return (
    <Box sx={{ width: "100%" }}>
      {/* Summary Cards */}
      <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Typography variant="h6" color="primary" gutterBottom>
              Total Points Earned
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {totalPoints}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Across all categories
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Typography variant="h6" color="success.main" gutterBottom>
              Records Count
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {records.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total activities
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Progress to Target
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {Math.round((totalPoints / targetPoints) * 100)}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Target: {targetPoints} points
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={handleDownloadReport}
        >
          Download Report
        </Button>
        <Button
          variant="outlined"
          startIcon={<Print />}
          onClick={handlePrintReport}
        >
          Print Report
        </Button>
      </Box>

      {/* Merit Records by Category */}
      <Card>
        <CardContent>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              aria-label="merit report tabs"
            >
              <Tab label="All Records" />
              <Tab label="University Merit" />
              <Tab label="Faculty Merit" />
              <Tab label="College Merit" />
              <Tab label="Association Merit" />
            </Tabs>
          </Box>

          <TabPanel value={selectedTab} index={0}>
            <Typography variant="h6" gutterBottom>
              All Merit Records
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Complete history of all merit achievements ({records.length}{" "}
              records)
            </Typography>
            {renderMeritRecords(records)}
          </TabPanel>

          <TabPanel value={selectedTab} index={1}>
            <Typography variant="h6" gutterBottom>
              University Merit Records
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Points earned:{" "}
              {records
                .filter((r) => r.category === EventCategory.UNIVERSITY)
                .reduce((sum, r) => sum + r.points, 0)}{" "}
              points
            </Typography>
            {renderMeritRecords(
              records.filter((r) => r.category === EventCategory.UNIVERSITY)
            )}
          </TabPanel>

          <TabPanel value={selectedTab} index={2}>
            <Typography variant="h6" gutterBottom>
              Faculty Merit Records
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Points earned:{" "}
              {records
                .filter((r) => r.category === EventCategory.FACULTY)
                .reduce((sum, r) => sum + r.points, 0)}{" "}
              points
            </Typography>
            {renderMeritRecords(
              records.filter((r) => r.category === EventCategory.FACULTY)
            )}
          </TabPanel>

          <TabPanel value={selectedTab} index={3}>
            <Typography variant="h6" gutterBottom>
              College Merit Records
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Points earned:{" "}
              {records
                .filter((r) => r.category === EventCategory.COLLEGE)
                .reduce((sum, r) => sum + r.points, 0)}{" "}
              points
            </Typography>
            {renderMeritRecords(
              records.filter((r) => r.category === EventCategory.COLLEGE)
            )}
          </TabPanel>

          <TabPanel value={selectedTab} index={4}>
            <Typography variant="h6" gutterBottom>
              Association/Club Merit Records
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Points earned:{" "}
              {records
                .filter((r) => r.category === EventCategory.CLUB)
                .reduce((sum, r) => sum + r.points, 0)}{" "}
              points
            </Typography>
            {renderMeritRecords(
              records.filter((r) => r.category === EventCategory.CLUB)
            )}
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
}
