import { SvelteKitAuth } from '@auth/sveltekit';
import Authentik, { type AuthentikProfile } from '@auth/sveltekit/providers/authentik';
import { env } from '$env/dynamic/private';

const BETTER_AUTH_SECRET = env.BETTER_AUTH_SECRET;
const AUTHENTIK_SECRET = env.AUTHENTIK_SECRET;
const AUTHENTIK_ID = env.AUTHENTIK_ID;
const PUBLIC_AUTH_AUTHENTIK_ISSUER = env.PUBLIC_AUTH_AUTHENTIK_ISSUER;

declare module '@auth/sveltekit' {
    interface Session {
        user: {
            id?: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            groups?: string[];
        }
    }
}

declare module '@auth/core/jwt' {
    interface JWT {
        groups?: string[];
    }
}

const providers = [
    Authentik({
        clientId: AUTHENTIK_ID,
        issuer: PUBLIC_AUTH_AUTHENTIK_ISSUER,
        clientSecret: AUTHENTIK_SECRET,
        authorization: { params: { scope: 'openid profile email churros:profile' } }
    }),
];

export const { handle, signIn, signOut } = SvelteKitAuth({
    secret: BETTER_AUTH_SECRET,
    providers,
    trustHost: true,
    debug: true,
    callbacks: {
        async signIn() {
            return true;
        },
        async jwt({ token, profile }) {
            if (profile) {
                const authentikProfile = profile as AuthentikProfile & { groups?: string[] };
                if (authentikProfile.groups) {
                    token.groups = authentikProfile.groups;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (token.groups && session.user) {
                session.user.groups = token.groups;
            }
            return session;
        }
    }
});
