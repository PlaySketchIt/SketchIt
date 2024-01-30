import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

export const {
    handlers: { GET, POST },
    auth,
} = NextAuth({
    providers: [Discord],
});

// auth from client components using useSession, as sessionprovider is provided to all pages by page.tsx
// auth from server components uses the auth() function exported from this file

// don't forget to set AUTH_DISCORD_ID and AUTH_DISCORD_SECRET in the environment
// also set NEXTAUTH_SECRET (always) and NEXTAUTH_URL (in prod, same as BASE_URL)
