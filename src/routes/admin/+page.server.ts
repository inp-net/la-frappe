import type { Actions } from './$types';

export const actions = {
    addSubjects: async ({ request, fetch }) => {
        const formData = await request.formData();
        const documentFile : File = formData.get('subjects');
        if (documentFile.size == 0) {
            return fail(400, {
                message: 'Le fichier est manquant ou invalide.'
            });
        }

        try {
            const response = await fetch('/api/make-subject', {
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
