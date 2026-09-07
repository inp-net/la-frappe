import { DEFAULT_SUBJECT_LOCATION } from '$lib/types/types.d';
import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { IsBan } from '$lib/server/authService';

async function createSubject(name: string, paths: string[]) {
    const path: string = join(DEFAULT_SUBJECT_LOCATION, name);
    const metadataPath = join(path, 'metadata.json');

    let writePath: string[];

    if (existsSync(path) && existsSync(metadataPath)) {
        // si l'UE existe déjà, on merge
        const existingPaths = JSON.parse(readFileSync(metadataPath));
        writePath = existingPaths.concat(paths);
    } else {
        mkdirSync(matadataPath, { recursive: true });
        writePath = paths;
    }

    writeFileSync(metadataPath, JSON.stringify(writePath));
}

/** Crée une UE dans le dossier flat. */
export const POST: RequestHandler = async ({ request, locals }) => {
    // Authentification
    const session = await locals.auth();
    if (!session || !session.user || !session.user.name) {
        return json({ error: 'Unauthorized', message: 'Vous devez être connecté' }, { status: 401 });
    }

    if (IsBan(session.user.name)) {
        return json({ 
            error: 'Forbidden', 
            message: "Vous êtes banni de La-Frappe. Si vous pensez que c'est une erreur, contactez net7"
        }, { status: 403 });
    }

    const data = await request.formData();
    const name: string = data.get('name');
    const paths: string[] = data.get('paths');

    try {
        await createSubject(name, paths);
        return json({ message: 'UE crée avec succès' }, { status: 201 });
    } catch (err: any) {
        const status = err.status || 500;
        const message = err.body?.message || "Une erreur interne est survenue.";
        return json({ message }, { status });
    }
};
