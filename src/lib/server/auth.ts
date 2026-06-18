import { SvelteKitAuth } from '@auth/sveltekit';
import Authentik, { type AuthentikProfile } from '@auth/sveltekit/providers/authentik';
import Credentials from '@auth/sveltekit/providers/credentials';
import type { Profile, Session } from '@auth/core/types';
import { BETTER_AUTH_SECRET, AUTH_AUTHENTIK_SECRET, AUTH_AUTHENTIK_ID } from '$env/static/private';
import { PUBLIC_AUTH_AUTHENTIK_ISSUER } from '$env/static/public';
import type { CredentialInput, CredentialsConfig, OAuthConfig } from '@auth/core/providers';

// GESTION DE L'AUTHENTIFICATION

type Provider = OAuthConfig<AuthentikProfile> | CredentialsConfig<Record<string, CredentialInput>>;

const providers: Provider[] = [
    Authentik({
        clientId: AUTH_AUTHENTIK_ID,
        issuer: PUBLIC_AUTH_AUTHENTIK_ISSUER,
        clientSecret: AUTH_AUTHENTIK_SECRET,
        authorization: { params: { scope: 'churros:profile' } }
    }),
];

// Connexion
export const { handle, signIn, signOut } = SvelteKitAuth({
    secret: BETTER_AUTH_SECRET,
    providers,
    trustHost: true,
    logger: {
        error: (code, ...message) => {
            console.error('[Auth Error]', code, ...message);
        },
        warn: (code, ...message) => {
            console.warn('[Auth Warn]', code, ...message);
        },
    },
    callbacks: {
        async signIn({ profile, user, account }) {
            if (profile) {
                const { iss, sub, aud, exp, iat, auth_time, jti, acr, amr, sid, ...user } = profile;
            }
            return true;
        },
        async session({ session, token }: { session: Session; token: Record<string, unknown> }) {
            session.uid = token.uid as string;
            return session;
        }
    }
});

