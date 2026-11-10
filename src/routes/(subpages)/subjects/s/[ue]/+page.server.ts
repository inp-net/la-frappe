import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {

    const id: string = params.ue;

    const projet: Projet | undefined = projects.find((p: Projet) => p.id === id);

    // Si le projet n'existe pas, on renvoie une erreur 404
    if (!projet) {
        throw error(404, 'Projet introuvable');
    }

    return {
        projet
    };
};

