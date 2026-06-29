import { StoragePaths } from '$lib/types/types.d';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { dirname } from 'path';

export function IsBan(name: string) : boolean {
    const banlistPath = StoragePaths.DEFAULT_BANLIST_FILE;

    const dir = dirname(banlistPath);
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
    }

    if (!existsSync(banlistPath)) {
        const initialData: string[] = [];
        writeFileSync(banlistPath, JSON.stringify(initialData, null, 2), 'utf8');
        return false;
    }

    try {
        const fileContent = readFileSync(banlistPath, 'utf8');
        const bannedNames: string[] = JSON.parse(fileContent);

        return bannedNames.some(
            bannedName => bannedName.toLowerCase() === name.toLowerCase()
        );
    } catch (error) {
        return false;
    }
}
