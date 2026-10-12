// API pour récupérer les fichiers et dossiers à une position

import { json } from '@sveltejs/kit';
import { getFilesAt } from '#lib/server/fileService.js';
import type { RequestHandler } from './$types.js';
import { securePath } from '#lib/server/fileService.js';

/** Api pour récupérer les fichiers dans la déstination.
 * @param path : Path où la recherche s'effectue.
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

    const rawPath = url.searchParams.get('path') || '';
    const safePath = securePath(rawPath);

    if (!safePath) {
        return json({ error: 'Invalid path' }, { status: 400 });
    }
    
    const items = getFilesAt(safePath);
    return json(items);
}
