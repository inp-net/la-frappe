// API pour modifier les métadonnées d'une UE

import type { RequestHandler } from './$types';
import { StoragePaths } from '$lib/types/types';
import { json } from '@sveltejs/kit';
import { securePath } from '$lib/server/fileService';
import { renameSubject } from '$lib/server/dbService';
import { join } from 'node:path';
import { writeFile } from 'node:fs/promises';

// TODO crée des petites fonctions réutilisables

/* Api pour modifier les metadonnées.
 * @param oldName : ancien nom de l'UE
 * @param newName : nouveau nom de l'UE
 * @param metadata : json du metadata.json
 */
export const POST: RequestHandler = async ({ request, locals }) => {
    const session = await locals.auth();
    if (!session) {
        return json(
            { error: 'Unauthorized', message: 'Vous devez être connecté' },
            { status: 401 }
        );
    }

    let oldName: string;
    let newName: string;
    let metadata: Record<string, unknown>;

    // récupérer les données de la requête
    try {
        const body = await request.json();
        oldName = body.oldName?.trim();
        newName = (body.newName || oldName)?.trim();
        metadata = body.metadata;

        if (!oldName || !metadata || typeof metadata !== 'object') {
            return json(
                { error: 'Bad Request', message: '`oldName` et `metadata` sont requis.' },
                { status: 400 }
            );
        }
    } catch {
        return json(
            { error: 'Bad Request', message: 'Payload JSON invalide.' },
            { status: 400 }
        );
    }

    // Ecrire les métadonnées
    const safePath = securePath(join(StoragePaths.DEFAULT_SUBJECT_LOCATION, oldName)) ?? '';
    const metadataPath = join(safePath, 'metadata.json');

    try {
        await writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');
    } catch (err) {
        console.error('Error writing metadata.json:', err);
        return json(
            { error: 'Internal Server Error', message: 'Erreur lors de la sauvegarde du fichier metadata.json.' },
            { status: 500 }
        );
    }

    await renameSubject(oldName, newName);

    return json({ success: true, name: newName, metadata });
};
