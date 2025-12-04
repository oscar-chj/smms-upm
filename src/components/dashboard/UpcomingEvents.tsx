"use client";

import { getCategoryColor } from "@/lib/categoryUtils";
import { formatDate as formatEventDate, toDateString } from "@/lib/dateUtils";
import { Event } from "@/types/api.types";
import {
  ArrowForward,
  EventBusy,
  Event as EventIcon,
  LocationOn,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { memo } from "react";

/**
 * Props for the UpcomingEvents component
 */
interface UpcomingEventsProps {
  events: Event[];
}

/**
 * Component that displays a list of upcoming events
 */
const UpcomingEvents = memo(function UpcomingEvents({
  events,
}: UpcomingEventsProps) {
  // Handle empty state
  if (!events || events.length === 0) {
    return (
      <Card
        elevation={0}
        sx={{ borderRadius: 2, border: "1px solid rgba(0, 0, 0, 0.05)" }}
      >
        <CardContent sx={{ textAlign: "center", py: 4 }}>
          <EventBusy
            sx={{ fontSize: 48, color: "text.secondary", mb: 2, opacity: 0.5 }}
          />
          <Typography variant="h6" gutterBottom>
            No Upcoming Events
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Check back later for new events or browse all available events.
          </Typography>
          <Button
            component={Link}
            href="/dashboard/events"
            variant="outlined"
            endIcon={<ArrowForward />}
          >
            Browse Events
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      elevation={0}
      sx={{ borderRadius: 2, border: "1px solid rgba(0, 0, 0, 0.05)" }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">Upcoming Events</Typography>
          <Button
            component={Link}
            href="/dashboard/events"
            endIcon={<ArrowForward fontSize="small" />}
            size="small"
          >
            View All
          </Button>
        </Box>

        <List disablePadding>
          {events.map((event, index) => (
            <Box key={event.id}>
              <ListItem
                alignItems="flex-start"
                component={Link}
                href={`/dashboard/events/${event.id}`}
                sx={{
                  textDecoration: "none",
                  color: "inherit",
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: "action.hover",
                    borderRadius: 1,
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: `${getCategoryColor(event.category)}.light`,
                    }}
                  >
                    <EventIcon />
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {event.title}
                    </Typography>
                  }
                  secondary={
                    <Box component="span" sx={{ display: "block" }}>
                      {/* Event Date & Location */}
                      <Stack alignItems="left" sx={{ my: 0.5 }}>
                        {/* Event Date */}
                        <Stack direction="row" alignItems="center">
                          <EventIcon sx={{ fontSize: 14, mr: 0.5 }} />
                          <Typography variant="caption">
                            {formatEventDate(toDateString(event.date))}
                          </Typography>
                        </Stack>

                        {/* Event Location */}
                        <Stack direction="row" alignItems="center">
                          <LocationOn sx={{ fontSize: 14, mr: 0.5 }} />
                          <Typography variant="caption">
                            {event.location}
                          </Typography>
                        </Stack>
                      </Stack>

                      {/* Event Merit Points & Registration Count */}
                      <Stack direction="row" alignItems="center" gap={1}>
                        {/* Event Merit Points */}
                        <Chip
                          label={`${event.points} points`}
                          color={getCategoryColor(event.category)}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: "0.7rem" }}
                        />

                        {/* Event Registration Count */}
                        {event.capacity &&
                          event.registeredCount !== undefined && (
                            <Typography
                              variant="caption"
                              sx={{
                                color:
                                  event.registeredCount >= event.capacity
                                    ? "error.main"
                                    : event.registeredCount >=
                                      event.capacity * 0.8
                                    ? "warning.main"
                                    : "success.main",
                              }}
                            >
                              {event.registeredCount}/{event.capacity}{" "}
                              registered
                            </Typography>
                          )}
                      </Stack>
                    </Box>
                  }
                />
              </ListItem>
              {index < events.length - 1 && <Divider variant="inset" />}
            </Box>
          ))}
        </List>
      </CardContent>
    </Card>
  );
});

export default UpcomingEvents;
