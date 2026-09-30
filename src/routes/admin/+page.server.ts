import type { Actions } from './$types';
import { getFilesAt, securePath, type ValidatedPath } from '$lib/server/fileService';
import { constructTree } from '$lib/server/dbService';
import { StoragePaths } from '$lib/types/types.d';
import { fail, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getBanList, ban, unban } from '$lib/server/authService';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.isAdmin) {
        throw error(403, 'Access denied');
    }

    // récupérer les UEs
    const uePath: ValidatedPath | null = securePath(StoragePaths.DEFAULT_SUBJECT_LOCATION);
    let ue;
    if (uePath) {
        ue = getFilesAt(uePath);
    }

    // récupérer les identifiants des bannies
    const bans: string[] = getBanList();


    return {
        ue: ue,
        bans: bans
    };
};

export const actions = {
    addSubjects: async ({ request, fetch }) => {
        const formData = await request.formData();
        const documentFile = formData.get('subjects');
        const merge = formData.get('merge') === 'on';
        
        if (!documentFile || !(documentFile instanceof File) || documentFile.size === 0) {
            return fail(400, {
                message: 'Le fichier est manquant ou invalide.'
            });
        }

        try {
            const fileContent = await documentFile.text();
            const doc = JSON.parse(fileContent);

            for (const ue of doc) {
                const response = await fetch('/api/make-subject', {
                    method: 'POST',
                    body: JSON.stringify({
                        name: ue.slug,
                        paths: ue.paths,
                        merge: merge
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    console.error(`Impossible de crée (make-subject) : ${ue.name}`);
                }
            }
        } catch (err) {
            console.error("Erreur lors du transfert vers l'API :", err);
            return fail(500, {
                message: "Impossible de joindre le serveur d'API."
            });
        }
    },
    editMetadata: async ({ request, fetch }) => {
        const formData = await request.formData();

        const originalName = formData.get('originalName')?.toString().trim();
        const newName = formData.get('newName')?.toString().trim();

        const rawPaths = formData.getAll('paths');
        const paths = rawPaths
            .map((p) => p.toString().trim())
            .filter((p) => p.length > 0);

        if (!originalName) {
            return fail(400, {
                message: "Le nom de l'UE d'origine est manquant."
            });
        }

        const payload = {
            oldName: originalName,
            newName: newName,
            metadata: {
                paths
            }
        };

        try {
            const response = await fetch('/api/metadata/set', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => null);
                return fail(response.status, {
                    message: errData?.message || 'Erreur lors de la mise à jour des métadonnées.'
                });
            }

            await constructTree();

            return {
                success: true,
                message: 'Métadonnées et dossier mis à jour avec succès.'
            };
        } catch (err) {
            console.error('Erreur lors de l’appel vers /api/metadata/set :', err);
            return fail(500, {
                message: "Impossible de joindre l'API de métadonnées."
            });
        }
    },
    ban: async ({ request }) => {
        const formData = await request.formData();
        const name: string = formData.get('name') as string;
        if (name)
            ban(name);
    },
    unban: async ({ request }) => {
        const formData = await request.formData();
        const name: string = formData.get('name') as string;
        if (name)
            unban(name);
    }
} satisfies Actions;
