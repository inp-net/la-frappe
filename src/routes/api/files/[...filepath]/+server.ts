import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { StoragePaths } from '#lib/types/types.js';
import { securePath } from '#lib/server/fileService.js';
import fs from 'fs';
import path from 'path';

function getMimeType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case '.pdf': return 'application/pdf';
        case '.json': return 'application/json';
        case '.png': return 'image/png';
        case '.jpg':
        case '.jpeg': return 'image/jpeg';
        default: return 'application/octet-stream';
    }
}

/** Récupère les fichiers/PDFs */
export const GET: RequestHandler = async ({ params, locals }) => {
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

    const rawFilepath = params.filepath || '';

    const sanitizedRelativePath = securePath(rawFilepath);
    if (!sanitizedRelativePath) {
        throw error(400, 'Invalid file path');
    }

    const baseDir = path.resolve(StoragePaths.DEFAULT_DB_LOCATION);
    const absoluteFilePath = path.resolve(baseDir, sanitizedRelativePath);

    if (!absoluteFilePath.startsWith(baseDir)) {
        throw error(403, 'Forbidden access');
    }

    if (!fs.existsSync(absoluteFilePath) || fs.statSync(absoluteFilePath).isDirectory()) {
        throw error(404, 'File not found');
    }

    const contentType = getMimeType(absoluteFilePath);
    const fileBuffer = fs.readFileSync(absoluteFilePath);

    return new Response(fileBuffer, {
        headers: {
            'Content-Type': contentType,
            'Content-Disposition': 'inline',
            'Cache-Control': 'public, max-age=31536000'
        }
    });
};
