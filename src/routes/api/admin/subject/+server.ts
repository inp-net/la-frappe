import { error, json, type RequestHandler } from '@sveltejs/kit';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.formData();
	const subject = data.get('subject') as string;
	if (!subject) {
		error(400, 'Matiere manquante.');
	}

	const storageDir = join(process.cwd(), 'static/uploads', subject);

	if (!existsSync(storageDir)) {
		try {
			mkdirSync(storageDir, { recursive: true });
		} catch (err) {
			console.error("Erreur d'écriture de dossier : ", err);
			error(500, 'Erreur lors de la création de dossier.');
		}
		console.log(`Création de la matière ${subject}.`);
	} else {
		error(400, 'La matière existe déjà.');
	}

	const filePath = join(storageDir, 'metadata.json');
	try {
		const metaData = { "paths":[] }
		writeFileSync(filePath, JSON.stringify(metaData, null, 4));
	} catch (err) {
		console.error("Erreur d'écriture du fichier de metadata : ", err);
		error(500, "Erreur lors de l'écriture du fichier metadata.");
	}

	return json({ message: 'Matière créée avec succès ' }, { status: 201 });
};
