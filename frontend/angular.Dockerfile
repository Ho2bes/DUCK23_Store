# Utiliser une image Node officielle (version LTS conseillée)
FROM node:20-alpine

# Définir le dossier de travail dans le conteneur
WORKDIR /app

# Copie les fichiers de dépendances en premier (pour le cache Docker)
COPY package*.json ./

# On ajoute cette ligne pour sauver le disque dur :
ENV PUPPETEER_SKIP_DOWNLOAD=true

# Installe les dépendances (Angular CLI inclus si dans devDependencies)
RUN npm install
# Si pas Angular CLI en dépendance locale, décommenter la ligne suivante :
# RUN npm install -g @angular/cli

# Copier le reste du code
COPY . .

# Exposer le port par défaut d'Angular
EXPOSE 4200

# Lancer le serveur de développement
# --host 0.0.0.0 est CRUCIAL pour que Docker expose le site vers l'extérieur
# --disable-host-check évite les erreurs de sécurité liées au nom d'hôte Docker
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--disable-host-check"]
