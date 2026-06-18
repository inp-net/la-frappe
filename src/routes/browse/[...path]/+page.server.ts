import type { PageServerLoad } from './$types';
import { getFilesAt } from '$lib/tools/utils'
import { join } from 'path';
import { redirect } from '@sveltejs/kit';
import { FOLDER } from '$lib/constants/index';

export const load: PageServerLoad = async ({ params, locals }) => {

    const session = await locals.auth();

    if (!session) {
        throw redirect(303, '/');
    }

    const currentPath = params.path || "";
    const fullPath = join(process.cwd(), FOLDER.DEFAULT_DB_LOCATION, currentPath);
    const items = getFilesAt(fullPath);
    return {
        items,
        currentPath,
        user: session.user
    };
};
