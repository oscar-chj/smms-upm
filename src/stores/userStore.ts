import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Student } from "@/types/api.types";
import meritService from "@/services/merit/meritService";

interface MeritSummary {
  totalPoints: number;
  targetPoints: number;
  universityMerit: number;
  facultyMerit: number;
  collegeMerit: number;
  clubMerit: number;
  recentActivities: number;
  rank: number;
  totalStudents: number;
  progressPercentage: number;
  targetAchieved: boolean;
  remainingPoints: number;
  exceededPoints: number;
}

interface UserProfileData {
  student: Student; // Includes profileImage - persisted to prevent refreshing
  meritSummary: MeritSummary;
  lastUpdated: number;
}

interface UserStore {
  // State
  profileData: UserProfileData | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadUserProfile: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  clearUserProfile: () => void;
  forceClearCache: () => Promise<void>; // Force clear cache and reload
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      // Initial state
      profileData: null,
      isLoading: false,
      error: null,

      // Load user profile (with caching)
      loadUserProfile: async () => {
        const state = get();

        // If we have recent data (less than 5 minutes old), use cached data
        if (
          state.profileData &&
          Date.now() - state.profileData.lastUpdated < 5 * 60 * 1000
        ) {
          return;
        }

        set({ isLoading: true, error: null });
        try {
          const studentResponse = await fetch("/api/students/me", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!studentResponse.ok) {
            const errorData = await studentResponse.json().catch(() => ({}));
            if (studentResponse.status === 401) {
              throw new Error(
                "No authenticated user found. Please log in again."
              );
            }
            throw new Error(
              errorData.error || "Failed to fetch student data"
            );
          }

          const studentDataResult = await studentResponse.json();
          if (!studentDataResult.success || !studentDataResult.data) {
            throw new Error(
              studentDataResult.error || "Student data not found"
            );
          }

          const studentData = studentDataResult.data as Student;
          
          // Get merit summary from API using the student ID
          const meritSummaryResponse = await meritService.getStudentMeritSummary(
            studentData.id
          );
          
          if (!meritSummaryResponse.success || !meritSummaryResponse.data) {
            throw new Error(
              meritSummaryResponse.error || "Failed to fetch merit summary"
            );
          }
          
          const meritSummary = meritSummaryResponse.data;

          set({
            profileData: {
              student: studentData,
              meritSummary,
              lastUpdated: Date.now(),
            },
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error("Error loading user profile:", error);
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "Failed to load user profile",
          });
        }
      },

      // Refresh user profile
      refreshUserProfile: async () => {
        set({ isLoading: true, error: null });
        try {
          const studentResponse = await fetch("/api/students/me", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!studentResponse.ok) {
            const errorData = await studentResponse.json().catch(() => ({}));
            if (studentResponse.status === 401) {
              throw new Error(
                "No authenticated user found. Please log in again."
              );
            }
            throw new Error(
              errorData.error || "Failed to fetch student data"
            );
          }

          const studentDataResult = await studentResponse.json();
          if (!studentDataResult.success || !studentDataResult.data) {
            throw new Error(
              studentDataResult.error || "Student data not found"
            );
          }

          const studentData = studentDataResult.data as Student;
          
          // Get merit summary from API using the student ID
          const meritSummaryResponse = await meritService.getStudentMeritSummary(
            studentData.id
          );
          
          if (!meritSummaryResponse.success || !meritSummaryResponse.data) {
            throw new Error(
              meritSummaryResponse.error || "Failed to fetch merit summary"
            );
          }
          
          const meritSummary = meritSummaryResponse.data;

          set({
            profileData: {
              student: studentData,
              meritSummary,
              lastUpdated: Date.now(),
            },
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error("Error refreshing user profile:", error);
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "Failed to refresh user profile",
          });
        }
      },
      // Clear user profile (for logout)
      clearUserProfile: () => {
        set({
          profileData: null,
          isLoading: false,
          error: null,
        });
      },

      // Force clear cache and reload fresh data (bypasses 5-minute cache)
      forceClearCache: async () => {
        // Clear current data
        set({
          profileData: null,
          isLoading: true,
          error: null,
        });
        try {
          const studentResponse = await fetch("/api/students/me", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!studentResponse.ok) {
            const errorData = await studentResponse.json().catch(() => ({}));
            if (studentResponse.status === 401) {
              throw new Error(
                "No authenticated user found. Please log in again."
              );
            }
            throw new Error(
              errorData.error || "Failed to fetch student data"
            );
          }

          const studentDataResult = await studentResponse.json();
          if (!studentDataResult.success || !studentDataResult.data) {
            throw new Error(
              studentDataResult.error || "Student data not found"
            );
          }

          const studentData = studentDataResult.data as Student;
          
          // Get merit summary from API using the student ID
          const meritSummaryResponse = await meritService.getStudentMeritSummary(
            studentData.id
          );
          
          if (!meritSummaryResponse.success || !meritSummaryResponse.data) {
            throw new Error(
              meritSummaryResponse.error || "Failed to fetch merit summary"
            );
          }
          
          const meritSummary = meritSummaryResponse.data;

          set({
            profileData: {
              student: studentData,
              meritSummary,
              lastUpdated: Date.now(),
            },
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error("Error force refreshing user profile:", error);
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "Failed to force refresh user profile",
          });
        }
      },
    }),
    {
      name: "user-profile-storage", // localStorage key
      partialize: (state: UserStore) => ({ profileData: state.profileData }), // Only persist profileData
    }
  )
);
