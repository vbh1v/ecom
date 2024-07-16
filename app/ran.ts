import NextAuth from "next-auth";
import axios from "axios";
import CredentialProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

export const NEXT_AUTH = NextAuth({
  providers: [
    // Google({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // }),
    CredentialProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "password",
        },
      },
      async authorize(credentials: any) {
        if (credentials===null) return null
        try {
          console.log(credentials);
          // Make an API call to authenticate the user using Axios
          const response = await axios.post(
            "http://localhost:3007/api/auth/login",
            { email: credentials.email, password: credentials.password }
          );

          // If authentication is successful, return the user object
          if (response.data.user) {
            return response.data.user;
          } else {
            throw new Error(response.data.message)
          }
        } catch (error) {
          console.log("this is the errorororor", error.response.data.message)
          throw new Error(error.response.data.message)
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, session }: any) {
      if (user) {
        console.log("jwt callback", { token, user, session });
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;

        console.log("Token after assignment:", token);
      }

      return token;
    },
    async session({ token, session }: any) {
      console.log("Session callback invoked");

      console.log("session callback", { token, session });

      session.user = token.user;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
