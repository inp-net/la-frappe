import { handle as handleAuth } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { redirect } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

const handlePerms: Handle = async ({ event, resolve }) => {
    const currentPath = event.url.pathname;
    const session = await event.locals.auth();
    return resolve(event);
};

export const handle: Handle = sequence(handleAuth, handlePerms);
