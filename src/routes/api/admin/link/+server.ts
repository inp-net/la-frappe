import { error, json, type RequestHandler } from '@sveltejs/kit';
import { writeFileSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';

// ça fait peur mais c'est assez simple, me demander si besoin alexandre à net7
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

    const subjectDir = join(process.cwd(), 'static/uploads', subject);
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

	// Actualiser le fichier de metadata

	// Ajouter le nouveau chemin au fichier de metadata
    // TODO : PERMETTRE DE METTRE PLEINS D'AUTRES CHOSES QUE JUSTE MATIERE ET ECOLE
	metaData.paths.push(join(school, major));

	// vérif inutile ?
	if (!metaData) {
		error(500, 'Metadonnee absente ou vide.');
	}

    // TODO : EMPECHER D'ECRIRE UNE DEUXIEME FOIS LE CHEMIN S'IL EXISTE DEJA
	try {
		writeFileSync(metaPath, JSON.stringify(metaData, null, 4));
	} catch (err) {
		console.error(`Erreur d'écriture d'un fichier de metadata : ${metaPath}\n`, err);
		error(500, 'Erreur lors de la sauvegarde sur le disque.');
	}

	return json({
		success: true,
		message: 'Fichier actualisé avec succès'
	});
};
