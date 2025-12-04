"use client";

import { getCategoryColor, getCategoryDisplayName } from "@/lib/categoryUtils";
import eventService from "@/services/event/eventService";
import { Event, EventRegistration, Student } from "@/types/api.types";
import {
  ArrowBack,
  Check,
  CheckCircle,
  Error,
  Event as EventIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ParticipantMeritEntry {
  studentId: string;
  studentName: string;
  points: number;
  meritType: string;
  role: "Participant" | "Organizer";
  isValid: boolean;
  status: "valid" | "invalid";
  errors?: string[];
  errorMessage?: string;
}

interface MeritWeightage {
  participantPoints: number;
  organizerPoints: number;
  meritType: string;
  maxPointsThreshold: number;
}

interface AdminMeritUploadProps {
  eventId?: string;
  onComplete?: (uploadData: {
    validEntries: ParticipantMeritEntry[];
    event: Event;
  }) => void;
}

const steps = [
  "Select Event",
  "Set Weightages",
  "Review Participants",
  "Submit",
];

export default function AdminMeritUpload({
  eventId,
  onComplete,
}: AdminMeritUploadProps) {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [participantData, setParticipantData] = useState<
    ParticipantMeritEntry[]
  >([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [completedEvents, setCompletedEvents] = useState<Event[]>([]);
  const [meritWeightage, setMeritWeightage] = useState<MeritWeightage>({
    participantPoints: 5,
    organizerPoints: 8,
    meritType: "University",
    maxPointsThreshold: 20,
  });

  useEffect(() => {
    // Fetch completed events from API
    const fetchCompletedEvents = async () => {
      try {
        const response = await eventService.getEvents(
          { page: 1, limit: 1000 }, // Get all events
          { status: "Completed" }
        );

        if (response.success && response.data) {
          setCompletedEvents(response.data);
        }
      } catch (error) {
        console.error("Error fetching completed events:", error);
      }
    };

    fetchCompletedEvents();

    // Initialize selected event if eventId is provided
    if (eventId) {
      const fetchEvent = async () => {
        try {
          const response = await eventService.getEventById(eventId);
          if (response.success && response.data) {
            setSelectedEvent(response.data);
            setActiveStep(1); // Skip event selection if eventId is provided
            updateMeritWeightageForEvent(response.data);
          }
        } catch (error) {
          console.error("Error fetching event:", error);
        }
      };

      fetchEvent();
    }
  }, [eventId]);

  // Update merit weightage based on event category
  const updateMeritWeightageForEvent = (event: Event) => {
    let eventMeritType = "University";
    let defaultParticipantPoints = 5;
    let defaultOrganizerPoints = 8;
    let maxThreshold = 20;

    switch (event.category) {
      case "University":
        eventMeritType = "University";
        defaultParticipantPoints = 8;
        defaultOrganizerPoints = 12;
        maxThreshold = 25;
        break;
      case "Faculty":
        eventMeritType = "Faculty";
        defaultParticipantPoints = 6;
        defaultOrganizerPoints = 10;
        maxThreshold = 20;
        break;
      case "College":
        eventMeritType = "College";
        defaultParticipantPoints = 4;
        defaultOrganizerPoints = 7;
        maxThreshold = 15;
        break;
      case "Club":
        eventMeritType = "Club";
        defaultParticipantPoints = 3;
        defaultOrganizerPoints = 5;
        maxThreshold = 10;
        break;
    }

    setMeritWeightage({
      participantPoints: defaultParticipantPoints,
      organizerPoints: defaultOrganizerPoints,
      meritType: eventMeritType,
      maxPointsThreshold: maxThreshold,
    });
  };

  // Get participants for the selected event
  const getEventParticipants = async (): Promise<ParticipantMeritEntry[]> => {
    if (!selectedEvent) return [];

    try {
      // Get registrations for this event
      const registrationsResponse = await eventService.getEventRegistrations(
        selectedEvent.id,
        { page: 1, limit: 1000 } // Get all registrations
      );

      if (!registrationsResponse.success || !registrationsResponse.data) {
        return [];
      }

      // Filter for attended registrations
      const attendedRegistrations = registrationsResponse.data.filter(
        (reg) => reg.status === "Attended"
      );

      // Fetch student data for each registration
      const participants: ParticipantMeritEntry[] = [];

      for (const registration of attendedRegistrations) {
        try {
          // Get student data from API using internal user ID
          const studentResponse = await fetch(
            `/api/students/by-id/${registration.studentId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (studentResponse.ok) {
            const studentData = await studentResponse.json();
            if (studentData.success && studentData.data) {
              const student = studentData.data as Student;
              participants.push({
                studentId: student.studentId || student.id, // Use university studentId or fallback to internal ID
                studentName: student.name,
                points: meritWeightage.participantPoints,
                meritType: meritWeightage.meritType,
                role: "Participant",
                isValid: true,
                status: "valid",
              });
            }
          } else {
            // If student not found, still add entry but mark as invalid
            participants.push({
              studentId: registration.studentId,
              studentName: "Unknown",
              points: meritWeightage.participantPoints,
              meritType: meritWeightage.meritType,
              role: "Participant",
              isValid: false,
              status: "invalid",
              errors: ["Student not found"],
            });
          }
        } catch (error) {
          console.error("Error fetching student data:", error);
          // Add entry with error
          participants.push({
            studentId: registration.studentId,
            studentName: "Unknown",
            points: meritWeightage.participantPoints,
            meritType: meritWeightage.meritType,
            role: "Participant",
            isValid: false,
            status: "invalid",
            errors: ["Failed to fetch student data"],
          });
        }
      }

      return validateParticipantEntries(participants);
    } catch (error) {
      console.error("Error fetching event participants:", error);
      return [];
    }
  };

  // Validate participant entries
  const validateParticipantEntries = (
    entries: Omit<
      ParticipantMeritEntry,
      "isValid" | "status" | "errors" | "errorMessage"
    >[]
  ): ParticipantMeritEntry[] => {
    const validatedEntries: ParticipantMeritEntry[] = [];
    const seenStudentIds = new Set<string>();

    entries.forEach((entry) => {
      const errors: string[] = [];
      let isValid = true;

      // Note: Student existence is already checked when fetching from API
      // If studentName is "Unknown", it means student wasn't found

      // Check for duplicate entries
      if (seenStudentIds.has(entry.studentId)) {
        errors.push("Duplicate entry for student");
        isValid = false;
      } else {
        seenStudentIds.add(entry.studentId);
      }

      // Validate points against threshold
      if (entry.points > meritWeightage.maxPointsThreshold) {
        errors.push(
          `Points exceed maximum threshold (${meritWeightage.maxPointsThreshold})`
        );
        isValid = false;
      }

      // Validate points are positive
      if (entry.points <= 0) {
        errors.push("Points must be positive");
        isValid = false;
      }

      // If entry already has errors (from API fetch), preserve them
      const existingErrors = (entry as any).errors || [];
      const allErrors = [...existingErrors, ...errors];

      validatedEntries.push({
        ...entry,
        isValid: isValid && allErrors.length === 0,
        status: isValid && allErrors.length === 0 ? "valid" : "invalid",
        errors: allErrors.length > 0 ? allErrors : undefined,
        errorMessage: allErrors.length > 0 ? allErrors[0] : undefined,
      });
    });

    return validatedEntries;
  };

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    updateMeritWeightageForEvent(event);
    setActiveStep(1);
  };

  const handleWeightageNext = async () => {
    setIsProcessing(true);
    try {
      // Generate participant data based on event registrations
      const participants = await getEventParticipants();
      setParticipantData(participants);
      setActiveStep(2);
    } catch (error) {
      console.error("Error loading participants:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRoleChange = (
    index: number,
    newRole: "Participant" | "Organizer"
  ) => {
    const updatedData = [...participantData];
    updatedData[index] = {
      ...updatedData[index],
      role: newRole,
      points:
        newRole === "Participant"
          ? meritWeightage.participantPoints
          : meritWeightage.organizerPoints,
    };

    // Re-validate the updated entry
    const revalidated = validateParticipantEntries(updatedData);
    setParticipantData(revalidated);
  };

  const handleSubmitMerit = () => {
    setIsProcessing(true);
    // Simulate submission
    setTimeout(() => {
      setIsProcessing(false);
      setActiveStep(3);

      // Call completion handler if provided
      if (onComplete && selectedEvent) {
        onComplete({
          validEntries: validEntries,
          event: selectedEvent,
        });
      }
    }, 1500);
  };

  const validEntries = participantData.filter(
    (entry) => entry.status === "valid"
  );
  const invalidEntries = participantData.filter(
    (entry) => entry.status === "invalid"
  );
  const getStatusColor = (status: string): "success" | "error" | "default" => {
    switch (status) {
      case "valid":
        return "success";
      case "invalid":
        return "error";
      default:
        return "default";
    }
  };
  const getMeritTypeColor = (meritType: string) => {
    switch (meritType) {
      case "University":
        return "error"; // Red for university merit (consistent with categoryUtils)
      case "Faculty":
        return "primary"; // Blue for faculty merit
      case "College":
        return "success"; // Green for college merit
      case "Club":
        return "warning"; // Orange for club merit
      default:
        return "default"; // Default gray
    }
  };
  const renderEventStep = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select a Completed Event for Merit Upload
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Choose from the list of completed events to upload merit points for
        participants.
      </Typography>

      {completedEvents.length === 0 ? (
        <Alert severity="info">
          No completed events available for merit upload.
        </Alert>
      ) : (
        <Box sx={{ mb: 3 }}>
          {completedEvents.map((event) => (
            <Card
              key={event.id}
              variant="outlined"
              sx={{
                mb: 2,
                cursor: "pointer",
                border: selectedEvent?.id === event.id ? 2 : 1,
                borderColor:
                  selectedEvent?.id === event.id ? "primary.main" : "divider",
                "&:hover": {
                  borderColor: "primary.main",
                  boxShadow: 1,
                },
              }}
              onClick={() => setSelectedEvent(event)}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {selectedEvent?.id === event.id ? (
                      <CheckCircle color="primary" />
                    ) : (
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          border: "2px solid",
                          borderColor: "action.disabled",
                        }}
                      />
                    )}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                      }}
                    >
                      <Typography variant="h6">{event.title}</Typography>{" "}
                      <Chip
                        label={getCategoryDisplayName(event.category)}
                        size="small"
                        color={getCategoryColor(event.category)}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {event.description}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        <EventIcon
                          fontSize="small"
                          sx={{ mr: 0.5, verticalAlign: "middle" }}
                        />
                        {event.date} • {event.location}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Max Points: {event.points}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Participants: {event.registeredCount}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Button
        variant="contained"
        onClick={() => handleEventSelect(selectedEvent!)}
        size="large"
        disabled={!selectedEvent}
      >
        Proceed to Set Weightages
      </Button>
    </Box>
  );

  const renderWeightageStep = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Set Merit Point Weightages
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Configure the merit points for different roles in the selected event
      </Typography>

      {selectedEvent && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <EventIcon color="primary" />
              <Box>
                <Typography variant="h6">{selectedEvent.title}</Typography>
                <Chip
                  label={getCategoryDisplayName(selectedEvent.category)}
                  size="small"
                  color={getCategoryColor(selectedEvent.category)}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Merit Configuration
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Typography variant="body2">Merit Type:</Typography>
              <Chip
                label={meritWeightage.meritType}
                size="small"
                color={getMeritTypeColor(meritWeightage.meritType)}
                sx={{
                  fontWeight: 500,
                }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Based on event category: {selectedEvent?.category}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            <TextField
              label="Participant Points"
              type="number"
              value={meritWeightage.participantPoints}
              onChange={(e) =>
                setMeritWeightage({
                  ...meritWeightage,
                  participantPoints: parseInt(e.target.value) || 0,
                })
              }
              inputProps={{ min: 1, max: meritWeightage.maxPointsThreshold }}
              sx={{ minWidth: 200 }}
            />

            <TextField
              label="Organizer Points"
              type="number"
              value={meritWeightage.organizerPoints}
              onChange={(e) =>
                setMeritWeightage({
                  ...meritWeightage,
                  organizerPoints: parseInt(e.target.value) || 0,
                })
              }
              inputProps={{ min: 1, max: meritWeightage.maxPointsThreshold }}
              sx={{ minWidth: 200 }}
            />

            <TextField
              label="Max Points Threshold"
              type="number"
              value={meritWeightage.maxPointsThreshold}
              onChange={(e) =>
                setMeritWeightage({
                  ...meritWeightage,
                  maxPointsThreshold: parseInt(e.target.value) || 1,
                })
              }
              inputProps={{ min: 1 }}
              sx={{ minWidth: 200 }}
            />
          </Box>
          <Alert severity="info">
            Participants will receive {meritWeightage.participantPoints} points,
            while organizers will receive {meritWeightage.organizerPoints}{" "}
            points. Maximum threshold is set to{" "}
            {meritWeightage.maxPointsThreshold} points.
          </Alert>
        </Box>

        <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
          <Button startIcon={<ArrowBack />} onClick={() => setActiveStep(0)}>
            Back to Event Selection
          </Button>
          <Button
            variant="contained"
            onClick={handleWeightageNext}
            disabled={isProcessing}
          >
            {isProcessing
              ? "Loading Participants..."
              : "Next: Review Participants"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
  const renderParticipantReviewStep = () => (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => setActiveStep(1)}
          sx={{ mr: 2 }}
        >
          Back to Weightages
        </Button>
        <Typography variant="h6">Review Participants & Assign Roles</Typography>
      </Box>

      {selectedEvent && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Reviewing participants for: <strong>{selectedEvent.title}</strong>
        </Alert>
      )}

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Chip
          label={`${validEntries.length} Valid Entries`}
          color="success"
          icon={<Check />}
        />
        <Chip
          label={`${invalidEntries.length} Invalid Entries`}
          color="error"
          icon={<Error />}
        />
      </Box>

      {invalidEntries.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {invalidEntries.length} entries have validation errors. Only valid
          entries will be processed.
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student ID</TableCell>
              <TableCell>Student Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Merit Type</TableCell>
              <TableCell>Points</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {participantData.map((entry, index) => {
              return (
                <TableRow key={`${entry.studentId}-${index}`}>
                  <TableCell>{entry.studentId}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {entry.studentName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={entry.role}
                        onChange={(e) =>
                          handleRoleChange(
                            index,
                            e.target.value as "Participant" | "Organizer"
                          )
                        }
                        disabled={!entry.isValid}
                      >
                        <MenuItem value="Participant">Participant</MenuItem>
                        <MenuItem value="Organizer">Organizer</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    {" "}
                    <Chip
                      label={entry.meritType}
                      size="small"
                      color={getMeritTypeColor(entry.meritType)}
                      sx={{
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={entry.points}
                      size="small"
                      color={entry.isValid ? "primary" : "default"}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={entry.status}
                      size="small"
                      color={getStatusColor(entry.status)}
                    />
                  </TableCell>
                  <TableCell>
                    {!entry.isValid && entry.errors && (
                      <Box>
                        {entry.errors.map(
                          (error: string, errorIndex: number) => (
                            <Typography
                              key={errorIndex}
                              variant="caption"
                              color="error"
                              sx={{ display: "block" }}
                            >
                              • {error}
                            </Typography>
                          )
                        )}
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button
          variant="outlined"
          onClick={() => {
            setParticipantData([]);
            setActiveStep(1);
          }}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmitMerit}
          disabled={validEntries.length === 0 || isProcessing}
        >
          {isProcessing
            ? "Submitting..."
            : `Submit Merit for ${validEntries.length} Participants`}
        </Button>
      </Box>
    </Box>
  );

  const renderCompletionStep = () => (
    <Box sx={{ textAlign: "center" }}>
      <Check
        sx={{
          fontSize: 80,
          color: "success.main",
          mb: 2,
        }}
      />
      <Typography variant="h5" gutterBottom>
        Merit Upload Complete!
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Successfully processed {validEntries.length} merit entries for{" "}
        <strong>{selectedEvent?.title}</strong>
      </Typography>
      <Box
        sx={{
          mt: 3,
          p: 3,
          backgroundColor: "grey.50",
          borderRadius: 2,
          maxWidth: 600,
          mx: "auto",
        }}
      >
        <Typography
          variant="body1"
          gutterBottom
          sx={{ textAlign: "center", fontWeight: 600, mb: 2 }}
        >
          Upload Summary:
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography variant="body2">
            Total Participants:{" "}
            <strong>
              {validEntries.filter((e) => e.role === "Participant").length}
            </strong>
          </Typography>
          <Typography variant="body2">
            Total Organizers:{" "}
            <strong>
              {validEntries.filter((e) => e.role === "Organizer").length}
            </strong>
          </Typography>
          <Typography variant="body2">
            Total points awarded:{" "}
            <strong>
              {validEntries.reduce((sum, entry) => sum + entry.points, 0)}
            </strong>
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2">Merit Type:</Typography>
            <Chip
              label={meritWeightage.meritType}
              size="small"
              color={getMeritTypeColor(meritWeightage.meritType)}
              sx={{ fontWeight: 500 }}
            />
          </Box>

          <Typography variant="body2">
            Event: <strong>{selectedEvent?.title}</strong>
          </Typography>
          <Typography variant="body2">
            Date: <strong>{selectedEvent?.date}</strong>
          </Typography>
        </Box>
      </Box>      <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "center" }}>
        <Button 
          variant="contained" 
          onClick={() => router.push("/dashboard")}
        >
          Back to Dashboard
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setActiveStep(0);
            setSelectedEvent(null);
            setParticipantData([]);
          }}
        >
          Upload Merit for Another Event
        </Button>
      </Box>
    </Box>
  );

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderEventStep();
      case 1:
        return renderWeightageStep();
      case 2:
        return renderParticipantReviewStep();
      case 3:
        return renderCompletionStep();
      default:
        return renderEventStep();
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Admin Feature:</strong> This component allows merit
          administrators to assign merit points to event participants with
          role-based weightages instead of CSV uploads.
        </Typography>
      </Alert>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {isProcessing && <LinearProgress sx={{ mb: 3 }} />}

          {getStepContent(activeStep)}
        </CardContent>
      </Card>
    </Box>
  );
}
