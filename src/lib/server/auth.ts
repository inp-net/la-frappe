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
            // Récupère les groupes dans le LDAP
            if (profile && 'groups' in profile) {
                token.groups = profile.groups;
            }
            return token;
        },
        async session({ session, token }) {
            if (token.groups && session.user) {
                (session.user as any).groups = token.groups;
            }
            return session;
        },
    },
    trustHost: true,
});
