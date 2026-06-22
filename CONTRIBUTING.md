# Contribuer sur La Frappe

## Mise en place de l'environnement de développement

### Prérequis

Vous devez être sur Linux, MacOS ou Windows
([WSL](https://learn.microsoft.com/fr-fr/windows/wsl/install) seulement).

Installez [pnpm](https://pnpm.io/fr/).

### Installation

1. Cloner le dépôt

> **NOTE :** Pour proposer votre travail, faites un fork du dépôt puis faire
> une [Merge Request](#merge-requests)

```
git clone https://git.inpt.fr/inp-net/lafrappe
```

2. Installer les dépendences

```
pnpm install
```

3. Ajouter les variables d'environnement dans votre `.env`

```
cp .env.exemple .env
```

Pour désactiver Authentik (nécéssite des clés privé), mettre `DEV_FAKE_AUTH` à `true`
dans le `.env`.

4. Générer la base de données

```
node generate-hierachy.js
```

5. Lancer le projet

```
pnpm run dev
```

## Développement

Lire le `README.md` pour se familiariser avec l'architecture du projet.

## FAQ

### Merge requests

Pour effectuer vos changements puis les proposer:

1. [Créez un _fork_ de ce dépôt](https://git.inpt.fr/inp-net/lafrappe/-/forks/new)
2. Clonez ce _fork_ sur votre machine
3. Faites vos commits sur ce _fork_
4. Faites une _merge request_, demandant à intégrer les changements de _votre fork_ vers ce dépôt

### Conventions de commits

Churros utilise la convention des [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). Les messages de commit doivent donc être de la forme suivante :

```
<type>(<scope optionnel>): <description> <issues(s) fermées>
```

Où:

- `<type>` est un des types suivants :
  - `build`: changements qui affectent le système de build
  - `ci`: changements concernant les fichiers et scripts d'intégration continue
  - `docs`: changements concernant la documentation
  - `feat`: ajout d'une nouvelle fonctionnalité
  - `fix`: correction d'un bug
  - `perf`: amélioration des performances
  - `refactor`: réorganisation du code, qui ne change pas son comportement
  - `style`: modifications d'apparence du site
  - `test`: ajout ou modification de tests
- `<scope optionnel>` est un élément optionnel précisant la portée du commit (ex: login, ui...). **Quand il n'y a pas de scope, ne pas mettre de parenthèses.**
- `<description>` est une description courte du changement, sous forme de phrase à l'infinif. Pour les fix de bugs, on peut mettre une phrase au passé qui décrit le comportement avant le fix. (ex: `fix(login): login button redirected to wrong page`)
- `<issues(s) fermées>` est une liste optionnelle d'issues fermées par ce commit. Il faut mettre `(closes #<numéro de l'issue>)` pour chaque issue fermée. Si le commit ne ferme pas d'issue, ne pas mettre cette partie.

Par exemple: `fix(changelog): fix typo (closes #123)`
