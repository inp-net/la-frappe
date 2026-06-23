import { handle as handleAuth } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const handleAuthGuard: Handle = async ({ event, resolve }) => {
    if (env.DEV_FAKE_AUTH === 'true') {
        // Condition particulière si le projet est en test, pas besoin
        // d'authentifications.
        console.log("Using fake auth");
        event.locals.session = { user: { name: "Fake User", email: "fake@test.com" } };
        return resolve(event);
    };
    
    const session = await event.locals.auth();
    const pathname = event.url.pathname;
    const isPublicRoute = pathname === '/';

    // Si non connecté, redirection vers login
    if (!session && !isPublicRoute) {
        event.locals.session = null;
        // Si c'est une API, renvoie une erreur
        if (pathname.startsWith('/api/')) {
            return new Response(
                JSON.stringify({ error: 'Unauthorized', message: 'Vous devez être connecté' }), 
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        throw redirect(302, '/');
    }

    event.locals.session = session;
    return resolve(event);
};

export const handle: Handle = sequence(handleAuth, handleAuthGuard);
