// API pour modifier les métadonnées d'une UE

import type { RequestHandler } from './$types';
import { StoragePaths } from '$lib/types/types.d';
import { json } from '@sveltejs/kit';
import { securePath } from '$lib/server/fileService';
import { join } from 'node:path';
import { access, rename, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';

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

    const oldSafePath = securePath(join(StoragePaths.DEFAULT_SUBJECT_LOCATION, oldName));
    const newSafePath = securePath(join(StoragePaths.DEFAULT_SUBJECT_LOCATION, newName));

    if (!oldSafePath || !newSafePath) {
        return json({ error: 'Invalid path', message: 'Chemin non autorisé ou invalide.' }, { status: 400 });
    }

    try {
        await access(oldSafePath, constants.F_OK);
    } catch {
        return json(
            { error: 'Not Found', message: `Le dossier d'origine "${oldName}" n'existe pas.` },
            { status: 404 }
        );
    }

    let finalFolderPath = oldSafePath;

    if (oldName !== newName) {
        const destinationExists = await access(newSafePath, constants.F_OK)
            .then(() => true)
            .catch(() => false);

        if (destinationExists) {
            return json(
                { error: 'Conflict', message: `Un dossier nommé "${newName}" existe déjà.` },
                { status: 409 }
            );
        }

        try {
            await rename(oldSafePath, newSafePath);
            finalFolderPath = newSafePath;
        } catch (err) {
            console.error('Error renaming directory:', err);
            return json(
                { error: 'Internal Server Error', message: 'Impossible de renommer le dossier.' },
                { status: 500 }
            );
        }
    }

    // Ecrire les métadonnées
    const metadataPath = join(finalFolderPath, 'metadata.json');

    try {
        await writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');
    } catch (err) {
        console.error('Error writing metadata.json:', err);
        return json(
            { error: 'Internal Server Error', message: 'Erreur lors de la sauvegarde du fichier metadata.json.' },
            { status: 500 }
        );
    }

    return json({ success: true, name: newName, metadata });
};
