import { SvelteKitAuth } from '@auth/sveltekit';
import Authentik from '@auth/sveltekit/providers/authentik';
import { env } from '$env/dynamic/private';

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
});
