import type { PageServerLoad } from './$types';
import { join } from 'path';
import { redirect, fail, error } from '@sveltejs/kit';
import { type FileData, StoragePaths, type UploadDocument, DocumentType } from '$lib/types/types';
import { getFilesAt, securePath, deleteFile, type ValidatedPath } from '$lib/server/fileService';
import type { Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
    const session = await locals.auth();
    if (!session) {
        throw redirect(303, '/');
    }

    const rawPath = params.path || "";
    const safeRelativePath = securePath(rawPath);

    if (rawPath !== "" && !safeRelativePath) {
        throw error(400, "Invalid file path");
    }

    const fullPath = join(process.cwd(), StoragePaths.DEFAULT_DB_LOCATION, safeRelativePath || "") as ValidatedPath;
    const files: FileData[] = getFilesAt(fullPath);

    return {
        files,
        currentPath: safeRelativePath || "",
        user: session.user,
        admin: locals.isAdmin
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
    },
    delete: async({ request, locals }) => {
        if (!locals.isAdmin) {
            return fail(403, { message: 'Accès refusé.' });
        }

        const formData = await request.formData();
        const path: string | null = join(StoragePaths.DEFAULT_DB_LOCATION, formData.get('path') as string);
        if (path)
            deleteFile(path);
    }
} satisfies Actions;
