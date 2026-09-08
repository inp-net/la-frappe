import { StoragePaths } from '$lib/types/types.d';
import { json, type RequestHandler } from '@sveltejs/kit';
import { IsBan } from '$lib/server/authService';
import { createSubject, constructTree } from '$lib/server/dbService';

export const POST: RequestHandler = async ({ request, locals }) => {
    const session = await locals.auth();
    if (!session || !session.user || !session.user.name) {
        return json({ error: 'Unauthorized', message: 'Vous devez être connecté' }, { status: 401 });
    }

    if (IsBan(session.user.name)) {
        return json({ 
            error: 'Forbidden', 
            message: "Vous êtes banni."
        }, { status: 403 });
    }

    try {
        const body = await request.json();
        const name = body.name ?? '';
        const safeName = name.replace(/[/\\?%*:|"<>]/g, '-');
        const paths = body.paths ?? [];

        await createSubject(safeName, paths);
        await constructTree();
        return json({ message: 'UE crée avec succès' }, { status: 201 });
    } catch (err: any) {
        console.error("FS Error:", err);
        const status = err.status || 500;
        const message = err.message || "Une erreur interne est survenue.";
        return json({ message }, { status });
    }
};
