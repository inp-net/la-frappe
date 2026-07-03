import { json } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { StoragePaths, type FileData, type SubjectData } from '$lib/types/types.d';
import { getFilesAt } from '$lib/server/fileService';
import fs from 'fs';
import path from 'path';

/** Récupère les données en fonction du nom d'un UE.
 * @param name : string nom de l'UE
 */
export const GET: RequestHandler = async ({ url, locals }) => {

    const session = await locals.auth();
    if (!session) {
        return json({ 
            error: 'Unauthorized', 
            message: 'Vous devez être connecté' 
        }, { status: 401 });
    }

    const courseName: string = url.searchParams.get('name') || '';
    const validNameRegex = /^[a-zA-Z0-9À-ÿ\-_ . warm]+$/;

    if (
        courseName.includes('/') ||
        courseName.includes('.') ||
        !validNameRegex.test(courseName)
    ){
        return json({ error: 'Invalid name' }, { status: 400 });
    }

    let items: FileData[] = [];
    let metadata = {};
    let returnData: SubjectData = {};

    try {
        // Read files
        const targetPath = `${StoragePaths.DEFAULT_SUBJECT_LOCATION}/${courseName}/`;
        items = getFilesAt(targetPath);
        returnData.files = items;

        // Read metadata
        const metadataString = fs.readFileSync(`${targetPath}/metadata.json`, 'utf8');
        metadata = JSON.parse(metadataString);
        returnData.paths = metadata.paths;
    } catch (err) {
        // NOO
    }
    
    return json(returnData);
};
