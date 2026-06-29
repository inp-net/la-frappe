import { error, json, type RequestHandler } from '@sveltejs/kit';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';
import { DocumentTypes, StoragePaths, type DocumentInfo } from '$lib/types/types.d';
import { securePath } from '$lib/server/fileService';

/** Taille maximale du fichier 10mo */
const MAX_FILE_SIZE = 10 * 1024 * 1024;
/** Position par défaut de la DB. */
const BASE_DIR = resolve(StoragePaths.DEFAULT_DB_LOCATION);

/** Fonction qui vérifie l'intégrité des métadonnées.
 * @param fields : DocumentInfo données du formulaires.
 * @throw error 400 si invalide.
 */
function validateMetadata(fields: DocumentInfo) {
    const validated = {} as Record<string, string>;
    
    for (const [key, value] of Object.entries(fields)) {
        if (!value || typeof value !== 'string') {
            error(400, `Missing or invalid ${key}`);
        }
        
        const safe = securePath(value);
        if (!safe) {
            error(400, `Invalid characters in ${key}`);
        }
        
        validated[key] = safe;
    }

    console.log(validated);

    // Valider les catégories séparéments car c'est un enum
    const documentTypes = Object.values(DocumentTypes) as string[];
    console.log(documentTypes);
    console.log(validated.category);
    if (!documentTypes.includes(validated.category)) {
        error(400, "Invalid category");
    }

    return validated as unknown as DocumentInfo;
};

/** Fonction qui vérifie que le fichier en input est un pdf.
 * Vérifie la taille, l'extension et la signature du fichier.
 * @param file File à vérifier.
 * @return buffer du fichier.
 */
async function checkFileIntegrity(file : File | null) {
    if (!file) error(400, 'Fichier manquant.');
    if (file.size > MAX_FILE_SIZE) error(400, "Fichier trop volumineux.");
    // TODO accepter aussi les png et les jpeg ?
    if (file.type !== 'application/pdf') error(400, "Le format est incorrect.");

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    const signature = Array.from(uint8Array.slice(0, 4))
                           .map(byte => byte.toString(16).padStart(2, '0'))
                           .join('');

    if (signature !== "25504446") error(400, "Le pdf n'est pas valide (mauvaise signature)");

    return uint8Array;
}

/** Fonction qui génère un chemin où enregistrer le fichier en fonction
 * des metadonnées.
 * @param metadonnés.
 * @return chemin (ex: ENSEEIHT/1A/SN/Reseau/)
 */
function generatePath(metadata : DocumentInfo) {
    const { school, year, filiaire, subject, category } = metadata;

    const relativePath = join(school, year, filiaire, subject);
    const fullPath = resolve(BASE_DIR, relativePath);
    
    if (!fullPath.startsWith(BASE_DIR)) {
        error(403, "Access Denied.");
    }
    
    return fullPath;
}

/** Fonction qui génère le nom du fichier en fonction des métadonnées.
 * Fix les doublons en ajoutant un counter.
 * Ex : TD 1.pdf
 * @param metadonnées
 * @return String nom du fichier.
 */
function generateName(metadata: DocumentInfo) {
    const { category, date, corrige } = metadata;
    
    let baseName = `${category} - ${date}`;
    baseName = baseName.replace(/[\/\\]/g, '_');
    
    if (corrige === 'true') {
        baseName = baseName + ' + corrige';
    }
    
    const filePath = generatePath(metadata);
    let finalName = baseName;
    let counter = 1;

    while (existsSync(join(filePath, finalName + '.pdf'))) {
        finalName = `${baseName} - ${counter}`;
        counter++;
    }

    return finalName + '.pdf';
}

/** Fonction qui sauvegarde le fichier.
 * @parma buffer: fichier dans un buffer Array 8 bits.
 * @param metadonnées
 */
function saveFile(buffer: Uint8Array, metadata: DocumentInfo) {
    const dirPath = generatePath(metadata);
    const fileName = generateName(metadata);
    const fullPath = join(dirPath, fileName);

    if (!fullPath.startsWith(BASE_DIR)) {
        error(403, "Access denied");
    }

    try {
        mkdirSync(dirPath, { recursive: true });
        writeFileSync(fullPath, Buffer.from(buffer), { mode: 0o644 });
    } catch (err) {
        console.error(err)
        error(500, "Erreur d'écriture du fichier");
    }
}

export const POST: RequestHandler = async ({ request, locals }) => {
    // Authentification
    const session = await locals.auth();
    if (!session) {
        return json({ 
            error: 'Unauthorized', 
            message: 'Vous devez être connecté' 
        }, { status: 401 });
    }

    const data = await request.formData();

    const file = data.get('file');
    if (!(file instanceof File)) {
        error(400, "Fichier manquant ou invalide.");
    }

    const fileContent = await checkFileIntegrity(file);

    const rawFields = Object.fromEntries(data.entries()) as DocumentInfo;
    delete rawFields.file;
    const metadata = validateMetadata(rawFields);

    saveFile(fileContent, metadata);

    return json({ message: 'Fichier ajouté avec succès' }, { status: 201 });
};
