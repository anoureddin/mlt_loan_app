# Live Demo

https://mltloanapp-production.up.railway.app/

# Loan Approval

A full-stack project that lets you:

* submit a loan application and receive an instant ML prediction  
* browse / delete past requests  
* inspect EDA summaries, data-quality issues, and model metrics  
* run locally **or** with a two-container Docker stack (Django + Gunicorn, React + Nginx)

---

This project made by:

* **AHMAD NOUR EDDIN**: ahmad_299984
* **Zayn Alabdin Dagham**: zayn_alabdin_284541
* **MUHANNAD SHAKHASHERO**: muhannad_285093
* **ZEINA SAKER**: zeina_307021
* **مازن بابوجيان**: mazen_239200
* **هيثم الشرع**: Haitham_260572




## 1  Directory layout

```
repo-root/
│
├─ backend/              # Django project  (manage.py, loan_app/, requirements.txt …)
│
├─ frontend/             # Vite + React
│   ├─ public/           # logo, hero-image
│   └─ src/              # pages, components, styles
│
├─ eda_ml_data/          # CSVs and pickled model used by utils.py
│
├─ Dockerfile.backend    # multi-stage image for Django
├─ Dockerfile.frontend   # builder (Node)  +  runtime (Nginx)
├─ docker-compose.yml    # one-command dev / prod stack
└─ nginx.conf            # simple SPA config (history-fallback)
```

---

## 2  Running **locally** (no Docker)

You should have python3.12 or higher installed before running the next commands

```bash
# ① Python backend
cd backend
python -m venv venv
source venv/bin/activate           # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate           # first time only
python manage.py runserver 0.0.0.0:8000     # http://localhost:8000/api/requests/
```

You should have node installed before running the next commands

```bash
# ② React frontend (in another terminal)
cd frontend
npm install
npm run dev                        # http://localhost:5173
```

## 3  Running with **Docker + Compose**

```bash
# build & start both containers (first run takes a few minutes)
docker compose up --build        # add -d for detached

# run DB migrations inside the backend container
docker compose exec backend python manage.py migrate
```

* Frontend   → http://localhost:5173  
* Backend API → http://localhost:8000/api/requests/

Stop everything:

```bash
docker compose down              # add -v to remove volumes
```
