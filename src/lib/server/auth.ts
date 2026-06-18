import { SvelteKitAuth } from '@auth/sveltekit';
import Authentik, { type AuthentikProfile } from '@auth/sveltekit/providers/authentik';
import Credentials from '@auth/sveltekit/providers/credentials';
import { BETTER_AUTH_SECRET, AUTHENTIK_SECRET, AUTHENTIK_ID } from '$env/static/private';
import { PUBLIC_AUTH_AUTHENTIK_ISSUER } from '$env/static/public';
import type { CredentialInput, CredentialsConfig, OAuthConfig } from '@auth/core/providers';

// GESTION DE L'AUTHENTIFICATION

type Provider = OAuthConfig<AuthentikProfile> | CredentialsConfig<Record<string, CredentialInput>>;

const providers: Provider[] = [
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
        async signIn({ profile, user, account }) {
            return true;
        },
        async session({ session, token }) {
            if (token.groups) {
                session.user.groups = token.groups;
            }
            return session;
        }
    }
});
