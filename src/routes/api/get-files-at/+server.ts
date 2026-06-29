// API pour récupérer les fichiers et dossiers à une position

import { json } from '@sveltejs/kit';
import { getFilesAt } from '$lib/server/fileService';
import type { RequestHandler } from './$types';
import { securePath } from '$lib/server/fileService';

/** Api pour récupérer les fichiers dans la déstination.
 * @param path : Path où la recherche s'effectue.
 */
export const GET: RequestHandler = async ({ url, locals }) => {
    console.log("API GET appelée !");

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

    console.log("Secured path : " + safePath);
    
    if (!safePath) {
        return json({ error: 'Invalid path' }, { status: 400 });
    }
    
    const items = getFilesAt(safePath);
    return json(items);
}
