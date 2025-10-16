# Tuition Admin (practical-17)

Simple Node.js + Express admin panel to manage students (CRUD). Uses MongoDB via Mongoose and EJS for views.

Setup

1. Copy `.env.example` to `.env` and set `MONGODB_URI` if needed.
2. Install dependencies:

   npm install

3. Start the app:

   npm run dev    # requires nodemon installed globally or available in the workspace
   or
   npm start

Open http://localhost:3000

Notes
- Add, edit and delete students from the UI. All actions update the MongoDB database.
- If you don't have MongoDB running locally, set `MONGODB_URI` to your MongoDB Atlas URI.
# Tuition Admin (practical-17)

Simple admin panel to manage students using Express and MongoDB.

Quick start:

1. Install dependencies:

```bash
cd practical-17
npm install
```

2. Make sure MongoDB is running locally or set `MONGO_URI` env var.

3. Start the server:

```bash
node app.js
```

or for development with auto-reload:

```bash
npm run dev
```

4. Open http://localhost:4000 to use the basic UI.

API endpoints:
- GET /api/students
- POST /api/students
- GET /api/students/:id
- PUT /api/students/:id
- DELETE /api/students/:id

Notes:
- This is a minimal practical example. For production add validation, auth, and error handling.
