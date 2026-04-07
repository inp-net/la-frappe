import { json, type RequestHandler } from '@sveltejs/kit';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

export const POST: RequestHandler = async ({ request }) => {
    const data = await request.formData();
    const file = data.get('file') as File;

    // --- VERIFICATION 1 : Header de la requête ---
    // Le navigateur/client annonce que c'est un PDF
    if (file.type !== 'application/pdf') {
        return json({ error: "Le header indique que ce n'est pas un PDF" }, { status : 400 });
    }

    // --- VERIFICATION 2 : Extension du fichier ---
    if (!file.name.toLowerCase().endsWith('.pdf')) {
        return json({ error: "L'extension doit être .pdf" }, { status:400 });
    }

    // --- VERIFICATION 3 : Signature du Fichier ---
    // On convertit le fichier en buffer pour lire les premiers octets
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Un PDF commence par %PDF (25 50 44 46 en ASCII/Hex)
    const signature = Array.from(uint8Array.slice(0, 4))
        .map(byte => byte.toString(16))
        .join('');
    
    if (signature !== '25504446') {
        return json({ error: "Signature de fichier invalide : ce n'est pas un vrai PDF" }, { status: 400 });
    }

    // Si on arrive ici, le fichier est validé
    console.log(`Fichier validé : ${file.name} (${file.size} octets)`);

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

    const MAX_SIZE = 10 * 1024 * 1024; // 10 Mo en octets

    if (file.size > MAX_SIZE) {
        return json({ error: "Fichier trop lourd (max 10 Mo)" }, { status: 400 });
    }

    // --- Définir le chemin de stockage ---
    // On va créer un dossier 'storage' à la racine du projet pour ne pas mélanger avec le code
    const storageDir = join(process.cwd(), 'static', 'uploads', subjectId, type);

    // Créer les dossiers récursivement s'ils n'existent pas
    if (!existsSync(storageDir)) {
        mkdirSync(storageDir, { recursive : true })
    }

    // Nettoyer le nom du fichier pour éviter les problèmes d'espaces/d'accents
    const fileName = `${file.name.replaceAll(' ', '_')}`;
    const filePath = join(storageDir, fileName);

    // --- ECRITURE DU FICHIER ---
    try {
        const buffer = Buffer.from(uint8Array);
        writeFileSync(filePath, buffer);

        console.log(`Fichier sauvegardé sous : ${filePath}`);

        return json({
            success: true,
            path: `/uploads/${subjectId}/${type}/${fileName}`, // URL Accessible
            message: "Fichier sauvegardé avec succès"
        });
    } catch (err) {
        console.error("Erreur d'écriture : ", err);
        return json({ error: "Erreur lors de la sauvegarde sur le disque" }, { status: 500 });
    }
}