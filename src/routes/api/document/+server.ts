import { error, json, type RequestHandler } from '@sveltejs/kit';
import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';

export const POST: RequestHandler = async ({ request }) => {

    const data = await request.formData();

    // -- Verification du fichier --
    const file = data.get('file') as File;
    if (!file) {
        error(400, "Fichier manquant.");
    }
    // header
    if (file.type !== 'application/pdf') {
        error(400, "Le header indique que ce n'est pas un PDF");
    }
    // extension
    const fileData: string[] = file.name.toLowerCase().split('.');
    const ext = fileData.pop();
    if (ext !== 'pdf' && fileData.length !== 1) {
        error(400, "L'extension doit être .pdf");
    }
    // signature
    // On convertit le fichier en buffer pour lire les premiers octets
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    // Un PDF commence par %PDF (25 50 44 46 en ASCII/Hex)
    const signature = Array.from(uint8Array.slice(0, 4))
        .map(byte => byte.toString(16))
        .join('');

    if (signature !== '25504446') {
        error(400, "Signature de fichier invalide : ce n'est pas un vrai PDF");
    }
    // Si on arrive ici, le fichier est validé
    console.log(`Fichier validé : ${file.name} (${file.size} octets)`);

    // -- Verification des autres parametres --
    const category = data.get('category') as string;
    if (!category) {
        error(400, "Catégorie du document manquante.");
    }
    const categoriesAccepted = ['partiel', 'fiche', 'td', 'autre', 'notes_de_cours', 'dm', 'tp', 'be', 'diapositives_de_cours'];
    if (!categoriesAccepted.includes(category)) {
        error(400, "Catégorie inconnue.");
    }
    const school = data.get('school');
    if (!school) {
        error(400, "Ecole liée au document manquante.");
    }
    const major = data.get('major');
    if (!major) {
        error(400, "Majeure liée au document manquante.");
    }
    const subject = data.get('subject') as string;
    if (!subject) {
        error(400, "Sujet lié au document manquant.");
    }
    const year = data.get('year') as string;
    const regexYear = /^[1-9][0-9]{3}$/;  // vérif année de 1800 à 9999, évite les prbls de convertions
    if (!year) {
        error(400, "Année manquante.");
    } else if (!regexYear.test(year)) {
        error(400, "Mauvais format d'année (1800-9999).");
    }
    const fileNumber = data.get('number') as string;
    const regexNumber = /^(100|[1-9]?[0-9])$/;  // vérif numéro de td/partiel/etc... de 0 à 100
    if (!fileNumber) {
        error(400, "Numéro manquant.");
    } else if (!regexNumber.test(fileNumber)) {
        error(400, "Mauvais format de numéro (0-100).");
    }
    const isCorrected = !!data.get('isCorrected') as Boolean;
    let correction = '';
    if (isCorrected) {
        correction = "_corrige";
    }

<<<<<<< HEAD
    const MAX_SIZE = 10 * 1024 * 1024; // 10 Mo en octets, 10 * 2^10 * 2^10
=======
    // TODO vérifier que l'extension du fichier est valide (pdf)

    if (!file) {
        return json({ error: 'Aucun fichier reçu '}, { status : 400 });
    }

    const MAX_SIZE = 10 * 1024 * 1024; // 10 Mo en octets
>>>>>>> d3c7a87 (refactor: ajout TODO vérifier l'extension fichier)

    if (file.size > MAX_SIZE) {
        error(400, "Fichier trop lourd (max 10 Mo).");
    }

    // --- Définir le chemin de stockage ---
    const storageDir = join(process.cwd(), 'static/uploads', subject);

    if (!existsSync(storageDir)) {
        error(400, "Chemin non existant.");
    }

    let fileName = `${category}_${fileNumber}_${year}${correction}.pdf`;
    let filePath = join(storageDir, fileName);
    let count = 1;
    while (count < 100 && existsSync(filePath)) {
        fileName = `${category}_${fileNumber}_${year}${correction}_${count}.pdf`;
        filePath = join(storageDir, fileName);
        count++;
    }

    if (count >= 100) {
        error(400, "Trop de fichiers de la même catégorie et matière existants.")
    }

    // --- ECRITURE DU FICHIER ---
    try {
        const buffer = Buffer.from(uint8Array);

        writeFileSync(filePath, buffer);

        console.log(`Fichier sauvegardé sous : ${filePath}`);

        return json({
            success: true, message: "Fichier sauvegardé avec succès"
        });
    } catch (err) {
        console.error("Erreur d'écriture : ", err);
        return json({ error: "Erreur lors de la sauvegarde sur le disque" }, { status: 500 });
    }
}
