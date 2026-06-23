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
        event.locals.session = { id: crypto.randomUUID() };
        return resolve(event);
    };
    
    const session = await event.locals.auth();

    // Si non connecté, redirection vers login
    if (!session) {
        event.locals.session = null;
        if (event.url.pathname.startsWith('/api/')) {
            return new Response(
                JSON.stringify({ error: 'Unauthorized', message: 'Vous devez être connecté' }), 
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }
        // if (!event.url.pathname.includes('/signin')) {
        //     redirect(302, '/signin');
        // }
    }

    event.locals.session = session;
    return resolve(event);
};

export const handle: Handle = sequence(handleAuth, handleAuthGuard);
