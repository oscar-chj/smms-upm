import { ApiResponse, MeritRecord } from "@/types/api.types";

interface MeritSummary {
  totalPoints: number;
  universityMerit: number;
  facultyMerit: number;
  collegeMerit: number;
  clubMerit: number;
  recentActivities: number;
  rank: number;
  totalStudents: number;
  targetPoints: number;
  progressPercentage: number;
  targetAchieved: boolean;
  remainingPoints: number;
  exceededPoints: number;
}

class MeritService {
  async getStudentMeritSummary(
    studentId?: string
  ): Promise<ApiResponse<MeritSummary>> {
    try {
      const url = new URL("/api/merits/summary", window.location.origin);
      if (studentId) {
        url.searchParams.set("studentId", studentId);
      }

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.error || "Failed to fetch merit summary",
        };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // TODO: Implement proper error handling/display
      // eslint-disable-next-line no-console
      console.error("Error fetching merit summary:", error);
      return {
        success: false,
        error: "Failed to fetch merit summary",
      };
    }
  }

  async getStudentMeritRecords(
    studentId?: string,
    options: { page?: number; limit?: number } = {}
  ): Promise<ApiResponse<{ records: MeritRecord[]; total: number }>> {
    try {
      const url = new URL("/api/merits/records", window.location.origin);
      if (studentId) {
        url.searchParams.set("studentId", studentId);
      }
      if (options.page) {
        url.searchParams.set("page", options.page.toString());
      }
      if (options.limit) {
        url.searchParams.set("limit", options.limit.toString());
      }

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.error || "Failed to fetch merit records",
        };
      }

      const data = await response.json();
      return {
        success: data.success,
        data: data.data,
      };
    } catch (error) {
      // TODO: Implement proper error handling/display
      // eslint-disable-next-line no-console
      console.error("Error fetching merit records:", error);
      return {
        success: false,
        error: "Failed to fetch merit records",
      };
    }
  }
}

const meritService = new MeritService();
export default meritService;
