import { StoragePaths } from '#lib/types/types.js';
import { normalizePath, securePath } from '#lib/server/fileService.js';
import { existsSync, mkdirSync, rmSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { access, mkdir, readdir, readFile, rm, symlink, rename } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

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

async function pathExists(path: string): Promise<boolean> {
    try {
        await access(path, constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

/** Crée l'arbre à partir du dossier flat (instantané). */
export async function constructTree(): Promise<void> {
    const uploadsRoot = resolve(StoragePaths.DEFAULT_SUBJECT_LOCATION);
    const distRoot = resolve(StoragePaths.DEFAULT_DB_LOCATION);

    console.log("[constructTree] Début de la génération...");

    if (await pathExists(distRoot)) {
        const items = await readdir(distRoot);
        await Promise.all(
            items.map((item) => rm(join(distRoot, item), { recursive: true, force: true }))
        );
    } else {
        await mkdir(distRoot, { recursive: true });
    }

    if (!(await pathExists(uploadsRoot))) return;

    const entries = await readdir(uploadsRoot, { withFileTypes: true });
    const subjects = entries
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

    let linksCreated = 0;

    for (const subject of subjects) {
        const subjectPath = join(uploadsRoot, subject);
        const metaPath = join(subjectPath, 'metadata.json');

        if (!(await pathExists(metaPath))) continue;

        try {
            const raw = await readFile(metaPath, 'utf-8');
            const metadata: SubjectMetadata = JSON.parse(raw);
            const paths = metadata.paths ?? [];

            for (const virtualPath of paths) {
                const targetDir = join(distRoot, virtualPath);
                await mkdir(targetDir, { recursive: true });

                const linkName = join(targetDir, subject);
                const relativeTarget = relative(dirname(linkName), subjectPath);

                await symlink(relativeTarget, linkName, 'dir');
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

    const normalizedInput = Array.from(new Set(paths.map(p => normalizePath(resolve(p)))));
    let finalPaths = normalizedInput;

    if (existsSync(targetPath) && existsSync(metadataPath) && merge) {
        try {
            const raw = readFileSync(metadataPath, 'utf-8');
            const data = JSON.parse(raw) as { paths?: string[] };
            const existingPaths = Array.isArray(data.paths) 
                ? data.paths.map(p => normalizePath(resolve(p))) 
                : [];

            finalPaths = Array.from(new Set([...existingPaths, ...normalizedInput]));
        } catch {
            console.error("Erreur lors de la lecture des métadonnées existantes");
        }
    }

    mkdirSync(targetPath, { recursive: true });
    writeFileSync(metadataPath, JSON.stringify({ paths: finalPaths }, null, 2), 'utf-8');
}

export async function renameSubject(oldName: string, newName: string) {
    const oldSafePath = securePath(join(StoragePaths.DEFAULT_SUBJECT_LOCATION, oldName));
    const newSafePath = securePath(join(StoragePaths.DEFAULT_SUBJECT_LOCATION, newName));

    if (!oldSafePath || !newSafePath) {
        console.error('Erreur chemin non autorisé ou invalide');
        return;
    }

    try {
        await access(oldSafePath, constants.F_OK);
    } catch {
        console.error("Erreur dossier d'origine n'existe pas");
        return;
    }

    if (oldName !== newName) {
        const destinationExists = await access(newSafePath, constants.F_OK)
            .then(() => true)
            .catch(() => false);

        if (destinationExists) {
            console.error("Le dossier d'arrivé existe déjà");
            return;
        }

        try {
            await rename(oldSafePath, newSafePath);
        } catch (err) {
            console.error("Erreur en renommant le dossier ", err);
            return;
        }
    }
}
