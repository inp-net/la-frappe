import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
    const data = await request.formData();

    const file = data.get('file') as File;
    const title = data.get('title');
    const type = data.get('type'); // "PARTIEL", "TD", etc.
    const subjectId = data.get('subjectId');
  
    // Validation du type selon les critères
    const validTypes = ['partiel', 'fiche', 'td', 'autre', 'notes de cours', 'dm', 'tp', 'be', 'diapositives de cours'];
    if (!validTypes.includes(type as string)) {
        return json({ error: 'Type de document invalide' }, { status: 400 });
    }

    if (!file) {
        return json({ error: 'Aucun fichier reçu '}, { status : 400 });
    }

    console.log('Enregistrement du fichier ${file.name} pour la matière ${subjectId}');

    return json({
        message: 'Document ajouté !',
        details: { title, type, fileName: file.name }
    }, { status: 201 })
}