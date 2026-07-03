import { readdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';
import { error } from '@sveltejs/kit';
import { type FileData, DocumentTypes } from '$lib/types/types.d';

//
// Service server side pour la gestion de fichiers
//

/** Fonction qui récupère l'ensemble des noms des fichiers dans un chemin.
 * @param relativePath : string du chemin à vérifier.
 * @throws 404 error si le chemin n'existe pas.
 * @return liste items [name, isDirectory] des fichiers.
 */
export function getFilesAt(relativePath: string): FileData[] {
    if (!existsSync(relativePath)) {
        throw error(404, "Dossier introuvable");
    }

    const files: FileData[] = readdirSync(relativePath).map(name => {
        const firstPart = name.split(" - ")[0];
        
        const detectedType = DocumentTypes 
            ? (Object.values(DocumentTypes).find(
                type => type.toLowerCase() === firstPart.toLowerCase()
              ) ?? DocumentTypes.AUTRE)
            : "AUTRE";

        return {
            name: name,
            isDirectory: statSync(join(relativePath, name)).isDirectory(),
            path: relativePath,
            type: detectedType as DocumentTypes
        };
    });

    return files;
}

/** Méthode pour normaliser un chemin.
 * @param s : string à normaliser.
 */
export const normalizePath = (s: string) => s.trim().toLowerCase().replaceAll(/[\s&\/\\#,+()$~%.'":*?<>{}\-_]+/g, '_');

/** Sécurise les chemins.
 * @param segment String du chemin (ex: ENSEEIHT/1A/SN).
 * @return chemin sécurisé.
 */
export function securePath(input: string): string | null {
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
        if (!/^[a-zA-Z0-9\-_ a-zA-Z0-9À-ÿ.+]+$/.test(segment)) return null;
        if (segment.startsWith('.')) return null;
    }

    return segments.join('/');
}
