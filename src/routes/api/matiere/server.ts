import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
    const { name, filiereId } = await request.json();

    if (!name || !filiereId) {
        return json({ error: 'Champs manquants' }, { status: 400 });
    }

    console.log('Logique : Création de la matière ${name} dans la filière ${filiereId}');

    return json({ message: 'Matière créée avec succès '}, { status: 201 });
}