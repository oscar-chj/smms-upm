"use client";

import { ErrorDisplay } from "@/components/ui/ErrorDisplay";
import EventListSkeleton from "@/components/ui/skeletons/EventListSkeleton";
import { getCategoryColor, getCategoryDisplayName } from "@/lib/categoryUtils";
import { formatDate, toDateString } from "@/lib/dateUtils";
import EventListService from "@/services/event/eventListService";
import { Event, EventCategory, EventStatus } from "@/types/api.types";
import {
  AccessTime,
  Clear,
  Event as EventIcon,
  FilterList,
  LocationOn,
  Person,
  Refresh,
  Search,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index} style={{ paddingTop: "1rem" }}>
      {value === index && children}
    </div>
  );
}

interface EventCardListProps {
  events: Event[];
}

function EventCardList({ events }: EventCardListProps) {
  if (events.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <EventIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          No events found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Check other tabs for available events.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {events.map((event) => (
        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={event.id}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              border: "1px solid rgba(0, 0, 0, 0.08)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  sx={{ bgcolor: getCategoryColor(event.category), mr: 2 }}
                >
                  <EventIcon sx={{ color: "white" }} />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {event.title}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                    <Chip
                      label={getCategoryDisplayName(event.category)}
                      size="small"
                      color={getCategoryColor(event.category)}
                      sx={{ color: "white", fontWeight: 600 }}
                    />
                    <Chip
                      label={`${event.points} points`}
                      color="primary"
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {event.description}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <AccessTime
                  sx={{ fontSize: 16, mr: 1, color: "text.secondary" }}
                />
                <Typography variant="caption" color="text.secondary">
                  {formatDate(toDateString(event.date))} at {event.time}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <LocationOn
                  sx={{ fontSize: 16, mr: 1, color: "text.secondary" }}
                />
                <Typography variant="caption" color="text.secondary">
                  {event.location}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Person sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
                <Typography variant="caption" color="text.secondary">
                  Organized by {event.organizer}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {event.capacity && (
                  <Typography variant="caption" color="text.secondary">
                    {event.registeredCount}/{event.capacity} registered
                  </Typography>
                )}
              </Box>
            </CardContent>

            {event.status === EventStatus.UPCOMING && (
              <Box sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="contained"
                  fullWidth
                  disabled={event.registeredCount >= event.capacity}
                  onClick={() => {
                    // In production, this would handle event registration
                    alert(`Register for ${event.title} (demo functionality)`);
                  }}
                >
                  {event.registeredCount >= event.capacity
                    ? "Event Full"
                    : "Register"}
                </Button>
              </Box>
            )}
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

interface EventListProps {
  onRefresh?: () => void;
  showHeader?: boolean;
}

interface FilterState {
  dateFrom: string;
  dateTo: string;
  category: EventCategory | "";
  organizer: string;
}

export default function EventList({
  onRefresh,
  showHeader = true,
}: EventListProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    dateFrom: "",
    dateTo: "",
    category: "",
    organizer: "",
  });
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    dateFrom: "",
    dateTo: "",
    category: "",
    organizer: "",
  });

  const fetchEvents = async (forceRefresh = false) => {
    try {
      setIsLoading(!forceRefresh);
      setIsRefreshing(forceRefresh);
      setError(null);

      // Use EventListService to fetch events (implements UC2)
      const fetchedEvents = forceRefresh
        ? await EventListService.refreshEventList()
        : await EventListService.fetchEventList();

      setEvents(fetchedEvents);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to load events. Please try again later.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRefresh = () => {
    fetchEvents(true);
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Search function
  const searchEvents = (eventsList: Event[], searchTerm: string): Event[] => {
    if (!searchTerm.trim()) return eventsList;

    const searchLower = searchTerm.toLowerCase();
    return eventsList.filter(
      (event) =>
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.organizer.toLowerCase().includes(searchLower) ||
        event.location.toLowerCase().includes(searchLower)
    );
  };

  // Filter function
  const filterEvents = (eventsList: Event[], filters: FilterState): Event[] => {
    return eventsList.filter((event) => {
      // Date range filter
      if (filters.dateFrom) {
        const eventDate = new Date(event.date);
        const fromDate = new Date(filters.dateFrom);
        if (eventDate < fromDate) return false;
      }

      if (filters.dateTo) {
        const eventDate = new Date(event.date);
        const toDate = new Date(filters.dateTo);
        if (eventDate > toDate) return false;
      }

      // Category filter
      if (filters.category && event.category !== filters.category) {
        return false;
      }

      // Organizer filter
      if (
        filters.organizer &&
        !event.organizer.toLowerCase().includes(filters.organizer.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  };

  // Apply search and filters to events
  const processedEvents = filterEvents(
    searchEvents(events, searchTerm),
    appliedFilters
  );

  // Filter events by status
  const upcomingEvents = processedEvents.filter(
    (event) => event.status === EventStatus.UPCOMING
  );
  const ongoingEvents = processedEvents.filter(
    (event) => event.status === EventStatus.ONGOING
  );
  const completedEvents = processedEvents.filter(
    (event) => event.status === EventStatus.COMPLETED
  );

  // Handle filter dialog
  const handleFilterDialogOpen = () => {
    setFilters(appliedFilters);
    setFilterDialogOpen(true);
  };

  const handleFilterDialogClose = () => {
    setFilterDialogOpen(false);
  };

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setFilterDialogOpen(false);
  };

  const handleClearFilters = () => {
    const emptyFilters = {
      dateFrom: "",
      dateTo: "",
      category: "" as EventCategory | "",
      organizer: "",
    };
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setSearchTerm("");
    setFilterDialogOpen(false);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  // Get unique organizers for filter dropdown
  const uniqueOrganizers = Array.from(
    new Set(events.map((event) => event.organizer))
  ).sort();

  // Check if any filters are active
  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    appliedFilters.dateFrom !== "" ||
    appliedFilters.dateTo !== "" ||
    appliedFilters.category !== "" ||
    appliedFilters.organizer !== "";

  if (isLoading) {
    return <EventListSkeleton />;
  }

  if (error) {
    return <ErrorDisplay message={error} showRetry onRetry={handleRefresh} />;
  }

  return (
    <Box>
      {showHeader && (
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                Browse Events
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Explore merit-earning opportunities categorized by time status
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? "Refreshing..." : "Refresh Events"}
            </Button>
          </Box>

          {/* Search and Filter Controls */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                placeholder="Search events by name, description, organizer, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton onClick={clearSearch} size="small">
                        <Clear />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ flexGrow: 1 }}
              />
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={handleFilterDialogOpen}
                sx={{ minWidth: 120 }}
              >
                Filters
              </Button>
            </Box>

            {/* Active Filters Display */}
            <Collapse in={hasActiveFilters}>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mr: 1 }}
                >
                  Active filters:
                </Typography>
                {searchTerm && (
                  <Chip
                    label={`Search: "${searchTerm}"`}
                    onDelete={clearSearch}
                    size="small"
                    variant="outlined"
                  />
                )}
                {appliedFilters.dateFrom && (
                  <Chip
                    label={`From: ${appliedFilters.dateFrom}`}
                    onDelete={() =>
                      setAppliedFilters((prev) => ({ ...prev, dateFrom: "" }))
                    }
                    size="small"
                    variant="outlined"
                  />
                )}
                {appliedFilters.dateTo && (
                  <Chip
                    label={`To: ${appliedFilters.dateTo}`}
                    onDelete={() =>
                      setAppliedFilters((prev) => ({ ...prev, dateTo: "" }))
                    }
                    size="small"
                    variant="outlined"
                  />
                )}
                {appliedFilters.category && (
                  <Chip
                    label={`Category: ${getCategoryDisplayName(
                      appliedFilters.category
                    )}`}
                    onDelete={() =>
                      setAppliedFilters((prev) => ({ ...prev, category: "" }))
                    }
                    size="small"
                    variant="outlined"
                  />
                )}
                {appliedFilters.organizer && (
                  <Chip
                    label={`Organizer: ${appliedFilters.organizer}`}
                    onDelete={() =>
                      setAppliedFilters((prev) => ({ ...prev, organizer: "" }))
                    }
                    size="small"
                    variant="outlined"
                  />
                )}
                <Button
                  size="small"
                  onClick={handleClearFilters}
                  color="secondary"
                >
                  Clear All
                </Button>
              </Box>
            </Collapse>
          </Box>

          {/* Cache Status Indicator */}
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Events are cached for better performance. Data refreshes
              automatically every 15 minutes or when you click refresh.
            </Typography>
          </Alert>
        </Box>
      )}

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label={`Upcoming (${upcomingEvents.length})`} />
          <Tab label={`Ongoing (${ongoingEvents.length})`} />
          <Tab label={`Completed (${completedEvents.length})`} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <EventCardList events={upcomingEvents} />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <EventCardList events={ongoingEvents} />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <EventCardList events={completedEvents} />
      </TabPanel>

      {/* Filter Dialog */}
      <Dialog
        open={filterDialogOpen}
        onClose={handleFilterDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Filter Events</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
            {/* Date Range */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Date Range
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  type="date"
                  label="From Date"
                  value={filters.dateFrom}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      dateFrom: e.target.value,
                    }))
                  }
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <TextField
                  type="date"
                  label="To Date"
                  value={filters.dateTo}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, dateTo: e.target.value }))
                  }
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Box>
            </Box>

            {/* Category */}
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                label="Category"
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    category: e.target.value as EventCategory | "",
                  }))
                }
              >
                <MenuItem value="">
                  <em>All Categories</em>
                </MenuItem>
                {Object.values(EventCategory).map((category) => (
                  <MenuItem key={category} value={category}>
                    {getCategoryDisplayName(category)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Organizer */}
            <FormControl fullWidth>
              <InputLabel>Organizer</InputLabel>
              <Select
                value={filters.organizer}
                label="Organizer"
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, organizer: e.target.value }))
                }
              >
                <MenuItem value="">
                  <em>All Organizers</em>
                </MenuItem>
                {uniqueOrganizers.map((organizer) => (
                  <MenuItem key={organizer} value={organizer}>
                    {organizer}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClearFilters} color="secondary">
            Clear All
          </Button>
          <Button onClick={handleFilterDialogClose}>Cancel</Button>
          <Button onClick={handleApplyFilters} variant="contained">
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
