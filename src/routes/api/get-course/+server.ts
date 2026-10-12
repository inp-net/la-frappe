import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { StoragePaths, type SubjectData } from '#lib/types/types.ts';
import { getFilesAt, securePath, type ValidatedPath } from '#lib/server/fileService.ts';
import fs from 'fs';
import path from 'path';

/**
 * Récupère les données en fonction du nom d'un UE.
 * @param name : string nom de l'UE
 */
export const GET: RequestHandler = async ({ url, locals }) => {
    const session = await locals.auth();
    if (!session) {
        return json(
            {
                error: 'Unauthorized',
                message: 'Vous devez être connecté'
            },
            { status: 401 }
        );
    }

    const courseName = (url.searchParams.get('name') || '').trim();
    const validNameRegex = /^[a-zA-Z0-9À-ÿ\-_ .]+$/;

    if (!courseName || courseName.includes('/') || courseName.includes('..') || !validNameRegex.test(courseName)) {
        return json({ error: 'Invalid name' }, { status: 400 });
    }

    const rawTargetPath = path.join(StoragePaths.DEFAULT_SUBJECT_LOCATION, courseName);
    const safeTargetPath: ValidatedPath | null = securePath(rawTargetPath);

    if (!safeTargetPath) {
        return json({ error: 'Invalid or unsafe path' }, { status: 400 });
    }

    const returnData: SubjectData = {
        files: [],
        paths: []
    };

    try {
        // Read files avec le chemin validé
        returnData.files = getFilesAt(safeTargetPath);

        // Read metadata
        const metadataFilePath = path.join(safeTargetPath, 'metadata.json');
        if (fs.existsSync(metadataFilePath)) {
            const metadataString = fs.readFileSync(metadataFilePath, 'utf8');
            const metadata = JSON.parse(metadataString);
            returnData.paths = metadata.paths;
        }
    } catch (err) {
        // En cas d'erreur de lecture/parse ou dossier inexistant
        return json({ error: 'Dossier introuvable ou erreur de lecture' }, { status: 404 });
    }

    return json(returnData);
};
