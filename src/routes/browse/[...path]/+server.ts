// API pour récupérer un fichier à une position

import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import fs from 'fs';
import path from 'path';
import { securePath } from '$lib/server/fileService';

export const GET: RequestHandler = async ({ params, locals }) => {
    const session = await locals.auth();
    if (!session) {
        throw error(403, 'Forbidden access');
    }

    const rawPath = params.path;
    const safePath = securePath(rawPath, true);
    
    if (!safePath) {
        return json({ error: 'Invalid path' }, { status: 400 });
    }

    const fileBuffer = fs.readFileSync(safePath);

    return new Response(fileBuffer, {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'inline; filename="' + path.basename(safePath) + '"'
        }
    });
};
