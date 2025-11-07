import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../prisma/prisma";

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

            // Create or find user in database
            const user = await prisma.user.upsert({
              where: { email: credentials.email as string },
              update: {},
              create: {
                email: credentials.email as string,
                name: "Dev User",
                image: null,
              },
            });

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
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    ...devProviders,
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Google provider verification
      if (account?.provider === "google") {
        if (!profile?.email_verified) {
          return false; // Deny if email not verified
        }

        // Check if email exists
        if (!profile.email) {
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

        // Save user to database on first sign-in
        await prisma.user.upsert({
          where: { email: profile.email },
          update: {
            name: user.name ?? undefined,
            image: user.image ?? undefined,
            emailVerified: true,
          },
          create: {
            email: profile.email,
            name: user.name ?? undefined,
            image: user.image ?? undefined,
            emailVerified: true,
          },
        });
      }

      return true; // Allow other providers (dev-backdoor)
    },
  },
});
