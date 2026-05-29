import { readdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';
import { error } from '@sveltejs/kit';

/** Fonction qui récupère l'ensemble des noms des fichiers dans un chemin.
 * @param relativePath : string du chemin à vérifier.
 * @throws 404 error si le chemin n'existe pas.
 * @return liste items [name, isDirectory] des fichiers.
 */
export function getFilesAt(relativePath: string) {
    if (!existsSync(relativePath)) {
        throw error(404, "Dossier introuvable");
    }
    const items = readdirSync(relativePath).map(name => ({
        name,
        isDirectory: statSync(join(relativePath, name)).isDirectory()
    }));

    return items;
}
