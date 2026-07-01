import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { getUserByEmail, createUser } from "./db";
import { v4 as uuid } from "uuid";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existingUser = getUserByEmail(user.email || "");
        if (!existingUser) {
          createUser({
            id: uuid(),
            name: user.name || "Google User",
            email: user.email || "",
            password: "",
            role: "user",
            avatar: user.image || "",
            createdAt: new Date().toISOString(),
          });
        }
      }
      return true;
    },
    async jwt({ token, account }) {
      if (account?.provider === "google") {
        const dbUser = getUserByEmail(token.email || "");
        if (dbUser) {
          token.userId = dbUser.id;
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const u: any = session.user;
        u.id = token.userId as string;
        u.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
