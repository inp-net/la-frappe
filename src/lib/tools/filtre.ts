export const categoriesAccepted = [
	'partiel',
	'fiche',
	'td',
	'autre',
	'notes_de_cours',
	'dm',
	'tp',
	'be',
	'diapositives_de_cours'
];

// Fonction utilitaire pour normaliser les chemins (minuscules, pas de caractere special sauf _)
export const normalize = (s: string) => s.trim().toLowerCase().replaceAll(/[\s&\/\\#,+()$~%.'":*?<>{}\-_]+/g, '_'));
