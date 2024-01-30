import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

export const {
    handlers: { GET, POST },
    auth,
} = NextAuth({
    providers: [Discord({
        clientId: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
    })],
});

// auth from client components using useSession, as sessionprovider is provided to all pages by page.tsx
// auth from server components uses the auth() function exported from this file
