import { SvelteKitAuth } from '@auth/sveltekit';
import Authentik, { type AuthentikProfile } from '@auth/sveltekit/providers/authentik';
import { env } from '$env/dynamic/private';

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
        clientId: env.AUTHENTIK_ID,
        issuer: env.AUTHENTIK_ISSUER,
        clientSecret: env.AUTHENTIK_SECRET,
        authorization: env.AUTHORIZE_URL,
        token: env.TOKEN_URL,
        userinfo: env.USER_INFO_URL,
    }),
];

export const { handle, signIn, signOut } = SvelteKitAuth({
    secret: env.BETTER_AUTH_SECRET,
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
