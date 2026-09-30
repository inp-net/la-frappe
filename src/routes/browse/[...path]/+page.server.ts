import type { PageServerLoad } from './$types';
import { join } from 'path';
import { redirect, fail } from '@sveltejs/kit';
import { type FileData, StoragePaths, type UploadDocument, DocumentType } from '$lib/types/types.d';
import { getFilesAt, type ValidatedPath } from '$lib/server/fileService';
import type { Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {

    const session = await locals.auth();

    console.log(session);

    if (!session) {
        throw redirect(303, '/');
    }

    const currentPath: string = params.path || "";
    const fullPath: ValidatedPath = join(process.cwd(), StoragePaths.DEFAULT_DB_LOCATION, currentPath) as ValidatedPath;
    const files: FileData[] = getFilesAt(fullPath);

    return {
        files,
        currentPath,
        user: session.user
    };
};

export const actions = {
    addDocument: async({ request, fetch, params }) => {
        const form = await request.formData();
        const formDocument: File = form.get('document') as File;
        if (formDocument.size == 0) {
            return fail(400, {
                message: 'Le fichier est manquant ou invalide.'
            });
        }

        const currentPath: string = params.path || "";
        const fullPath: ValidatedPath = join(process.cwd(), StoragePaths.DEFAULT_DB_LOCATION, currentPath) as ValidatedPath;

        form.append("path", fullPath);

        try {
            const response = await fetch('/api/add-document', {
                method: 'POST',
                body: form,
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
    }
} satisfies Actions;
