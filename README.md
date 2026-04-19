Steps to Start Testing
To verify the system, follow these steps in separate terminals:

Start Infrastructure:
```
cd autonomous-code-doc
docker-compose up -d
```
Start AI Server:
```
cd autonomous-code-doc/ai-server
.\venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
Start Backend:
```
cd autonomous-code-doc/backend
npm run dev
Start Frontend:
```
cd autonomous-code-doc/frontend
npm run dev     