import NextAuth from "next-auth";
import axios from "axios";
import CredentialProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { Provider } from "next-auth/providers"

export const NEXT_AUTH = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ] as Provider[],
  secret: process.env.NEXTAUTH_SECRET
});
