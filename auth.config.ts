import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  // ... reszta Twojej konfiguracji (secret, providers, pages itp.)
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/",
  },
  callbacks: {
    authorized({ auth, request }) {
      const { nextUrl, headers } = request;
      const isLoggedIn = !!auth?.user;
      const isAuthPage = nextUrl.pathname === "/" || nextUrl.pathname === "/register";
      
      if (isAuthPage) {
        if (isLoggedIn) return Response.redirect(new URL("/dashboard", nextUrl));
        return true;
      }

      if (!isLoggedIn) {
        const isServerAction = headers.has("next-action");

        if (isServerAction) {
          return true;
        }

        return false; 
      }
      return true; 
    },
  },
  providers: [],
} satisfies NextAuthConfig

