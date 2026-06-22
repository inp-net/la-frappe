import { resolve } from 'path';
import { redirect } from '@sveltejs/kit';
import { StoragePaths } from '$lib/types/types.d';
import { getFilesAt } from '$lib/server/fileService';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {

    const session = locals.session;

    if (!session) {
        throw redirect(303, '/');
    }

    const root = resolve(StoragePaths.DEFAULT_DB_LOCATION);
    const schoolList = getFilesAt(root);
    const schoolNames: string[] = schoolList.map(item => item.name);
    return {
        schoolNames,
        user: session.user
    };
};
