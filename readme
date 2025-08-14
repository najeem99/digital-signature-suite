# 📄 PDF Signing App

A full‑stack PDF signing suite built with:

- **Backend**: Node.js + Express (TypeScript) in `/backend`
- **Frontend**: React (TypeScript) in `/frontend`
- **Package management**: npm Workspaces
- **Database**: PostgreSQL running in Docker
- **Local Development Optimized**: Docker Compose for the database, npm workspaces for code

---

## 📂 Project Structure

pdf-signing-app/
│
├── backend/ # Express + TypeScript API server
├── frontend/ # React web app
├── package.json # Root workspace config & scripts
├── docker-compose.yml # Local PostgreSQL service
└── README.md

 

---

## 🛠 Requirements

- Node.js v18 or later
- npm v9 or later
- Docker & Docker Compose (for the local PostgreSQL database)
- (Optional) Cloudinary account for media storage

---

## ⚙️ Installation

From the **root of the repo**:

Install all dependencies for both frontend & backend using npm workspaces
npm run install-all

 

---

## 🐘 Local Database (Docker)

This project includes a `docker-compose.yml` for running PostgreSQL locally.

### Start the database container
docker compose up -d

 

### Service details
- **Image**: `postgres`
- **Host (outside Docker)**: `localhost`
- **Port**: `5433` (mapped to container's `5432`)
- **Database name**: `pdf_signing`
- **User**: `postgres`
- **Password**: `postgres`
- **Data persistence**: stored in `db` named volume

### Connection string examples

- **Backend running on host machine**:
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/pdf_signing

 

- **Backend running inside Docker on same network (`db`)**:
DATABASE_URL=postgresql://postgres:postgres@pdf-signing-db:5432/pdf_signing

 

---

## 🚀 Running Locally

Start both frontend & backend in dev mode together (requires local DB to be running):

npm run dev

 

- **Frontend**: http://localhost:3000  
- **Backend**: http://localhost:5000 (or `process.env.PORT`)

Run only one part:

npm run start:frontend # start frontend only
npm run start:backend # start backend only

 

---

## 🗄 Environment Variables

### Backend (`/backend/.env`)
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/pdf_signing
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

 

**Note:**  
- For local Docker DB, ensure `docker compose up -d` is running.
- Use the correct host/port combination depending on whether backend is inside Docker or running directly on your host.

### Frontend (`/frontend/.env`)
VITE_API_URL=http://localhost:5000

 
This should point to your local backend API.

---

## 🏗 Building for Production (local)

Build both frontend & backend:

npm run build

 

This will:
- Compile backend TypeScript into `/backend/dist`
- Build frontend static assets into `/frontend/build` (or `/frontend/dist` if using Vite)

---

## 🧰 Useful Scripts

| Command                  | Description                            |
|--------------------------|----------------------------------------|
| `npm run install-all`    | Install dependencies in all workspaces |
| `npm run dev`            | Run frontend & backend together        |
| `npm run start:frontend` | Start frontend only                     |
| `npm run start:backend`  | Start backend only                      |
| `npm run build`          | Build all workspaces                    |

---

## 🐳 Docker Database Service (from `docker-compose.yml`)
services:
db:
container_name: pdf-signing-db
image: postgres
environment:
POSTGRES_USER: postgres
POSTGRES_PASSWORD: postgres
PGDATA: /data/postgres
POSTGRES_DB: pdf_signing
volumes:
- db:/data/postgres
ports:
- "5433:5432"
networks:
- db
restart: unless-stopped
healthcheck:
test: [ "CMD-SHELL", "pg_isready -d postgres" ]
interval: 30s
timeout: 10s
retries: 5

networks:
db:
driver: bridge

volumes:
db:

 

---

## 📌 Notes
- This setup is meant for **local development**.
- The backend listens on `process.env.PORT` if defined, otherwise defaults to `5000`.
- Database credentials here are **development defaults**; change them for any real deployment.
- Keep `frontend` and `backend` folders isolated in the monorepo; changes in one don’t trigger rebuilds in the other unless needed.

---

## 📄 License
MIT
