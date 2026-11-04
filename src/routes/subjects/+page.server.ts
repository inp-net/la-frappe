import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { type FileData, StoragePaths } from '#lib/types/types.js';
import { getSubjects, securePath } from '#lib/server/fileService.js';

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.auth();
    if (!session) {
        throw redirect(303, '/');
    }

    const path = securePath(StoragePaths.DEFAULT_SUBJECT_LOCATION);

    console.log(path);

    let subjects: FileData[] = [];
    if (path)
        subjects = getSubjects();

    return {
        subjects: subjects
    };
};
