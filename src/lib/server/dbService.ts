import { StoragePaths } from '$lib/types/types.d';
import { existsSync, mkdirSync, rmSync, readdirSync, readFileSync, writeFileSync, symlinkSync } from 'fs';
import { join, resolve, dirname, relative, sep } from 'path';

export interface SubjectMetadata {
    paths?: string[];
    [key: string]: unknown;
}

/** Supprime les UEs vides ou ne contenant qu'un seul fichier. */
export function cleanup(): void {
    const subjectRoot = resolve(StoragePaths.DEFAULT_SUBJECT_LOCATION);
    if (!existsSync(subjectRoot)) return;

    const entries = readdirSync(subjectRoot, { withFileTypes: true });
    for (const entry of entries) {
        if (!entry.isDirectory()) continue;

        const coursePath = join(subjectRoot, entry.name);
        const inCourse = readdirSync(coursePath);
        if (inCourse.length <= 1) {
            rmSync(coursePath, { recursive: true, force: true });
        }
    }
}

/** Crée l'arbre à partir du dossier flat (instantané). */
export function constructTree(): void {
    const uploadsRoot = resolve(StoragePaths.DEFAULT_SUBJECT_LOCATION);
    const distRoot = resolve(StoragePaths.DEFAULT_DB_LOCATION);

    console.log("[constructTree] Début de la génération...");

    // Nettoyage rapide du contenu de distRoot
    if (existsSync(distRoot)) {
        for (const item of readdirSync(distRoot)) {
            rmSync(join(distRoot, item), { recursive: true, force: true });
        }
    } else {
        mkdirSync(distRoot, { recursive: true });
    }

    if (!existsSync(uploadsRoot)) return;

    // Récupération directe des dossiers sans ré-appeler stat
    const subjects = readdirSync(uploadsRoot, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

    let linksCreated = 0;

    for (const subject of subjects) {
        const subjectPath = join(uploadsRoot, subject);
        const metaPath = join(subjectPath, 'metadata.json');

        if (!existsSync(metaPath)) continue;

        try {
            const metadata: SubjectMetadata = JSON.parse(readFileSync(metaPath, 'utf-8'));
            const paths = metadata.paths ?? [];

            for (const virtualPath of paths) {
                const targetDir = join(distRoot, virtualPath);
                mkdirSync(targetDir, { recursive: true });

                const linkName = join(targetDir, subject);
                const relativeTarget = relative(dirname(linkName), subjectPath);

                symlinkSync(relativeTarget, linkName, 'dir');
                linksCreated++;
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(`[constructTree] Erreur matière "${subject}":`, message);
        }
    }

    console.log(`[constructTree] Terminé : ${linksCreated} lien(s) généré(s).`);
}

/** Crée une UE dans le flat à partir d'un nom d'UE et ses positions. */
export function createSubject(name: string, paths: string[], merge: boolean = false): void {
    const targetPath = resolve(StoragePaths.DEFAULT_SUBJECT_LOCATION, name);
    const metadataPath = join(targetPath, 'metadata.json');

    const normalizedInput = Array.from(new Set(paths.map(p => normalize(resolve(p)))));
    let finalPaths = normalizedInput;

    if (existsSync(targetPath) && existsSync(metadataPath) && merge) {
        try {
            const raw = readFileSync(metadataPath, 'utf-8');
            const data = JSON.parse(raw) as { paths?: string[] };
            const existingPaths = Array.isArray(data.paths) 
                ? data.paths.map(p => normalize(resolve(p))) 
                : [];

            finalPaths = Array.from(new Set([...existingPaths, ...normalizedInput]));
        } catch {
            console.error("Erreur lors de la lecture des métadonnées existantes");
        }
    }

    mkdirSync(targetPath, { recursive: true });
    writeFileSync(metadataPath, JSON.stringify({ paths: finalPaths }, null, 2), 'utf-8');
}
