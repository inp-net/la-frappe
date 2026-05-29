// API pour récupérer les fichiers et dossiers à une position

import { json } from '@sveltejs/kit';
import { getFilesAt } from '$lib/tools/utils';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
    const path = url.searchParams.get('path') || "";
    // item est une liste de [nom: , isDirectory: ]
    const items = getFilesAt(path);
    return json(items);
};
