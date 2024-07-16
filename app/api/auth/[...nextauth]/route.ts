import axios from "axios";

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials: any) {
        console.log("====================>", credentials);
        if (!credentials) {
          return null;
        }
        
       
            try {
                const response = await axios.post(
                    "http://localhost:3007/api/auth/login",
                    {
                      email: credentials.email,
                      password: credentials.password,
                    }
                  );
                  if (response.status !== 200){
                      throw new Error(response.data.message)
                  }
                  if (!response.data.token) {
                    return null;
                  }
                  console.log("This is RESPONSE ---------?",response);

                  if(response.data.user) {
                    const user = response.data.user;
                    const token = response.data.token;

                    return user
                  }
            }
            catch(error) {
                console.log(error)
            }
        
        

      },
    }),
  ],
//   callbacks: {
//     signIn: async ({ user, token }) => {

//     }
//   }
// pages: {
//     signIn: '/login'
//   }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
