# Vision du projet

Cette version de **La Frappe** a été créer pour la dissocier de Churros. Elle
utilise la nouvelle librairie graphique de net7 : [Azucar-UI](https://git.inpt.fr/inp-net/azucar-ui).

La base de données repose sur les liens symboliques entre fichiers. Pas besoin
donc de connaître SQL, Prisma, ...

![Homepage](https://cloud.inpt.fr/apps/files_sharing/publicpreview/i6o49aDoqZwxDLs?file=/&fileId=713788&x=1920&y=1080&a=true&etag=f17471efb1efc369136f53db41c8ecf9)

![Add Document](https://cloud.inpt.fr/apps/files_sharing/publicpreview/HWsDnABZKNp8tp3?file=/&fileId=713787&x=1920&y=1080&a=true&etag=bd72159b98626f70f60495c11790b040)

# Contribuer

[CONTRIBUTING.md](CONTRIBUTING.md).

# Choix techniques et structure du code

## Base de données

Le projet n'utilise pas de bases de données telles que SQL. Il utilise les
liens symboliques entre fichiers de Linux. Ces liens symboliques sont générés
au lancement du serveur grâce à [generate-hierachy.js](generate-hierachy.js).

L'objectif est de pouvoir naviguer dans un explorateur de fichier classique tout
en prenant en compte les UE dupliqués (une UE commune à plusieurs filières).
Cet élément sera développé dans les parties suivantes.

La base de donnée est structuré de cette manière :

### Répertoire flat

L'emplacement de ce répertoire est défini dans
[`StoragePaths`](src/lib/types/types.d.ts) par la variable
`DEFAULT_SUBJECT_LOCATION`.

```
flat/
- Architecture des ordinateurs/
- PIM/
- Réseau 1A/
- Réseau 2A/
- ...
```

Ces dossiers contiennent les données relatives à l'UE (les pdfs des examens,
les notes, etc.).

Il y a aussi systématiquement un fichier `metadata.json`. Ce fichier est défini
de cette manière :

```
{
    "paths": [
        "ENSEEIHT/2A/ASR/"
    ]
}
```

Le `paths` renseigne les positions de l'UE. Si l'UE est partagée dans plusieurs
filières, les branches de l'arbre pointeront vers le même UE.

```
{
    "paths": [
        "ENSEEIHT/2A/ASR/",
        "ENSEEIHT/2A/L/"
    ]
}
```

### Répertoire arbre

L'emplacement de ce répertoire est défini dans
[`StoragePaths`](src/lib/types/types.d.ts) par la variable
`DEFAULT_DB_LOCATION`.

Le répertoire arbre peut être généré par [generate-hierachy](generate-hierachy.js).

Il lit les fichiers `metadata.json` puis crée l'arborescence suivante :

```
tree/
- ENSEEIHT/
-- 2A/
--- ASR/
---- L/
---- ...
--- Big Data/
--- ...
```

On peut donc naviguer l'arbre pour trouver les UE.

Dans le dernier dossier de l'arbre, un lien symbolique (un chemin) est créé entre le
dossier et l'UE dans le flat.

Plusieurs dossiers peuvent pointer vers l'UE.

### Métadonnées des fichiers

Les fichiers possèdent des métadonnées. Elles sont stockées dans les
[extended attributes](https://man7.org/linux/man-pages/man7/xattr.7.html).

Sont stockés :

- `user.author` : L'ID de l'auteur du fichier.
- `user.date` : La date (inutile, car doublon).
- `user.correction` : Si le fichier contient un corrigé.
- `user.type` : Le type de fichier (Partiel, note, etc.).

Les extended attributes ne sont pas implémentés dans le module `fs` de JS. Le
module [fs-xattr](https://github.com/LinusU/fs-xattr) est utilisé.

## Pages

### browse

L'emplacement de cette page est défini dans
[`StoragePaths`](src/lib/types/types.d.ts) par la variable
`DEFAULT_PAGE_LOCATION`.

La page browse utilise le [paramétrage de svelte](https://svelte.dev/tutorial/kit/optional-params).

Le chemin entré dans l'URL permet de récupérer les fichiers dans l'arbre.

### admin

Cette page est réservé aux admins. Les admins sont les utilisateurs qui sont
root dans le LDAP (dans le groupe `root-inp`).

Elle permet de modifier la DB, de gérer les bannissements, etc.

## Services

Les services sont les fichiers server-side qui contiennent des fonctions utiles.

### authService

[authService](src/lib/server/authService.ts)

Service qui gère les autorisations, le bannissement des utilisateurs.

La liste des bannies est présente dans `DEFAULT_BANLIST_FILE` du
[`StoragePaths`](src/lib/types/types.d.ts).

Un banni peut accéder aux fichiers, mais ne peut pas en soumettre.

### logService

[logService](src/lib/server/logService.ts)

Service qui gère les logs.

Le répertoire des logs est définie par `DEFAULT_LOG_LOCATION` du
[`StoragePaths`](src/lib/types/types.d.ts).

### dbService

[dbService](src/lib/server/dbService.ts)

Service qui gère la base de donnée.

- Renommage d'UEs / fichiers.
- Création de l'arbre.
- Création d'une UE.

### fileService

[fileService](src/lib/server/fileService.ts)

Service qui gère les fichiers.

- Lister les fichiers d'une UE.
- Sécuriser les chemins pour éviter les navigations malveillantes.
- Supprimer des fichiers.

Pour accéder à ces fonctions, le chemin doit être sécurisé par la fonction
`securePath`. Sinon, des warnings sont levés.


## API

Ce fichier contient tous les utilitaires pour le projet.

Les types sont définis ici [types.d.ts](src/lib/types/types.d.ts).

### get-files-at

Nécéssite d'être authentifié.

Cette API est utilisé pour récupérer les fichiers en lui donnant un chemin
absolue.

Le chemin est sécurisé avant.

Renvoie une liste de `FileData`.

GET: [get-files-at](src/routes/get-files-at/+server.ts)

### add-document

Nécéssite d'être authentifié.

Cette API permet d'ajouter un document à la DB.

POST: [add-document](src/routes/add-document/+server.ts)
