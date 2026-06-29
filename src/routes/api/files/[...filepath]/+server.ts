import { json } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { StoragePaths } from '$lib/types/types.d';
import { securePath } from '$lib/server/fileService';
import fs from 'fs';
import path from 'path';

function getMimeType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.pdf') return 'application/pdf';
    if (ext === '.json') return 'application/json';
    if (ext === '.png') return 'image/png';
    if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
    return 'application/octet-stream';
}

/** Récupère les PDFs */
export const GET: RequestHandler = async ({ params, locals }) => {

    const session = await locals.auth();
    if (!session) {
        return json({ 
            error: 'Unauthorized', 
            message: 'Vous devez être connecté' 
        }, { status: 401 });
    }

    const baseDir = path.resolve(StoragePaths.DEFAULT_DB_LOCATION);
    const safePath = '/' + securePath(path.resolve(baseDir, params.filepath));

    if (!fs.existsSync(safePath) || fs.statSync(safePath).isDirectory()) {
        throw error(404, 'File not found');
    }

    const contentType = getMimeType(safePath);
    const fileBuffer = fs.readFileSync(safePath);
    
    return new Response(fileBuffer, {
        headers: {
            'Content-Type': contentType,
            'Content-Disposition': 'inline',
            'Cache-Control': 'public, max-age=31536000'
        }
    });
};
