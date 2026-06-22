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
