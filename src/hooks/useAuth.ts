import { useSession, signIn, signOut } from "next-auth/react";
import { User } from "@/types/auth.types";

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  clearError: () => void;
}

/**
 * Custom hook for authentication using NextAuth
 * Wraps NextAuth's useSession with a consistent interface
 */
export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  const login = async (
    email: string,
    password: string
  ): Promise<User | null> => {
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        return null;
      }

      // Return user from session after successful login
      return session?.user as User | null;
    } catch (err) {
      // TODO: Implement proper error handling/display
      // eslint-disable-next-line no-console
      console.error("Login error:", err);
      return null;
    }
  };

  const logout = async (): Promise<void> => {
    await signOut({ redirect: true, callbackUrl: "/auth/login" });
  };

  const clearError = () => {
    // No-op for compatibility, errors handled by NextAuth
  };

  return {
    user: session?.user as User | null,
    isLoading,
    error: null, // NextAuth handles errors differently
    login,
    logout,
    clearError,
  };
}
