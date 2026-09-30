import { SvelteKitAuth } from '@auth/sveltekit';
import Authentik from '@auth/sveltekit/providers/authentik';
import { env } from '$env/dynamic/private';

const providers = [
    Authentik({
        clientId: env.AUTHENTIK_ID,
        clientSecret: env.AUTHENTIK_SECRET,
        issuer: env.AUTHENTIK_ISSUER,
    }),
];

export const { handle, signIn, signOut } = SvelteKitAuth({
    secret: env.AUTH_SECRET,
    providers,
    callbacks: {
        async jwt({ token, profile }) {
            if (profile) {
                if ('nickname' in profile) token.nickname = profile.nickname;
                if ('groups' in profile) token.groups = profile.groups;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                if (token.nickname) (session.user as any).nickname = token.nickname;
                if (token.groups) (session.user as any).groups = token.groups;
            }
            return session;
        },
    },
    trustHost: true,
});
