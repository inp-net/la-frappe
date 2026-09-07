import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const actions = {
    addSubjects: async ({ request, fetch }) => {
        const formData = await request.formData();
        const documentFile = formData.get('subjects');
        
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
                        name: ue.name,
                        paths: ue.paths
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
    }
} satisfies Actions;
