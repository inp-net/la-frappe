import { SvelteKitAuth } from '@auth/sveltekit';
import Authentik from '@auth/sveltekit/providers/authentik';
import type { SvelteKitAuthConfig } from '@auth/sveltekit';
import { env } from '$env/dynamic/private';

export const { handle, signIn, signOut } = SvelteKitAuth({
    secret: env.AUTH_SECRET,
    providers: [
        Authentik({
            clientId: env.AUTHENTIK_ID,
            clientSecret: env.AUTHENTIK_SECRET,
            issuer: env.AUTHENTIK_ISSUER,
        }),
    ],
    callbacks: {
        async jwt({ token, profile }: { token: Record<string, any>; profile?: Record<string, any> }) {
            if (profile) {
                if ('nickname' in profile) token.nickname = profile.nickname;
                if ('groups' in profile) token.groups = profile.groups;
            }
            return token;
        },
        async session({ session, token }: { session: any; token: Record<string, any> }) {
            if (session?.user) {
                if (token.nickname) session.user.nickname = token.nickname as string;
                if (token.groups) session.user.groups = token.groups as string[];
            }
            return session;
        },
    },
    trustHost: true,
} satisfies SvelteKitAuthConfig);
