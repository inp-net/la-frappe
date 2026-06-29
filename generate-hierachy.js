// peut se lancer avec node <nomdufichier>

import { readFileSync, mkdirSync, existsSync, symlinkSync, readdirSync, lstatSync, rmSync } from 'fs';
import { join, resolve, dirname, relative } from 'path'; // Ajout de dirname et relative

const UPLOADS_ROOT = resolve('data/uploads');
const DIST_ROOT = resolve('data/frappe_tree'); // Le dossier de sortie

function generateHierarchy() {
    console.log("Début de la génération de l'arborescence...");

    // Nettoyage du dossier de sortie pour repartir à neuf
    if (existsSync(DIST_ROOT)) {
        const items = readdirSync(DIST_ROOT);
        for (const item of items) {
            const itemPath = join(DIST_ROOT, item);
            rmSync(itemPath, { recursive: true, force: true });
        }
        console.log("Contenu de frappe_tree nettoyé.");
    } else {
        mkdirSync(DIST_ROOT, { recursive: true });
    }

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

                const linkName = join(targetDir, subject);
                
                if (!existsSync(linkName)) {
                    const relativeTarget = relative(dirname(linkName), subjectPath);
                    symlinkSync(relativeTarget, linkName, 'dir');
                    
                    console.log(`Link créé : ${virtualPath} -> ${subject} (relatif: ${relativeTarget})`);
                }
            }
        } catch (err) {
            console.error(`Erreur de la matière ${subject}:`, err.message);
        }
    }

    console.log("Arborescence générée avec succès ! ");
}
generateHierarchy();
