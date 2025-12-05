"use client";

import { getCategoryColor, getCategoryDisplayName } from "@/lib/categoryUtils";
import { formatDate, toDateString } from "@/lib/dateUtils";
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
  FormControl,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Paper,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";

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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
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
        // TODO: Implement proper error handling/display
        // eslint-disable-next-line no-console
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

    // Mobile list view
    if (isMobile) {
      return (
        <Paper sx={{ mt: 2 }}>
          <List sx={{ p: 0 }}>
            {meritRecords.map((record, index) => (
              <React.Fragment key={record.id}>
                <ListItem
                  sx={{
                    py: 2,
                    px: 2,
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 2,
                    }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        gutterBottom
                        sx={{
                          wordBreak: "break-word",
                          overflowWrap: "break-word",
                        }}
                      >
                        {record.description}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          flexWrap: "wrap",
                          alignItems: "center",
                        }}
                      >
                        <Chip
                          label={getCategoryDisplayName(record.category)}
                          size="small"
                          color={getCategoryColor(record.category)}
                          sx={{ color: "white", fontWeight: 600, height: 20 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(toDateString(record.date))}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      variant="h6"
                      color="primary"
                      fontWeight="bold"
                      sx={{ ml: 2, flexShrink: 0 }}
                    >
                      +{record.points}
                    </Typography>
                  </Box>
                </ListItem>
                {index < meritRecords.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      );
    }

    // Desktop table view
    return (
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {meritRecords.map((record) => (
              <TableRow
                key={record.id}
                sx={{
                  "&:nth-of-type(odd)": { backgroundColor: "action.hover" },
                }}
              >
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {record.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getCategoryDisplayName(record.category)}
                    size="small"
                    color={getCategoryColor(record.category)}
                    sx={{ color: "white", fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(toDateString(record.date))}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    +{record.points}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
      <Paper>
        {isMobile ? (
          <Box sx={{ p: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedTab}
                label="Category"
                onChange={(e) => setSelectedTab(e.target.value as number)}
              >
                <MenuItem value={0}>All Records</MenuItem>
                <MenuItem value={1}>University Merit</MenuItem>
                <MenuItem value={2}>Faculty Merit</MenuItem>
                <MenuItem value={3}>College Merit</MenuItem>
                <MenuItem value={4}>Association Merit</MenuItem>
              </Select>
            </FormControl>
          </Box>
        ) : (
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="All Records" />
            <Tab label="University Merit" />
            <Tab label="Faculty Merit" />
            <Tab label="College Merit" />
            <Tab label="Association Merit" />
          </Tabs>
        )}

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
      </Paper>
    </Box>
  );
}
