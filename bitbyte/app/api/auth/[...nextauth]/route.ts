import NextAuth, { NextAuthOptions, DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        })
    ],

    callbacks: {
        async session({ session, token}: {
            session: DefaultSession & { user?: { id?: string } };
            token: { sub?: string };
          }) {
            if (session.user && token.sub) {
                session.user.id = token.sub
            }
            return session;
        }
    }
}

export const handler = NextAuth(authOptions);
export {handler as GET, handler as POST}