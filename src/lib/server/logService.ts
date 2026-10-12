import { existsSync, mkdirSync, appendFileSync } from 'fs';
import { resolve } from 'path';
import { LogCategory, StoragePaths } from '#lib/types/types.js'

/** Ajouter une ligne au fichier de log.
 * @param category: la catégorie de la log.
 * @param data: la valeur de la ligne
 */
export function NewLog(data: string, category: LogCategory) {
    const logDir = resolve(StoragePaths.DEFAULT_LOG_LOCATION);

    if (!existsSync(logDir)) {
        mkdirSync(logDir, { recursive: true })
    }

    const logPath = resolve(logDir, 'log.txt');
    const timestamp = new Date().toISOString();
    const logValue = `[${timestamp}] [${category}] ${data}\n`
    appendFileSync(logPath, logValue);
}
