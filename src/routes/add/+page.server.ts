import { resolve } from 'path';
import { getFilesAt } from '$lib/tools/utils'
import { FOLDER } from "$lib/constants/index"
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    const root = resolve(FOLDER.DEFAULT_DB_LOCATION);
    const schoolList = getFilesAt(root);
    const schoolNames: string[] = schoolList.map(item => item.name);
    return {
        schoolNames
    };
};
