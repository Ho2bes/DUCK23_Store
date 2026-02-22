# DUCK23 Store

DUCK23 Store est une plateforme e-commerce développée en **Django** pour le backend, **Angular** pour le frontend, et **PostgreSQL** comme base de données. Ce projet vise à fournir une solution complète de vente en ligne avec gestion des utilisateurs et des produits.

## 📌 Fonctionnalités

### Utilisateur
- 📌 Création de compte
- 🔑 Connexion et déconnexion
- ⚙️ Modification des informations utilisateur
- ❌ Suppression de compte
- 🛒 Ajout et gestion du panier

### Administrateur
- 📦 Ajout, mise à jour et suppression de produits
- 📜 Gestion des commandes clients
- 👥 Gestion des utilisateurs

## 🏗️ Technologies utilisées

| Technologie  | Usage |
|-------------|----------------------------|
| Django      | Backend (API REST) |
| Angular     | Frontend (Interface utilisateur) |
| PostgreSQL  | Base de données |
| Bootstrap   | Design et mise en page |

## 📁 Structure du projet

```bash
DUCK23_Store/
│── backend/               # Code du backend Django
│   ├── accounts/          # Gestion des utilisateurs et authentification
│   ├── store/             # Gestion des produits et commandes
│   ├── settings.py        # Configuration du projet Django
│── frontend/              # Code du frontend Angular
│   ├── src/
│   │   ├── app/           # Composants et services Angular
│   │   ├── assets/        # Images et fichiers statiques
│   ├── angular.json       # Configuration Angular
│── docs/                  # Documentation du projet
│── README.md              # Documentation principale
│── requirements.txt       # Dépendances Python
│── package.json           # Dépendances JavaScript
```

## 🚀 Installation et lancement

### Backend (Django)

1. Cloner le dépôt
   ```bash
   git clone https://github.com/Ho2bes/DUCK23_Store.git
   cd DUCK23_Store/backend
   ```
2. Créer un environnement virtuel et installer les dépendances
   ```bash
   python -m venv env
   source env/bin/activate  # (ou env\Scripts\activate sous Windows)
   pip install -r requirements.txt
   ```
3. Configurer la base de données PostgreSQL
   - Modifier les paramètres dans `settings.py`
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.postgresql',
           'NAME': 'duck23_db',
           'USER': 'postgres',
           'PASSWORD': 'password',
           'HOST': 'localhost',
           'PORT': '5432',
       }
   }
   ```
4. Effectuer les migrations et démarrer le serveur
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

### Frontend (Angular)

1. Aller dans le dossier du frontend
   ```bash
   cd ../frontend
   ```
2. Installer les dépendances
   ```bash
   npm install
   ```
3. Lancer l'application
   ```bash
   ng serve
   ```

## 📊 API Endpoints

### Authentification
| Méthode | Endpoint            | Description |
|---------|--------------------|-------------|
| POST    | `/api/auth/register/` | Inscription utilisateur |
| POST    | `/api/auth/login/`    | Connexion utilisateur |
| POST    | `/api/auth/logout/`   | Déconnexion utilisateur |

### Produits
| Méthode | Endpoint            | Description |
|---------|--------------------|-------------|
| GET     | `/api/products/`    | Liste des produits |
| POST    | `/api/products/`    | Ajouter un produit (Admin) |
| PUT     | `/api/products/:id/` | Modifier un produit (Admin) |
| DELETE  | `/api/products/:id/` | Supprimer un produit (Admin) |

### Commandes
| Méthode | Endpoint            | Description |
|---------|--------------------|-------------|
| GET     | `/api/orders/`      | Voir les commandes (Admin) |
| POST    | `/api/orders/`      | Passer une commande |

## 🔧 Déploiement

Déploiement à venir

## 🛠️ Contributeurs

- 👤 **Ho2bes** - Développeur principal

## 📜 Licence
Ce projet est sous licence the Apache License 2.0 - voir le fichier [LICENSE](LICENSE) pour plus de détail.
