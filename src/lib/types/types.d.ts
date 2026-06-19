export type FileData = {
    name: string;
    isDirectory: boolean;
}

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
}
