export const categoriesAccepted = [
	'Partiel',
	'Fiche',
	'TD',
	'Autre',
	'Notes',
	'DM',
	'TP',
	'BE',
	'Diapositives'
] as const;

export type Category = typeof categoriesAccepted[number];

// Fonction utilitaire pour normaliser les chemins (minuscules, pas de caractere special sauf _)
export const normalize = (s: string) => s.trim().toLowerCase().replaceAll(/[\s&\/\\#,+()$~%.'":*?<>{}\-_]+/g, '_');
