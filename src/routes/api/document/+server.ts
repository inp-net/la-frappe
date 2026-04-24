import { categoriesAccepted } from '$lib/tools/filtre';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { writeFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { FOLDER } from '$lib/constants'

/** Taille maximale du fichier 10mo */
const MAX_FILE_SIZE = 10 * 1024 * 1024;

async function checkFileIntegrity(file : File | null) {
    if (!file) error(400, 'Fichier manquant.');
    if (file.size > MAX_FILE_SIZE) error(400, "Fichier trop volumineux.");
    // TODO accepter aussi les png et les jpeg ?
	if (file.type !== 'application/pdf') error(400, "Le format est incorrect.");

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const signature = Array.from(uint8Array.slice(0, 4))
                           .map(byte => byte.toString(16))
                           .join('');

    if (signature !== "25504446") error(400, "Le pdf n'est pas valide (mauvaise signature)");

    return uint8Array;
}

function checkMetadata(data : FormData) {
    const school = data.get('school') as string;
    const year = data.get('year') as string;
    const filiaire = data.get('filiaire') as string;
    const subject = data.get('subject') as string;
    const category = data.get('category') as string;

    // TODO vérifier que l'école, le sujet, la filiaire exite
    if (!categoriesAccepted.includes(category)) error(400, "Catégorie invalide");
    if (!subject || subject.length > 50) error(400, "Sujet invalide");
    if (!filiaire || filiaire.length > 50) error(400, "Filiaire invalide");
    if (!school || school.length > 50) error(400, "Sujet invalide");

    return { school, year, filiaire, subject, category };
}

function securePath(segment : string) {
    return segment
        .replace(/\./g, '') // supprime les points
        .replace(/[\\/:*?"<>|]/g, '_') // supprime les caractères interdits Windows/Linux
        .trim();
}

function generateName(metadata : ReturnType<typeof checkMetadata>) {};

function saveFile(buffer: Uint8Array, metadata: ReturnType<typeof checkMetadata>) {
    const { school, year, filiaire, subject, category } = metadata;

    // retire toutes les injections malicieuse de string (../ , caractères interdit, ...)
    const safeSchool = securePath(school);
    const safeYear = securePath(year);
    const safeFiliaire = securePath(filiaire);
    const safeSubject = securePath(subject);

    // chemin final du fichier
    const path = join(
        resolve(FOLDER.DEFAULT_DB_LOCATION), 
        safeSchool, 
        safeYear, 
        safeFiliaire, 
        safeSubject
    );

    // TODO vérifier l'existence du chemin

    try {
        writeFileSync(path, Buffer.from(buffer));
    } catch (err) {
        console.error(err)
        error(500, "Erreur d'écriture du fichier");
    }
}

// permet d'upload un pdf dans une categorie d'une matiere deja existente
// ça fait peur mais c'est assez simple, me demander si besoin alexandre à net7
export const POST: RequestHandler = async ({ request }) => {
    const data = await request.formData();

    const fileContent = await checkFileIntegrity(data.get('file') as File);

    const metadata = checkMetadata(data);

    saveFile(fileContent, metadata);

    return json({ message: 'Fichier ajouté avec succès' }, { status: 201 });
};
