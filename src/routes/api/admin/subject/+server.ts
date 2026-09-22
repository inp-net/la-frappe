// import { DocumentType } from '$lib/types/types.d';
// import { normalizePath } from '$lib/server/fileService';
// import { error, json, type RequestHandler } from '@sveltejs/kit';
// import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
// import { join, resolve } from 'node:path';
//
// // Permet de créer un dossier avec un json de metadata et les categories pour une matiere dans le dossier flat d'upload
// export const POST: RequestHandler = async ({ request }) => {
//
//     // TODO gérer les admins en DB
//     return json({ 
//         error: 'Not Implemented', 
//         message: 'Cet endpoint est en cours de construction.' 
//     }, { status: 501 });
//
//     // ------
//
// 	const data = await request.formData();
// 	const rawSubject = data.get('subject') as string;
//
// 	if (!rawSubject) {
// 		error(400, 'Matiere manquante.');
// 	}
//
// 	const subject = normalizePath(rawSubject); // Normalisation du nom
//
// 	if (subject.length > 100) {
// 		error(400, 'Le nom de la matière ne doit pas dépasser 100 caractères.');
// 	}
//
// 	const storageDir = join(resolve('static/uploads'), subject);
//
// 	// vérification d'unicité stricte
// 	if (existsSync(storageDir)) {
// 		error(409, `La matière "${subject}" existe déjà`);
// 	}
//
// 	try {
// 		mkdirSync(storageDir, { recursive: true });
// 	} catch (err) {
// 		console.error(`Erreur d'écriture de dossier de la matière : ${storageDir}\n`, err);
// 		error(500, 'Erreur lors de la création de dossier.');
// 	}
//
// 	const filePath = join(storageDir, 'metadata.json');
// 	try {
// 		const metaData = { title: rawSubject, paths: [] };
// 		writeFileSync(filePath, JSON.stringify(metaData, null, 4));
// 	} catch (err) {
// 		console.error("Erreur d'écriture du fichier de metadata : ", err);
// 		error(500, "Erreur lors de l'écriture du fichier metadata.");
// 	}
//
// 	Object.values(DocumentType).forEach((category) => {
// 		const categoryPath = join(storageDir, category);
// 		try {
// 			mkdirSync(categoryPath);
// 		} catch (err) {
// 			console.error(`Erreur d'écriture du dossier de la categorie : ${categoryPath}\n`, err);
// 			error(500, 'Erreur lors de la création de dossier de categorie.');
// 		}
// 	});
//
// 	console.log(`Création de la matière ${subject}.`);
// 	return json({ message: 'Matière créée avec succès ' }, { status: 201 });
// };
//
// // Permet de mettre à jour un matiere, crée le json s'il n'existe pas et les catégories s'il en manque
// export const PUT: RequestHandler = async ({ request }) => {
// 	const data = await request.formData();
// 	const rawSubject = data.get('subject') as string;
// 	if (!rawSubject) {
// 		error(400, 'Matiere manquante.');
// 	}
//
// 	const subject = normalizePath(rawSubject);
// 	const storageDir = join(resolve('static/uploads'), subject);
// 	if (!existsSync(storageDir)) {
// 		error(400, "La matière n'existe pas.");
// 	}
//
// 	const filePath = join(storageDir, 'metadata.json');
// 	if (!existsSync(filePath)) {
// 		try {
// 			const metaData = { paths: [] };
// 			writeFileSync(filePath, JSON.stringify(metaData, null, 4));
// 		} catch (err) {
// 			console.error("Erreur d'écriture du fichier de metadata : ", err);
// 			error(500, "Erreur lors de l'écriture du fichier metadata.");
// 		}
// 	}
//
// 	Object.values(DocumentType).forEach((category) => {
// 		const categoryPath = join(storageDir, category);
// 		if (!existsSync(categoryPath)) {
// 			try {
// 				mkdirSync(categoryPath);
// 			} catch (err) {
// 				console.error(`Erreur d'écriture de dossier de la categorie : ${categoryPath}\n`, err);
// 				error(500, 'Erreur lors de la création de dossier de categorie.');
// 			}
// 		}
// 	});
//
// 	console.log(`Mise à jour de la matière ${subject}.`);
// 	return json(
// 		{ message: 'Matière mise à jour avec succès. Ne concerne pas les liens symboliques.' },
// 		{ status: 201 }
// 	);
// };
