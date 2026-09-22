import { json, type RequestHandler } from '@sveltejs/kit';
import { IsBan } from '$lib/server/authService';
import { createSubject, constructTree } from '$lib/server/dbService';

export const POST: RequestHandler = async ({ request, locals }) => {
    const session = await locals.auth();
    if (!session || !session.user || !session.user.name) {
        return json({ error: 'Unauthorized', message: 'Vous devez être connecté' }, { status: 401 });
    }

    if (!locals.isAdmin) {
        return json({ error: 'Unauthorized', message: 'Vous devez être admin' }, { status: 403 });
    }

    if (IsBan(session.user.name)) {
        return json({ 
            error: 'Forbidden', 
            message: "Vous êtes banni."
        }, { status: 403 });
    }

    try {
        const body = await request.json();
        console.log(body);
        const name = body.name ?? '';
        const safeName = name.replace(/[/\\?%*:|"<>]/g, '-');
        const paths = body.paths ?? [];
        const merge = body.merge ?? false;

        createSubject(safeName, paths, merge);
        await constructTree();
        return json({ message: 'UE crée avec succès' }, { status: 201 });
    } catch (err: any) {
        console.error("FS Error:", err);
        const status = err.status || 500;
        const message = err.message || "Une erreur interne est survenue.";
        return json({ message }, { status });
    }
};
