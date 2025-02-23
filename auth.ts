import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import { api } from "@/app/api/api";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    lifeAuUser: any;
  }
  interface User {
    accessToken?: string;
    lifeAuUser: any;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Github({
      authorization: {
        params: {
          prompt: ["select_account"],
        },
      },
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        let dto = {
          name: user.name,
          email: user.email,
          profile: user.image,
        };

        // AUTHENTICATION CHECK FOR AU EMAIL
        // if(!user.email?.endsWith('@au.edu')) {
        //   return false
        // }

        console.log(dto, 'dto')
        console.log(api)
        const response = await fetch(`${api}/auth/signup`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dto),
        })
        .then((response) => response.json())
        .catch((error) => console.log(error));

        console.log(response, 'response')

        if (response?.success) {
          user.accessToken = response.message.accessToken;
          user.lifeAuUser = {...response.message.user, githubToken: account?.access_token};
          return true;
        } else {
          console.log(response.message, "response.message");
          return false;
        }
      } catch (error) {
        console.log(error, "error");
        return false;
      }
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.lifeAuUser = user.lifeAuUser;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.lifeAuUser = token.lifeAuUser;
      return session;
    },
  },
  pages: {
    error: "/landing"
  }
});
