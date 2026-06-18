import { handle as handleAuth } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { redirect } from '@sveltejs/kit';

const handleAuthGuard: Handle = async ({ event, resolve }) => {
    const session = await event.locals.auth();
    const currentPath = event.url.pathname;
    
    if (session && currentPath === '/auth/signin') {
        throw redirect(303, '/');
    }
    
    return resolve(event);
};

export const handle: Handle = sequence(handleAuth, handleAuthGuard);
