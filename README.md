# La Frappe

## Vision du projet

Cette version de **La Frappe** à été crée pour la dissocier de Churros. Elle
utilise la nouvelle librairie graphique de net7 : [Azucar-UI](https://git.inpt.fr/inp-net/azucar-ui).

La base de données repose sur les liens symboliques entre fichiers. Pas besoin
donc de connaître SQL, Prisma, ...

## Contribuer

[CONTRIBUTING.md](CONTRIBUTING.md).

## Choix techniques et structure du code

### Base de données

Le projet n'utilise pas de bases de données telles que SQL. Il utilise les
liens symboliques entre fichiers de Linux. Ces liens symboliques sont générés
au lancement du serveur grâce à [generate-hierachy.js](generate-hierachy.js).

L'objectif est de pouvoir naviguer dans un explorateur de fichier classique tout
en prenant en compte les UE dupliqués (une UE commune à plusieurs filiaires).

La base de donné est structuré de cette manière :

#### Répertoire flat

```
flat/
- Architecture des ordinateurs/
- PIM/
- Réseau 1A/
- Réseau 2A/
- ...
```

À l'intérieur des dossiers UEs. Il y a tous les pdfs associés à cette UE.

Il y a aussi systématiquement un fichier `metadata.json` :

```
{
    "paths": [
        "ENSEEIHT/2A/ASR/"
    ]
}
```

Puisque un EU peut être commun à plusieurs filiaires, paths prend en paramètre
une liste. Par exemple :

```
{
    "paths": [
        "ENSEEIHT/2A/ASR/",
        "ENSEEIHT/2A/Réseau/"
    ]
}
```

#### Répertoire arbre

Le répertoire arbre est entièrement généré par [generate-hierachy](generate-hierachy.js).

Il lit les fichiers `metadata.json` puis crée l'arborescence suivante :

```
tree/
- ENSEEIHT/
-- 2A/
--- ASR/
---- Réseau/
---- ...
--- Big Data/
--- ...
```

Un lien symbolique est crée du répertoire UE de l'arbre (par exemple Réseaux)
vers le répertoire flat (flat/Réseaux).

### API

Les APIs utilisent un fichier server side commun [fileService.ts](src/lib/server/fileService.ts).

Les types sont définies dans [types.d.ts](src/lib/types/types.d.ts).

Ce fichier contient touts les utilitaires pour le projet.

#### get-files-at

Nécéssite d'être authentifié.

Cette API est utilisé pour récuprérer les fichiers en lui donnant un chemin
absolue.

Renvoie une liste de `FileData`.

GET: [get-files-at](src/routes/get-files-at/+server.ts)

#### add-document

Nécéssite d'être authentifié.

Cette API permet d'ajouter un document à la DB.

POST: [add-document](src/routes/add-document/+server.ts)
