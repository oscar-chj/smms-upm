import { saveDevUser, saveGoogleUser } from "@/app/auth/actions";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { authConfig } from "./auth.config";

// Development backdoor - only enabled in non-production environments
const devProviders =
  process.env.NODE_ENV !== "production"
    ? [
        CredentialsProvider({
          id: "dev-backdoor",
          name: "Dev Backdoor",
          credentials: {
            email: {
              label: "Email",
              type: "email",
              placeholder: "dev@example.com",
            },
          },
          async authorize(credentials) {
            if (!credentials?.email) return null;

            // Create or find user in database via server action
            const user = await saveDevUser(credentials.email as string);

            if (!user) return null;

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
            };
          },
        }),
      ]
    : [];

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    ...devProviders,
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      // Add user ID to token when user signs in
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user ID from token to session
      if (token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Google provider verification
      if (account?.provider === "google") {
        if (!profile?.email_verified) {
          return false; // Deny if email not verified
        }

        // Check if email exists
        if (!profile?.email) {
          return false; // Deny sign-in if no email
        }

        // Only allow emails from UPM domains
        const email = profile.email.toLowerCase();
        const allowedDomains = ["upm.edu.my", "student.upm.edu.my"];
        const isAllowedDomain = allowedDomains.some((domain) =>
          email.endsWith(`@${domain}`)
        );

        if (!isAllowedDomain) {
          return false; // Deny sign-in for non-UPM emails
        }

        // Save user to database via server action
        await saveGoogleUser({
          email: profile.email,
          name: user.name ?? undefined,
          image: user.image ?? undefined,
        });
      }

      return true; // Allow other providers (dev-backdoor)
    },
    async redirect({ url, baseUrl }) {
      // Handle redirects after sign in
      // If url is relative, make it absolute
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // If url is on the same origin, allow it
      else if (new URL(url).origin === baseUrl) return url;
      // Otherwise, redirect to the base URL (dashboard)
      return `${baseUrl}/dashboard`;
    },
  },
});
