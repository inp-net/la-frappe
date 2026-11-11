import { readdirSync, statSync, existsSync, rmSync, readFileSync } from 'fs';
import { join } from 'path';
import { error } from '@sveltejs/kit';
import { type FileData, DocumentType, StoragePaths, type SubjectMetadata } from '#lib/types/types.js';
import { getAttributeSync } from 'fs-xattr';

//
// Service server side pour la gestion de fichiers
//

// Typage fort, impossible de passer un string
// https://medium.com/@gvelosa/branded-types-in-typescript-stronger-type-safety-for-your-codebase-3f2125c28b43
export type ValidatedPath = string & { readonly __brand: unique symbol };

/** Fonction qui récupère l'ensemble des noms des fichiers dans un chemin.
 * ATTENTION: Cette fonction n'est pas sécurisé et ne doit pas être utilisé comme tel.
 * @param relativePath : string du chemin à vérifier.
 * @throws 404 error si le chemin n'existe pas.
 * @return liste items [name, isDirectory] des fichiers.
 */
export function getFilesAt(safePath: ValidatedPath, root: string = StoragePaths.DEFAULT_PAGE_LOCATION): FileData[] {
    if (!existsSync(safePath)) {
        throw error(404, "Dossier introuvable");
    }

    const absolutePaths = safePath.split('/');
    const targetPaths = root.split('/');
    const relativePaths = absolutePaths.slice((absolutePaths.findIndex(
        (dir : string) => dir === targetPaths[targetPaths.length - 1]
    ) ?? 0) + 1);
    const baseRelativePath = relativePaths.join('/');

    const files: FileData[] = readdirSync(safePath).map(name => {
        const absoluteFilePath = join(safePath, name);
        const relativeFilePath = join(baseRelativePath, name);
        
        let type = '';
        let author = '';
        let date = '';

        try {
            type = getAttributeSync(absoluteFilePath, 'user.type')?.toString() || '';
        } catch {}

        try {
            author = getAttributeSync(absoluteFilePath, 'user.author')?.toString() || '';
        } catch {}

        try {
            date = getAttributeSync(absoluteFilePath, 'user.date')?.toString() || '';
        } catch {}

        return {
            name: name,
            isDirectory: statSync(absoluteFilePath).isDirectory(),
            path: [relativeFilePath],
            type: type as DocumentType,
            author: author,
            date: date
        };
    });

    return files;
}

/** récèpère les métadonnées metadata.json
 * @param subjectName nom de l'UE.
 * @returns valeurs du fichier.
 */
export function getSubjectMetadata(subjectName: string): SubjectMetadata | null {
    const subjectPath = join(StoragePaths.DEFAULT_SUBJECT_LOCATION, subjectName);
    const metadataPath = join(subjectPath, 'metadata.json');

    if (!existsSync(metadataPath)) {
        return null;
    }

    try {
        const fileContent = readFileSync(metadataPath, 'utf-8');
        const parsed = JSON.parse(fileContent);

        return {
            paths: Array.isArray(parsed.paths) ? parsed.paths : [],
            ...parsed
        };
    } catch (err) {
        console.error(`Failed to read metadata for subject "${subjectName}":`, err);
        return null;
    }
}

/** Méthode pour normaliser un chemin.
 * @param s : string à normaliser.
 */
export const normalizePath = (s: string) => s.trim().toLowerCase().replaceAll(/[\s&\/\\#,+()$~%.'":*?<>{}\-_]+/g, '_');

/** Sécurise les chemins.
 * @param segment String du chemin (ex: ENSEEIHT/1A/SN).
 * @return chemin sécurisé.
 */
export function securePath(input: string): ValidatedPath | null {
    // Vérifie le type
    if (typeof input !== 'string' || !input || input.length > 500) return null;

    // Limite du chemin
    const trimmed = input.trim();
    if (!trimmed || trimmed.length === 0) return null;
    if (trimmed.length > 500) return null;

    // Decode l'URL
    let decoded = trimmed;
    let previous = '';
    let attempts = 0;
    const MAX_ATTEMPTS = 5;
    
    while (decoded !== previous && attempts < MAX_ATTEMPTS) {
        previous = decoded;
        try {
            decoded = decodeURIComponent(decoded);
            attempts++;
        } catch {
            break;
        }
    }

    // Supprime bytes null
    if (input.includes('\0')) return null;
    if (/[\x00-\x1f\x7f-\x9f]/.test(decoded)) return null;

    // Normalisation
    let normalized = decoded.replace(/\\/g, '/').replace(/\/+/g, '/').replace(/^\/+|\/+$/g, '');

    // Bloquage navigations
    if (normalized.includes('..')) return null;
    if (/%2e%2e/.test(decoded.toLowerCase())) return null;

    // Validation des segments
    const segments = normalized.split('/').filter(s => s.length > 0);
    if (segments.length === 0 || segments.length > 20) return null;

    for (const segment of segments) {
        if (!segment || segment === '.' || segment === '..') return null;
        if (segment.length > 255) return null;
        if (!/^[a-zA-Z0-9\-_ a-zA-Z0-9À-ÿ.,&()']+$/.test(segment)) return null;
        if (segment.startsWith('.')) return null;
    }

    return segments.join('/') as ValidatedPath;
}

/** Fonction pour supprimer un fichier. Comme c'est une fonction admin, la validation est optionnel.
 * @param path : chemin à supprimer
 * @throws 404 error si le chemin n'existe pas.
 * @throws 400 error si la suppression échoue.
 */
export function deleteFile(path: string) {
    if (!existsSync(path)) {
        throw error(404, "Fichier ou dossier introuvable");
    }

    try {
        // Supprime un fichier ou un dossier (récursivement et de force)
        rmSync(path, { recursive: true, force: true });
    } catch (err) {
        throw error(400, "Impossible de supprimer le fichier ou le dossier");
    }
}
