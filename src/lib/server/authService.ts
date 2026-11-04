import { StoragePaths } from '#lib/types/types.js';
import type { User } from '@auth/sveltekit';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { dirname } from 'path';

/** Génère le fichier s'il n'existe pas avec la valeur initiale fournie. */
 export function verifyPath<T>(path: StoragePaths, initialData: T = {} as T): string {
    if (!existsSync(path)) {
        const dir = dirname(path);
        if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true });
        }
        writeFileSync(path, JSON.stringify(initialData, null, 2), 'utf8');
    }

    return path;
}

export function isBan(user: User): boolean {
    const banlistPath = verifyPath(StoragePaths.DEFAULT_BANLIST_FILE, []);

    try {
        const fileContent = readFileSync(banlistPath, 'utf8');
        const bannedNames: string[] = JSON.parse(fileContent);

        return bannedNames.some(
            bannedName => bannedName.toLowerCase() === user.nickname?.toLowerCase()
        );
    } catch (error) {
        return false;
    }
}

export function ban(name: string) {
    const banlistPath = verifyPath(StoragePaths.DEFAULT_BANLIST_FILE, []);

    try {
        const fileContent = readFileSync(banlistPath, 'utf8');
        const bannedNames: string[] = JSON.parse(fileContent);
        if (!bannedNames.includes(name)) {
            bannedNames.push(name);
            writeFileSync(banlistPath, JSON.stringify(bannedNames))
        }
    } catch (error) {
        return false;
    }
}

export function unban(name: string) {
    const banlistPath = verifyPath(StoragePaths.DEFAULT_BANLIST_FILE, []);

    try {
        const fileContent = readFileSync(banlistPath, 'utf8');
        const bannedNames: string[] = JSON.parse(fileContent);
        console.log(bannedNames);
        if (bannedNames.includes(name)) {
            const newlist = bannedNames.filter(n => n !== name);
            writeFileSync(banlistPath, JSON.stringify(newlist))
        }
    } catch (error) {
        return false;
    }
}

export function getBanList(): string[] {
    const banlistPath = verifyPath(StoragePaths.DEFAULT_BANLIST_FILE, []);

    try {
        const fileContent = readFileSync(banlistPath, 'utf8');
        const bannedNames: string[] = JSON.parse(fileContent);
        return bannedNames;
    } catch (error) {
        return [];
    }
}

export function setConfig(key: string, value: string) {
    const configPath = verifyPath(StoragePaths.DEFAULT_CONFIG_FILE, {});

    try {
        let config: Record<string, string> = {};

        try {
            const fileContent = readFileSync(configPath, 'utf8');
            config = JSON.parse(fileContent);
        } catch {
            return;
        }

        config[key] = value;
        writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
    } catch (err) {
        console.error(`Impossible d'écrire la configuration ${key}:`, err);
    }
}

export function getConfig(key: string): string | null {
    const configPath = verifyPath(StoragePaths.DEFAULT_CONFIG_FILE, {});

    try {
        const fileContent = readFileSync(configPath, 'utf8');
        const config: Record<string, string> = JSON.parse(fileContent);
        return config[key] ?? null;
    } catch (err) {
        console.error(`Impossible de lire la configuration ${key}:`, err);
        return null;
    }
}
