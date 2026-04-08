import { categoriesAccepted } from '$lib/store/filtre';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';

// permet d'upload un pdf dans une categorie d'une matiere deja existente
// ça fait peur mais c'est assez simple, me demander si besoin alexandre à net7
export const POST: RequestHandler = async ({ request }) => {
	const data = await request.formData();

	// -- Verification du fichier --
	const file = data.get('file') as File;
	if (!file) {
		error(400, 'Fichier manquant.');
	}
	// header
	if (file.type !== 'application/pdf') {
		error(400, "Le fichier n'est pas un pdf.");
	}
	// extension
	const fileData: string[] = file.name.toLowerCase().split('.');
	const ext = fileData.pop();
	if (ext !== 'pdf' && fileData.length !== 1) {
		error(400, "Le fichier n'est pas un pdf");
	}
	// signature
	// On convertit le fichier en buffer pour lire les premiers octets
	const arrayBuffer = await file.arrayBuffer();
	const uint8Array = new Uint8Array(arrayBuffer);
	// Un PDF commence par %PDF (25 50 44 46 en ASCII/Hex)
	const signature = Array.from(uint8Array.slice(0, 4))
		.map((byte) => byte.toString(16))
		.join('');

	if (signature !== '25504446') {
		error(400, "Le fichier n'est pas un pdf.");
	}
	// Si on arrive ici, le fichier est validé
	console.log(`Fichier validé : ${file.name} (${file.size} octets)`);

	// -- Verification des autres parametres --
	const category = data.get('category') as string;
	if (!category) {
		error(400, 'Catégorie du document manquante.');
	}

	if (!categoriesAccepted.includes(category)) {
		error(400, 'Catégorie inconnue.');
	}
	const subject = data.get('subject') as string;
	if (!subject) {
		error(400, 'Sujet lié au document manquant.');
	}
	const year = data.get('year') as string;
	const regexYear = /^[1-9][0-9]{3}$/; // vérif année de 1800 à 9999, évite les prbls de convertions
	if (!year) {
		error(400, 'Année manquante.');
	} else if (!regexYear.test(year)) {
		error(400, "Mauvais format d'année (1800-9999).");
	}
	const fileNumber = data.get('number') as string;
	const regexNumber = /^(100|[1-9]?[0-9])$/; // vérif numéro de td/partiel/etc... de 0 à 100
	if (!fileNumber) {
		error(400, 'Numéro manquant.');
	} else if (!regexNumber.test(fileNumber)) {
		error(400, 'Mauvais format de numéro (0-100).');
	}
	const isCorrected = !!data.get('isCorrected') as Boolean;
	let correction = '';
	if (isCorrected) {
		correction = '_corrige';
	}

	const MAX_SIZE = 10 * 1024 * 1024; // 10 Mo en octets, 10 * 2^10 * 2^10

	if (file.size > MAX_SIZE) {
		error(400, 'Fichier trop lourd (max 10 Mo).');
	}

	// --- Définir le chemin de stockage ---
	const subjectDir = join(process.cwd(), 'static/uploads', subject);
	if (!existsSync(subjectDir)) {
		error(
			400,
			'Chemin de la matiere non existant. Verifier les informations ou demander à un admin (net7) de créer la matière.'
		);
	}

	const metaPath = join(subjectDir, 'metadata.json');
	// vérifier qu'il y a un fichier de metadata sinon le dossier du fichier n'apparaitra jamais dans la frappe
	if (!existsSync(metaPath)) {
		console.error(`Absence du fichier de metadata : ${metaPath}`);
		error(500, "Fichier de metadata non existant, c'est pas normal contacte net7.");
	}

	let fileName = `${category}_${fileNumber}_${year}${correction}.pdf`;
	const storageDir = join(subjectDir, category);
	if (!existsSync(storageDir)) {
		error(
			400,
			'Chemin de la categorie non existant. Verifier les informations ou demander à un admin (net7) de créer la catégorie.'
		);
	}
	let filePath = join(storageDir, fileName);

	let count = 1;
	const maximum = 30;
	while (count < 100 && existsSync(filePath)) {
		fileName = `${category}_${fileNumber}_${year}${correction}_${count}.pdf`;
		filePath = join(storageDir, fileName);
		count++;
	}

	if (count >= maximum) {
		error(400, 'Trop de fichiers de la même catégorie et matière existants.');
	}

	// Ecriture du pdf
	try {
		const buffer = Buffer.from(uint8Array);
		writeFileSync(filePath, buffer);
		console.log(`Fichier sauvegardé sous : ${filePath}`);
	} catch (err) {
		console.error(`Erreur d'écriture du fichier : ${filePath}\n`, err);
		error(500, 'Erreur lors de la sauvegarde sur le disque du serveur.');
	}

	return json({ message: 'Fichier ajouté avec succès' }, { status: 201 });
};
