import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.auth();

    if (session) {
        throw redirect(303, '/browse');
    }

    return {
        isFakeAuth: env.DEV_FAKE_AUTH === "true"
    };
};
