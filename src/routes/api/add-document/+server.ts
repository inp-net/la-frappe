import { error, json, type RequestHandler } from '@sveltejs/kit';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';
import { LogCategory, DocumentType, StoragePaths, type DocumentInfo, type UploadDocument } from '$lib/types/types.d';
import { NewLog } from '$lib/server/logService';
import { IsBan } from '$lib/server/authService';
import { securePath } from '$lib/server/fileService';
import { setAttributeSync } from 'fs-xattr';

/** Taille maximale du fichier 10mo */
const MAX_FILE_SIZE = 10 * 1024 * 1024;
/** Position par défaut de la DB. */
const BASE_DIR = resolve(StoragePaths.DEFAULT_DB_LOCATION);

/** Fonction qui vérifie l'intégrité des métadonnées.
 * @param fields : DocumentInfo données du formulaires.
 * @throw error 400 si invalide.
 */
// function validateMetadata(fields: any, author: string): UploadDocument {
//     const requiredKeys = ['date', 'type'];
//
//     for (const key of requiredKeys) {
//         if (typeof fields[key] !== 'string' || !fields[key].trim()) {
//             error(400, `Missing or invalid field: ${key}`);
//         }
//     }
//
//     const documentTypes = Object.values(DocumentType) as string[];
//     if (!documentTypes.includes(fields.documentType)) {
//         error(400, "Invalid document type");
//     }
//
//     return {
//         school: securePath(fields.school) || error(400, "Invalid characters in school"),
//         major: securePath(fields.major) || error(400, "Invalid characters in major"),
//         year: securePath(fields.year) || error(400, "Invalid characters in year"),
//         minor: securePath(fields.minor) || error(400, "Invalid characters in minor"),
//         course: securePath(fields.course) || error(400, "Invalid characters in course"),
//         documentType: fields.documentType, 
//         date: securePath(fields.date) || error(400, "Invalid characters in date"),
//         hasCorrection: fields.hasCorrection === 'true',
//         author: author
//     } as unknown as DocumentInfo;
// }

/** Fonction qui vérifie que le fichier en input est un pdf.
 * Vérifie la taille, l'extension et la signature du fichier.
 * @param file File à vérifier.
 * @return buffer du fichier.
 */
async function checkFileIntegrity(file : File | null) {
    if (!file) error(400, 'Fichier manquant.');
    if (file.size > MAX_FILE_SIZE) error(400, "Fichier trop volumineux.");
    if (file.type !== 'application/pdf') error(400, "Le format est incorrect.");

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    const signature = Array.from(uint8Array.slice(0, 4))
                           .map(byte => byte.toString(16).padStart(2, '0'))
                           .join('');

    if (signature !== "25504446") error(400, "Le pdf n'est pas valide (mauvaise signature)");

    return uint8Array;
}

/** Fonction qui génère le nom du fichier en fonction des métadonnées.
 * Fix les doublons en ajoutant un counter.
 * Ex : TD 1.pdf
 * @param metadonnées
 * @return String nom du fichier.
 */
function generateName(metadata: UploadDocument) {
    let baseName = `${metadata.type} - ${metadata.date}`;
    
    if (metadata.correction) {
        baseName = baseName + ' - solution';
    }
    
    const filePath = metadata.path;
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
 * @param path: string emplacement du fichier
 */
function saveFile(buffer: Uint8Array, metadata: UploadDocument) {
    const fileName = generateName(metadata);
    const fullPath = join(metadata.path, fileName);

    if (!fullPath.startsWith(BASE_DIR)) {
        error(403, "Access denied");
    }

    try {
        mkdirSync(metadata.path, { recursive: true });
        writeFileSync(fullPath, Buffer.from(buffer), { mode: 0o644 });

        // set attributes if possible
        try {
            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            const fullDateStr = `${day}/${month}/${year}`;

            if (metadata.author) setAttributeSync(fullPath, 'user.author', metadata.author);
            const date = new Date();
            setAttributeSync(fullPath, 'user.date', fullDateStr);
            setAttributeSync(fullPath, 'user.type', metadata.type);
        } catch (err) {
            console.warn("Extended attributes not supported on this filesystem.");
        }

        if (!existsSync(fullPath)) {
            throw error(500, "Erreur d'écriture du fichier");
        }
        NewLog(`Document '${fileName}' dans '${fullPath}' ajouté par ${metadata.author}`, LogCategory.DOCUMENT_ADD);
    } catch (err) {
        console.error(err)
        error(500, "Erreur d'écriture du fichier");
    }
}

export const POST: RequestHandler = async ({ request, locals }) => {
    // Authentification
    const session = await locals.auth();
    if (!session || !session.user || !session.user.name) {
        return json({ error: 'Unauthorized', message: 'Vous devez être connecté' }, { status: 401 });
    }

    if (IsBan(session.user.name)) {
        return json({ 
            error: 'Forbidden', 
            message: "Vous êtes banni de La-Frappe. Si vous pensez que c'est une erreur, contactez net7"
        }, { status: 403 });
    }

    const data = await request.formData();

    const form: UploadDocument = {
        document: data.get('document') as File,
        path: data.get('path') as string,
        date: parseInt(data.get('date') as string) ?? new Date().getFullYear,
        correction: data.get('correction') === 'true',
        type: data.get('type') as DocumentType,
        author: session.user.name
    };

    const file = form.document;
    if (!(file instanceof File)) {
        error(400, "Fichier manquant ou invalide.");
    }

    const fileContent = await checkFileIntegrity(file);

    try {
        // const metadata = validateMetadata(rawFields, session.user.name);
        saveFile(fileContent, form);
        return json({ message: 'Fichier ajouté avec succès' }, { status: 201 });
    } catch (err: any) {
        const status = err.status || 500;
        const message = err.body?.message || "Une erreur interne est survenue.";
        return json({ message }, { status });
    }
};
