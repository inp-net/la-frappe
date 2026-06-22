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
    const files: FileData[] = readdirSync(relativePath).map(name => ({
        name: name,
        isDirectory: statSync(join(relativePath, name)).isDirectory(),
        path: relativePath,
        // Le nom du fichier définie son type, pas besoin de métadonnées
        type: (Object.values(DocumentTypes).find(
            type => type.toLowerCase() === name.split(" - ")[0].toLowerCase()
        ) ?? DocumentTypes.AUTRE) as DocumentTypes
    }));

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
    if (typeof input !== 'string' || !input || input.length > 100) {
        return null;
    }

    // Decode l'URL
    try {
        input = decodeURIComponent(input);
    } catch {
        return null;
    }

    // Supprime bytes null
    if (input.includes('\0')) return null;

    // Bloquage navigations
    if (/\.\./.test(input) || /\/\.\//.test(input) || /^\.\//.test(input)) {
        return null;
    }

    // Autoriser seulement caractères safe
    if (!/^[a-zA-Z0-9\-_ ]+$/.test(input)) {
        return null;
    }

    return input;
}
