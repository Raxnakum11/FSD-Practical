# Practical-18 — Notes REST API

Simple Express + MongoDB REST API for a notes-taking mobile app.

Quick start

1. Copy `.env.example` to `.env` and set `MONGODB_URI` if needed.
2. Install dependencies:

   npm install

3. Start the server:

   npm start

API endpoints (base: http://localhost:4000/api/notes)

- POST /api/notes — create a note
  - body: { "title": "...", "content": "..." }
- GET /api/notes — list notes
- GET /api/notes/:id — single note
- PUT /api/notes/:id — update (body: title, content)
- DELETE /api/notes/:id — delete

Example curl

Create:
```
curl -X POST http://localhost:4000/api/notes -H "Content-Type: application/json" -d '{"title":"Note 1","content":"Hello"}'
```
List:
```
curl http://localhost:4000/api/notes
```

Test with Postman
- Import endpoints using the above URL patterns and send JSON bodies.
