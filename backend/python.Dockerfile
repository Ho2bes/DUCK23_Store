FROM python:3.10-alpine3.22
WORKDIR /backend
COPY requirements.txt .
RUN pip install -r requirements.txt

# --- AJOUT IMPORTANT ---
# On copie tout le code et le fichier initial_data.json dans l'image
COPY . .
# -----------------------

# On précise le 0.0.0.0 pour que Docker expose bien le port
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
EXPOSE 8000
