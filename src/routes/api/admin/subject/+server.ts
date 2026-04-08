import { categoriesAccepted } from '$lib/store/filtre';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Permet de créer un dossier avec un json de metadata et les categories pour une matiere dans le dossier flat d'upload
export const POST: RequestHandler = async ({ request }) => {
	const data = await request.formData();
	const subject = data.get('subject') as string;
	if (!subject) {
		error(400, 'Matiere manquante.');
	}

	const storageDir = join(process.cwd(), 'static/uploads', subject);
	if (existsSync(storageDir)) {
		error(400, 'La matière existe déjà.');
	}

	try {
		mkdirSync(storageDir, { recursive: true });
	} catch (err) {
		console.error("Erreur d'écriture de dossier : ", err);
		error(500, 'Erreur lors de la création de dossier.');
	}

	const filePath = join(storageDir, 'metadata.json');
	try {
		const metaData = { paths: [] };
		writeFileSync(filePath, JSON.stringify(metaData, null, 4));
	} catch (err) {
		console.error("Erreur d'écriture du fichier de metadata : ", err);
		error(500, "Erreur lors de l'écriture du fichier metadata.");
	}

	categoriesAccepted.forEach((category) => {
		const categoryPath = join(storageDir, category);
		try {
			mkdirSync(categoryPath);
		} catch (err) {
			console.error(`Erreur d'écriture de dossier de categorie : ${categoryPath}\n`, err);
			error(500, 'Erreur lors de la création de dossier de categorie.');
		}
	});

	console.log(`Création de la matière ${subject}.`);
	return json({ message: 'Matière créée avec succès ' }, { status: 201 });
};
