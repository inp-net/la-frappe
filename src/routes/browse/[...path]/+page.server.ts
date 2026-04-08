import type { PageServerLoad } from './$types';
import { readdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
    const currentPath = params.path || "";
    console.log(currentPath);
    
    const fullPath = join(process.cwd(), 'static/uploads', currentPath);

    if (!existsSync(fullPath)) {
        throw error(404, "Dossier introuvable");
    }

    const items = readdirSync(fullPath).map(name => ({
        name,
        isDirectory: statSync(join(fullPath, name)).isDirectory()
    }));

    return {
        items,
        currentPath
    };
};