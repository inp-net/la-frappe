// API pour récupérer le metadata.json d'une UE

import type { RequestHandler } from './$types';
import { StoragePaths } from '$lib/types/types.d';
import { json } from '@sveltejs/kit';
import { securePath } from '$lib/server/fileService';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';

/** Api pour récupérer le metadata.json d'une UE
 * @param name : nom de l'UE
 */
export const GET: RequestHandler = async ({ url, locals }) => {

    // Authentification
    const session = await locals.auth();
    if (!session) {
        return json({ 
            error: 'Unauthorized', 
            message: 'Vous devez être connecté' 
        }, { status: 401 });
    }

    const name = url.searchParams.get('name') || '';
    const safePath = securePath(join(StoragePaths.DEFAULT_SUBJECT_LOCATION, name));

    if (!safePath) {
        return json({ error: 'Invalid path' }, { status: 400 });
    }

    const metadataPath = join(safePath, 'metadata.json');
    let metadata;

    if (existsSync(metadataPath)) {
        metadata = JSON.parse(readFileSync(metadataPath, 'utf-8'));
    }
    
    return json(metadata);
}
