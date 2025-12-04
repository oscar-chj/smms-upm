"use client";

import { Student } from "@/types/api.types";
import { MeritSummary } from "@/types/merit.types";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface UseUserProfileReturn {
  student: Student | null;
  meritSummary: MeritSummary | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Hook to fetch and manage user profile data
 * Fetches student data and merit summary from API
 */
export function useUserProfile(): UseUserProfileReturn {
  const { data: session, status } = useSession();
  const [student, setStudent] = useState<Student | null>(null);
  const [meritSummary, setMeritSummary] = useState<MeritSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    if (!session?.user?.email) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch student data
      const studentResponse = await fetch("/api/students/me");

      if (!studentResponse.ok) {
        throw new Error("Failed to fetch student data");
      }
      const studentData = await studentResponse.json();

      if (studentData.success && studentData.data) {
        setStudent(studentData.data);

        // Fetch merit summary
        const meritResponse = await fetch(
          `/api/merits/summary?studentId=${studentData.data.id}`
        );
        if (meritResponse.ok) {
          const meritData = await meritResponse.json();
          if (meritData.success && meritData.data) {
            setMeritSummary(meritData.data);
          }
        }
      } else {
        throw new Error(studentData.error || "Failed to load profile");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const refresh = async () => {
    await fetchUserProfile();
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchUserProfile();
    } else if (status === "unauthenticated") {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return {
    student,
    meritSummary,
    isLoading: isLoading || status === "loading",
    error,
    refresh,
  };
}
