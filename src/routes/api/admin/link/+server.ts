import { error, json, type RequestHandler } from '@sveltejs/kit';
import { writeFileSync, existsSync, readFileSync } from 'fs';
import { join, resolve } from 'path';

// permet d'ajouter dans les paths les ecole/filiere etc... qui utilisent cette matiere
export const POST: RequestHandler = async ({ request }) => {
	const data = await request.formData();

	const school = data.get('school') as string;
	if (!school) {
		error(400, 'Ecole liée au document manquante.');
	}
	const major = data.get('major') as string;
	if (!major) {
		error(400, 'Majeure liée au document manquante.');
	}
	const subject = data.get('subject') as string;
	if (!subject) {
		error(400, 'Sujet lié au document manquant.');
	}

	if (subject.length > 100 || major.length > 100 || school.length > 100) {
		error(400, 'Les informations ne doivent pas dépasser 100 caractères chacune.');
	}

	const subjectDir = join(resolve('static/uploads'), subject);
	if (!existsSync(subjectDir)) {
		error(400, 'Chemin de la matiere non existant.');
	}
	const metaPath = join(subjectDir, 'metadata.json');
	if (!existsSync(metaPath)) {
		console.error(`Absence du fichier de metadata : ${metaPath}`);
		error(400, 'Fichier de metadata non existant.');
	}

	// Lire le fichier json de metadata
	let metaData;
	try {
		metaData = JSON.parse(readFileSync(metaPath, 'utf-8'));
	} catch (err) {
		console.error(`Erreur de lecture d'un fichier de metadata : ${metaPath}\n`, err);
		error(500, 'Erreur lors de la lecture sur le disque.');
	}

	// Verifier que le json de metadata ne contient pas deja ce chemin
	const newPath = join(school, major);
	if (metaData.paths.includes(newPath)) {
		error(400, 'Le lien symbolique existe déjà.');
	}

	// Ajouter le nouveau chemin au fichier de metadata
	// TODO : PERMETTRE DE METTRE PLEINS D'AUTRES CHOSES QUE JUSTE MATIERE ET ECOLE
	metaData.paths.push(newPath);

	// vérif inutile ?
	if (!metaData) {
		error(500, 'Metadonnee absente ou vide.');
	}

	try {
		writeFileSync(metaPath, JSON.stringify(metaData, null, 4));
	} catch (err) {
		console.error(`Erreur d'écriture d'un fichier de metadata : ${metaPath}\n`, err);
		error(500, 'Erreur lors de la sauvegarde sur le disque.');
	}

	return json({ message: 'Fichier actualisé avec succès' }, { status: 201 });
};
