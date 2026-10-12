import { StoragePaths } from '#lib/types/types.ts';
import type { User } from '@auth/sveltekit';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { dirname } from 'path';

/** Génère le fichier banlist.json si il n'existe pas.
 * @return balistPath: string position du fichier.
 */
export function verifyPath() {
    const banlistPath = StoragePaths.DEFAULT_BANLIST_FILE;

    const dir = dirname(banlistPath);
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
        const initialData: string[] = [];
        writeFileSync(banlistPath, JSON.stringify(initialData, null, 2), 'utf8');
    }

    return banlistPath;
}

export function isBan(user: User): boolean {
    const banlistPath = verifyPath()

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
    const banlistPath = verifyPath()

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
    const banlistPath = verifyPath()

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
    const banlistPath = verifyPath()

    try {
        const fileContent = readFileSync(banlistPath, 'utf8');
        const bannedNames: string[] = JSON.parse(fileContent);
        return bannedNames;
    } catch (error) {
        return [];
    }
}
