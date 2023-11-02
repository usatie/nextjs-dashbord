import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import type { User } from "@/app/lib/definitions";
import bcrypt from "bcrypt";

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = sql<User>`SELECT * FROM users WHERE email = ${email}`;
    return user.rows[0];
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch user.");
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        parseCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parseCredentials.success) {
          const { email, password } = parseCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) {
            return user;
          }
        }
        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});
