# Student Directory API

API REST Express permettant de gérer un annuaire d'étudiants stocké en mémoire.

## Prérequis

- Node.js 22 ou 24
- npm

## Installation

```bash
npm install
npm start
```

Le serveur est ensuite disponible sur `http://localhost:3000`.

## Commandes

```bash
npm start       # Démarrer l'API
npm run dev     # Démarrer avec rechargement automatique
npm run lint    # Exécuter ESLint
npm test        # Exécuter les tests
```

## Modèle étudiant

```json
{
  "firstName": "Sonia",
  "lastName": "Diallo",
  "email": "sonia.diallo@example.com",
  "grade": 15,
  "field": "informatique"
}
```

Les filières acceptées sont `informatique`, `mathématiques`, `physique` et `chimie`.

## Endpoints

| Méthode | Route | Description |
| --- | --- | --- |
| GET | `/students` | Lister les étudiants |
| GET | `/students/:id` | Obtenir un étudiant |
| POST | `/students` | Créer un étudiant |
| PUT | `/students/:id` | Remplacer un étudiant |
| DELETE | `/students/:id` | Supprimer un étudiant |
| GET | `/students/stats` | Obtenir les statistiques |
| GET | `/students/search?q=terme` | Rechercher par nom ou prénom |

### Exemple de création

```bash
curl -X POST http://localhost:3000/students \
  -H 'Content-Type: application/json' \
  -d '{"firstName":"Sonia","lastName":"Diallo","email":"sonia.diallo@example.com","grade":15,"field":"informatique"}'
```

Les données sont réinitialisées à chaque redémarrage du serveur.
