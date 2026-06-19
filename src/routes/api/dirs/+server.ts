// API pour récupérer les fichiers et dossiers à une position

import { json } from '@sveltejs/kit';
import { getFilesAt } from '$lib/server/fileService';
import type { FileData } from '$lib/types/types.d';
import type { RequestHandler } from './$types';

/** Api pour récupérer les fichiers dans la déstination. */
export const GET: RequestHandler = async ({ url }) => {
    // TODO sécurité
    const path = url.searchParams.get('path') || "";
    const items: FileData[] = getFilesAt(path);
    return json(items);
};
