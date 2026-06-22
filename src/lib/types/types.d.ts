/** Les types de documents acceptés. */
export enum DocumentTypes {
    PARTIEL = 'Partiel',
    FICHE = 'Fiche',
    TD = 'TD',
    TP = 'TP',
    AUTRE = 'Autre',
    NOTES = 'Notes',
    DM = 'DM',
    BE = 'BE',
    DIAPOSITIVES = 'Diapositives'
};

/** Les données de sauvegarde dans le serveur. */
export enum StoragePaths {
    DEFAULT_PAGE_LOCATION = 'browse/',
    DEFAULT_DB_LOCATION = 'static/frappe_tree',
    DEFAULT_SUBJECT_LOCATION = 'static/uploads',
};

/** Le struct qui représente un fichier. */
export type FileData = {
    name: string;
    isDirectory: boolean;
    path?: string[]; // la liste des fichiers chemins
    type?: DocumentType;
};

/** Informations nécéssaires pour l'ajout d'un document. */
export type DocumentInfo = {
    school: string;
    year: string;
    filiaire: string;
    subject: string;
    category: string;
    date: string;
    corrige: string;
};
