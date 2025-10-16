require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');

const notesRouter = require('./routes/notes');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/notes_db';
console.log('Using MONGO URI:', mongoUri);
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/notes', notesRouter);

// basic root
app.get('/', (req, res) => {
  res.type('html').send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>Notes API</title>
        <style>
          body{font-family:Arial,Helvetica,sans-serif;background:#f7f7f7;color:#222;padding:30px}
          .card{max-width:800px;margin:40px auto;padding:20px;background:#fff;border-radius:6px;box-shadow:0 2px 10px rgba(0,0,0,.06)}
          h1{margin-top:0}
          pre{background:#111;color:#0f0;padding:12px;border-radius:4px;overflow:auto}
          a.api{display:inline-block;margin-right:10px;padding:6px 10px;background:#007acc;color:#fff;border-radius:4px;text-decoration:none}
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Notes API</h1>
          <p>REST endpoints for the notes-taking app. Use Postman, curl or your mobile client.</p>
          <p>
            <a class="api" href="/api/notes">GET /api/notes</a>
            <a class="api" href="/api/notes">POST /api/notes</a>
          </p>
          <h3>Examples</h3>
          <pre>GET  /api/notes
POST /api/notes  {"title":"...","content":"..."}
GET  /api/notes/:id
PUT  /api/notes/:id  {"title":"...","content":"..."}
DELETE /api/notes/:id</pre>
          <p>See <code>README.md</code> in the project root for curl/Postman examples.</p>
        </div>
      </body>
    </html>
  `);
});

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

module.exports = app;
