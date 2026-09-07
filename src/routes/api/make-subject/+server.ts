import { StoragePaths } from '$lib/types/types.d';
import { json, type RequestHandler } from '@sveltejs/kit';
import { mkdirSync, existsSync, readFileSync, writeFileSync, symlinkSync, readdirSync, lstatSync, rmSync } from 'fs';
import { join, resolve, dirname, relative } from 'path';
import { IsBan } from '$lib/server/authService';

async function createSubject(name: string, paths: string[]) {
    const targetPath: string = resolve(StoragePaths.DEFAULT_SUBJECT_LOCATION, name);
    const metadataPath = join(targetPath, 'metadata.json');

    let writePath: string[];

    if (existsSync(targetPath) && existsSync(metadataPath)) {
        const existingPaths = JSON.parse(readFileSync(metadataPath, 'utf-8'));
        writePath = existingPaths.concat(paths);
    } else {
        mkdirSync(targetPath, { recursive: true });
        writePath = paths;
    }

    writeFileSync(metadataPath, JSON.stringify({ paths: writePath }));
}

function generateHierarchy() {
    console.log("Début de la génération de l'arborescence...");
    const uploadsRoot = resolve(StoragePaths.DEFAULT_SUBJECT_LOCATION);

    if (existsSync(StoragePaths.DEFAULT_DB_LOCATION)) {
        const items = readdirSync(StoragePaths.DEFAULT_DB_LOCATION);
        for (const item of items) {
            const itemPath = join(StoragePaths.DEFAULT_DB_LOCATION, item);
            rmSync(itemPath, { recursive: true, force: true });
        }
        console.log("Contenu de frappe_tree nettoyé.");
    } else {
        mkdirSync(StoragePaths.DEFAULT_DB_LOCATION, { recursive: true });
    }

    if (!existsSync(uploadsRoot)) {
        console.log("Dossier uploads introuvable.");
        return;
    }

    const subjects = readdirSync(uploadsRoot).filter(f =>
        lstatSync(join(uploadsRoot, f)).isDirectory()
    );

    for (const subject of subjects) {
        const subjectPath = join(uploadsRoot, subject);
        const metaPath = join(subjectPath, 'metadata.json');

        if (!existsSync(metaPath)) continue;

        try {
            const metadata = JSON.parse(readFileSync(metaPath, 'utf-8'));
            const paths = Array.isArray(metadata.paths) ? metadata.paths : (Array.isArray(metadata) ? metadata : []);

            for (const virtualPath of paths) {
                if (!virtualPath || virtualPath === '.' || virtualPath === '..') continue;
                const targetDir = join(StoragePaths.DEFAULT_DB_LOCATION, virtualPath);

                mkdirSync(targetDir, { recursive: true });

                const linkName = join(targetDir, subject);
                
                if (!existsSync(linkName)) {
                    const relativeTarget = relative(dirname(linkName), subjectPath);
                    symlinkSync(relativeTarget, linkName, 'dir');
                    
                    console.log(`Link créé : ${virtualPath} -> ${subject} (relatif: ${relativeTarget})`);
                }
            }
        } catch (err: any) {
            console.error(`Erreur de la matière ${subject}:`, err.message);
        }
    }

    console.log("Arborescence générée avec succès !");
}

export const POST: RequestHandler = async ({ request, locals }) => {
    const session = await locals.auth();
    if (!session || !session.user || !session.user.name) {
        return json({ error: 'Unauthorized', message: 'Vous devez être connecté' }, { status: 401 });
    }

    if (IsBan(session.user.name)) {
        return json({ 
            error: 'Forbidden', 
            message: "Vous êtes banni."
        }, { status: 403 });
    }

    try {
        const body = await request.json();
        const name = body.name ?? '';
        const safeName = name.replace(/[/\\?%*:|"<>]/g, '-');
        const paths = body.paths ?? [];

        await createSubject(safeName, paths);
        return json({ message: 'UE crée avec succès' }, { status: 201 });
    } catch (err: any) {
        console.error("FS Error:", err);
        const status = err.status || 500;
        const message = err.message || "Une erreur interne est survenue.";
        return json({ message }, { status });
    }
};
