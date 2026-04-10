import { readFileSync, mkdirSync, existsSync, symlinkSync, readdirSync, lstatSync, rmSync, read } from 'fs';
import { join, resolve } from 'path';

const UPLOADS_ROOT = resolve('static/uploads');
const DIST_ROOT = resolve('/static/frappe_tree'); // Le dossier de sortie

async function generateHierarchy() {
    console.log("Début de la génération de l'arborescence...");

    // Nettoyage du dossier de sortie pour repartir à neuf
    if (existsSync(DIST_ROOT)) {
        rmSync(DIST_ROOT, { recursive: true, force: true });
    }
    mkdirSync(DIST_ROOT, { recursive: true });

    // Parcourir chaque dossier de matière dans static/uploads
    const subjects = readdirSync(UPLOADS_ROOT).filter(f =>
        lstatSync(join(UPLOADS_ROOT, f)).isDirectory()
    );

    for (const subject of subjects) {
        const subjectPath = join(UPLOADS_ROOT, subject);
        const metaPath = join(subjectPath, 'metadata.json');

        if (!existsSync(metaPath)) continue;

        try {
            const metadata = JSON.parse(readFileSync(metaPath, 'utf-8'));
            const paths = metadata.paths || [];

            // Pour chaque chemin virtuel (ex: "n7/sn")
            for (const virtualPath of paths) {
                const targetDir = join(DIST_ROOT, virtualPath);

                // Créer le dossier parent (ex : static/frappe_tree/n7/sn)
                mkdirSync(targetDir, { recursive: true });

                // Créer un lien symbolique vers le dossier de la matière
                const linkName = join(targetDir, subject);

                if (!existsSync(linkName)) {
                    // On crée un lien symbolique : le dossier virtuel pointe vers le dossier réel
                    symlinkSync(subjectPath, linkName, 'dir');
                    console.log(` Link créé : ${virtualPath} -> ${subject}`);
                }
            }
        } catch (err) {
            console.error(` Erreur de la matière ${subject}:`, err.message);
        }
    }

    console.log(" Arborescence générée avec succès ! ");
}
generateHierarchy()