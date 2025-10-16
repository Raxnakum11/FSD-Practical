const express = require('express');
const router = express.Router();
const Note = require('../models/note');

// Create a note
router.post('/', async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const note = new Note({ title, content });
    const saved = await note.save();
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
});

// Read all notes
router.get('/', async (req, res, next) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    next(err);
  }
});

// Read single note
router.get('/:id', async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Not found' });
    res.json(note);
  } catch (err) {
    next(err);
  }
});

// Update note
router.put('/:id', async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const updated = await Note.findByIdAndUpdate(req.params.id, { title, content }, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Delete note
router.delete('/:id', async (req, res, next) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
