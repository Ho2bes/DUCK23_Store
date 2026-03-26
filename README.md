# 🦆 DUCK23 Store

> **Accès direct à l'application :** [http://51.20.144.37/](http://51.20.144.37/)
**DUCK23 Store** est une plateforme e-commerce moderne conçue avec une architecture découplée (**SDR**). Ce projet démontre non seulement des compétences en développement Fullstack (Django/Angular), mais aussi une maîtrise avancée du cycle de vie logiciel (**DevOps**) et de l'Infrastructure as Code (**IaC**).

---

## 🏗️ Architecture & Stack Technique

| Couche | Technologie | Rôle |
| :--- | :--- | :--- |
| **Frontend** | Angular 18 | Interface SPA dynamique |
| **Backend** | Django REST Framework | API métier et sécurité |
| **Base de données** | PostgreSQL | Persistance des données (Volumes Docker) |
| **Infrastructure** | AWS (EC2) | Hébergement Cloud |
| **IaC** | Terraform | Provisionnement des ressources Cloud |
| **Configuration** | Ansible | Automatisation du déploiement et sécurité |
| **Conteneurisation**| Docker & Compose | Isolation des services |
| **CI/CD** | GitHub Actions | Pipeline de tests et déploiement continu |

---

## 📌 Fonctionnalités

### Utilisateur
- 🛒 **E-commerce :** Consultation du catalogue, gestion du panier et commandes.
- 🔑 **Gestion de compte :** Création, connexion/déconnexion et suppression de compte.
- ⚙️ **Profil :** Modification des informations personnelles.

### Administrateur (RBAC)
- 📦 **Gestion du catalogue :** Ajout, mise à jour et suppression de produits (CRUD).
- 📜 **Suivi :** Gestion des commandes clients et des utilisateurs.

---

## 🛠️ Infrastructure & Sécurité (Focus DevOps)

Le déploiement est entièrement automatisé pour garantir la reproductibilité et la sécurité de l'environnement :

* **Provisionnement (Terraform) :** Création de l'instance EC2, configuration des Security Groups (Pare-feu) et gestion des clés SSH.
* **Configuration (Ansible) :** Installation automatique de Docker, durcissement du système Linux et configuration de **Fail2Ban** pour la protection contre les attaques par force brute (SSH/API).
* **Pipeline CI/CD :** * Exécution automatique des tests unitaires et d'intégration à chaque *push*.
    * Vérification de la logique de permissions pour éviter toute escalade de privilèges.
    * Déploiement automatique sur le serveur AWS via SSH après validation des tests.

---

## 📁 Structure du projet

```bash
DUCK23_Store/
│── terraform/            # Infrastructure as Code (AWS)
│── ansible/              # Automatisation de la configuration serveur
│── .github/workflows/    # Pipelines CI/CD (GitHub Actions)
│── backend/              # Code du backend Django
│   ├── accounts/         # Authentification et profils
│   ├── store/            # Logique métier (Produits/Commandes)
│── frontend/             # Code du frontend Angular
│   ├── src/app/          # Composants et Services
│   ├── src/environments/ # Configuration des URLs (Dev/Prod)
│── docker-compose.yml    # Orchestration des conteneurs
│── README.md             # Documentation principale

# 🚀 Installation et Lancement (Local)

## 🐋 Via Docker (Recommandé)

```bash
docker-compose up --build
```

> Le frontend sera disponible sur `http://localhost:4200` et l'API sur `http://localhost:8000`.

---

## 🛠️ Mode Développement Manuel

**Backend :**
```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

**Frontend :**
```bash
npm install
ng serve
```

---

## 📊 API Endpoints

| Méthode | Endpoint | Description | Accès |
|---------|----------|-------------|-------|
| `POST` | `/api/auth/register/` | Inscription | Public |
| `POST` | `/api/auth/login/` | Connexion | Public |
| `GET` | `/api/products/` | Liste produits | Public |
| `POST` | `/api/products/` | Ajout produit | Admin |
| `POST` | `/api/orders/` | Passer commande | Client |

---

## ⚠️ État du Déploiement Actuel (MVP)

Le projet est actuellement déployé sur **AWS** en tant que Produit Minimum Viable (MVP).

- **Frontend :** Servi via le serveur de développement Angular (Vite). Un overlay d'avertissement *"URI Malformed"* peut apparaître suite à la perte de connexion WebSocket de l'outil de développement en environnement distant *(sans impact sur les fonctionnalités métiers)*.
- **Backend :** API exposée directement sur le port `8000`, sécurisée par **Fail2Ban**.
- **Prochaine itération :** Intégration de **Nginx** en tant que Reverse Proxy pour unifier l'entrée sur le port `80`, servir les fichiers statiques optimisés et masquer les ports internes.

---

## 👤 Contributeur

**[Ho2bes](https://github.com/Ho2bes)** 

---

## 📜 Licence

Ce projet est sous licence **Apache License 2.0**.
