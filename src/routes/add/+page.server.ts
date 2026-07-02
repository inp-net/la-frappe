import { resolve } from 'path';
import { redirect, fail } from '@sveltejs/kit';
import { StoragePaths, type DocumentInfo } from '$lib/types/types.d';
import { getFilesAt } from '$lib/server/fileService';
import type { PageServerLoad } from './$types';
import type { Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {

    const session = await locals.auth();

    if (!session) {
        throw redirect(303, '/');
    }

    const root = resolve(StoragePaths.DEFAULT_DB_LOCATION);
    const schoolList = getFilesAt(root);
    const schoolNames: string[] = schoolList.map(item => item.name);
    return {
        schoolNames,
        user: session.user
    };
};

export const actions = {
    add: async ({ request, fetch }) => {
        const formData = await request.formData();
        const documentFile : File = formData.get('document');
        if (documentFile.size == 0) {
            return fail(400, {
                message: 'Le fichier est manquant ou invalide.'
            });
        }

        try {
            const response = await fetch('/api/add-document', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-SvelteKit-Action': 'true'
                }
            });
            const data = await response.json();
            if (!response.ok) {
                return fail(response.status, {
                    message: data.message || data.error || 'Erreur lors de la sauvegarde.'
                });
            }
        } catch (err) {
            console.error("Erreur lors du transfert vers l'API :", err);
            return fail(500, {
                message: "Impossible de joindre le serveur d'API."
            });
        }
        throw redirect(303, '/browse'); 
    }
} satisfies Actions;
