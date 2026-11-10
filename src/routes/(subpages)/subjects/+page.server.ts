import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { type FileData, StoragePaths } from '#lib/types/types.js';
import { getFilesAt, securePath } from '#lib/server/fileService.js';

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.auth();
    if (!session) {
        throw redirect(303, '/');
    }

    const safeRelativePath = securePath(StoragePaths.DEFAULT_SUBJECT_LOCATION);

    let subjects: FileData[] = [];
    if (safeRelativePath) {
        subjects = getFilesAt(safeRelativePath);
    }

    return {
        subjects: subjects
    };
};
