FROM python:3.10-alpine3.22
WORKDIR /backend
COPY requirements.txt .
RUN pip install -r requirements.txt
CMD ["python", "manage.py", "runserver"]
EXPOSE 8000
