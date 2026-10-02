/** Les types de documents acceptés. */
export enum DocumentType {
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
    DEFAULT_PAGE_LOCATION = 'browse/', // emplacement de la navigation svelte
    DEFAULT_DB_LOCATION = 'data/frappe_tree', // emplacement de l'arbre
    DEFAULT_SUBJECT_LOCATION = 'data/uploads', // emplacement des UEs
    DEFAULT_LOG_LOCATION = 'data/logs', // emplacement des logs
    DEFAULT_BANLIST_FILE = 'data/banlist.json' // emplacement des banlist
};

export enum LogCategory {
    DOCUMENT_ADD = "AddDocument"
}

/** Le struct qui représente un fichier. */
export type FileData = {
    name: string;
    isDirectory: boolean;
    path?: string[]; // la liste des fichiers chemins
    type?: DocumentType;
    author?: string;
    date?: string;
};

/** @depreacted Informations nécéssaires pour l'ajout d'un document. */
export type DocumentInfo = {
    document: File;
    school: string;
    major: string;
    year: string;
    minor: string;
    course: string;
    documentType: string;
    date: string;
    hasCorrection: 'true' | 'false';
    author?: string;
};

/** Type utilisé pour upload un fichier dans la DB. */
export type UploadDocument = {
    document: File;
    path: string;
    date: number;
    correction: boolean;
    type: DocumentType;
    author?: string;
}

/** Inputs possibles pour traiter une erreur d'arborescence. */
export enum ErrorInputType {
    PATH,
    NAME
}

/** Données nécéssaires pour traiter une erreur dans l'arborescence. */
export type ErrorData = {
    name: string;
    inputNames: string[];
    inputTypes: ErrorInputType[];
}

export type SubjectData = {
    files: FileData[];  // Fichiers dans l'UE
    paths: string[];    // Pointeurs de l'UE
}

export interface SubjectMetadata {
    paths?: string[];
    [key: string]: unknown;
}
