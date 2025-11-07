import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "../prisma/prisma";

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async signIn({ user }) {
      // Only allow emails from UPM domains
      const email = user.email?.toLowerCase();
      const allowedDomains = ["upm.edu.my", "student.upm.edu.my"];
      const isAllowedDomain = allowedDomains.some((domain) =>
        email?.endsWith(`@${domain}`)
      );

      if (!isAllowedDomain) {
        return false; // Deny sign-in for non-UPM emails
      }

      // Save user to database on first sign-in
      await prisma.user.upsert({
        where: { email: user.email },
        update: { name: user.name, image: user.image },
        create: { email: user.email, name: user.name, image: user.image },
      });
      return true;
    },
  },
});
