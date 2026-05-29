import { readFileSync, mkdirSync, existsSync, symlinkSync, readdirSync, rmSync } from 'fs';
import { join } from 'path';

/** Emplacement de la structure de fichier virtuelle. */
const ROOT = './static/frappe_tree';
/** Emplacement où tout les UE sont en flat. */
const SUBJECT = './static/uploads';

function generatePath(subject: string) {
    const subjectPath = join(SUBJECT, subject);
    const metadataPath = join(subjectPath, 'metadata.json');

    if (!existsSync(metadataPath)) {
        return;
    }

    try {
        const metadata = JSON.parse(readFileSync(metadataPath, 'utf-8'));
        const paths = metadata.paths || [];

        // Pour chaque chemin virtuel (ex: "n7/sn")
        for (const virtualPath of paths) {
            const targetDir = join(ROOT, virtualPath);

            // Créer le dossier parent (ex : static/frappe_tree/n7/sn)
            mkdirSync(targetDir, { recursive: true });

            // Créer un lien symbolique vers le dossier de la matière
            const linkName = join(targetDir, subject);
            if (!existsSync(linkName)) {
                // Utilisation de path.resolve pour éviter les problèmes de liens relatifs
                symlinkSync(join(process.cwd(), subjectPath), join(process.cwd(), linkName), 'dir');
                console.log(` ✅ Link créé : ${virtualPath} -> ${subject}`);
            }
        }
    } catch {
        return;
    }
}

function generateStructure() {
    console.log("Début de la génération de l'arborescence...");

    // supprime le dossier existant
    if (existsSync(ROOT)) {
        rmSync(ROOT, { recursive: true, force: true });
    }

    // crée le dossier root
    mkdirSync(ROOT, { recursive: true });

    // récupère tous les UE
    const subjects = readdirSync(SUBJECT);

    // lire les metadata pour chaque UE pour crée
    // la structure virtuelle
    for (const subject of subjects) {
        try {
            generatePath(subject);
        } catch {
            continue;
        }
    }
}

try {
    generateStructure();
} catch (globalError) {
    console.error("💥 Erreur fatale lors de l'exécution du script:", globalError);
    process.exit(1);
}
