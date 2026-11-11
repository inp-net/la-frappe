import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { type FileData, StoragePaths } from '#lib/types/types.js';
import { getFilesAt, getSubjectMetadata, securePath } from '#lib/server/fileService.js';

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.auth();
    if (!session) {
        throw redirect(303, '/');
    }

    const safeRelativePath = securePath(StoragePaths.DEFAULT_SUBJECT_LOCATION);

    let subjects: FileData[] = [];
    if (safeRelativePath) {
        subjects = getFilesAt(safeRelativePath).map((file) => {
            const metadata = getSubjectMetadata(file.name);

            return {
                ...file,
                ...(metadata?.paths ? { path: metadata.paths } : {}),
                metadata: metadata ?? undefined
            };
        });
    }

    return {
        subjects
    };
};
