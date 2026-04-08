import { readdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';
import type { PageServerLoad } from "./$types";

export function get_child(relativePath: string) {
    const baseDir = join(process.cwd(), 'static/uploads', relativePath);

    if (!existsSync(baseDir)) {
        return { folders: [], files: [] };
    }

    const items = readdirSync(baseDir);

    const folders: string[] = [];
    const files: string[] = [];

    for (const item of items) {
        const fullPath = join(baseDir, item);
        if (statSync(fullPath).isDirectory()) {
            folders.push(item);
        } else {
            files.push(item);
        }
    }

    return { folders, files };
}

export const load: PageServerLoad = async ({ params }) => {
    const currentPath = params.path || ""; 
    const baseDir = join(process.cwd(), 'static/uploads', currentPath);

    if (!existsSync(baseDir)) {
        return { folders: [], files: [], currentPath };
    }

    const items = readdirSync(baseDir);
    
    // Map items to include their type for easier UI rendering
    const content = items.map(name => {
        const isDirectory = statSync(join(baseDir, name)).isDirectory();
        return { name, isDirectory };
    });

    return {
        content,
        currentPath
    };
};