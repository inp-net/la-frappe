import { existsSync, mkdirSync, appendFileSync } from 'fs';
import { resolve } from 'path';
import { LogCategory, StoragePaths } from '$lib/types/types.d'

/** Ajouter une ligne au fichier de log.
 * @param category: la catégorie de la log.
 * @param data: la valeur de la ligne
 */
export function NewLog(data: string, category: LogCategory) {
    const logDir = StoragePaths.DEFAULT_LOG_LOCATION;

    if (!existsSync(logDir)) {
        mkdirSync(logDir, { recursive: true })
    }

    const logPath = resolve(logDir, 'log.txt');
    const logValue = `[${category}] ${data}\n`
    appendFileSync(logPath, logValue);
}
