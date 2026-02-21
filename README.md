# TechKhit

## Quick Start (Docker, Recommended)

1. Clone from GitHub.
2. Run:

```bash
npm run setup:docker
```

3. Open:
- App: `http://localhost:8080`
- Backend API: `http://localhost:8080/api`
- Translator health: `http://localhost:8080/translator/health`

First translator startup may take longer because it downloads the model from Hugging Face and caches it in a Docker volume.

## Docker Services

- `frontend` (React, served by Nginx container)
- `backend` (Node/Express API)
- `translator` (Python/Flask + Hugging Face NLLB model)
- `mongo` (MongoDB)
- `proxy` (Nginx reverse proxy on port `8080`)

## Docker Commands

```bash
npm run setup:docker
npm run docker:up
npm run docker:logs
npm run docker:down
npm run docker:down:volumes
```

## Local Dev (without Docker)

1. Install dependencies:

```bash
npm install
cd backend/server && npm install
cd ../../frontend/client && npm install
```

2. Install translator Python dependencies:

```bash
cd backend/server
pip install -r requirements.txt
```

3. Run all services:

```bash
cd ../../
npm run start-all
```

## Translator Configuration

- `NLLB_MODEL_NAME` (default: `facebook/nllb-200-distilled-600M`)
- `NLLB_CACHE_DIR` (default: `backend/server/.model_cache` locally, `/app/.model_cache` in Docker)
- `TRANSLATOR_URL` for backend (default: `http://localhost:8000`)

## Notes

- Myanmar text/font rendering was not changed in the frontend.
- Translator uses local-cache-first loading and auto-download fallback from official Hugging Face model repo.
