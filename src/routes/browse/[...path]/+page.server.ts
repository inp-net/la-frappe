import type { PageServerLoad } from './$types';
import { join } from 'path';
import { redirect } from '@sveltejs/kit';
import { type FileData, StoragePaths } from '$lib/types/types.d';
import { getFilesAt } from '$lib/server/fileService';

export const load: PageServerLoad = async ({ params, locals }) => {

    const session = locals.session;

    if (!session) {
        throw redirect(303, '/');
    }

    const currentPath: string = params.path || "";
    const fullPath: string = join(process.cwd(), StoragePaths.DEFAULT_DB_LOCATION, currentPath);
    const files: FileData[] = getFilesAt(fullPath);
    return {
        files,
        currentPath,
        user: session.user
    };
};
