const express = require('express');
const router = express.Router();
const Student = require('../models/student');

// Home - list students
router.get('/', async (req, res, next) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.render('index', { students });
  } catch (err) {
    next(err);
  }
});

// Also support /students URL (some users try that)
router.get('/students', async (req, res, next) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.render('index', { students });
  } catch (err) {
    next(err);
  }
});

// Show add form
router.get('/students/new', (req, res) => {
  res.render('add');
});

// Create student
router.post('/students', async (req, res, next) => {
  try {
    const { name, age, email, phone, course } = req.body;
    console.log('POST /students body:', req.body);
    const student = new Student({ name, age, email, phone, course });
    const saved = await student.save();
    console.log('Saved student _id:', saved._id);
    res.redirect('/');
  } catch (err) {
    console.error('Error saving student:', err);
    next(err);
  }
});

// Edit form
router.get('/students/:id/edit', async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).send('Student not found');
    res.render('edit', { student });
  } catch (err) {
    next(err);
  }
});

// Update student
router.put('/students/:id', async (req, res, next) => {
  try {
    const { name, age, email, phone, course } = req.body;
    console.log('PUT /students/%s body: %j', req.params.id, req.body);

    // Build update object only with provided (non-empty) values to avoid casting errors
    const update = {};
    if (typeof name !== 'undefined') update.name = name;
    if (typeof age !== 'undefined' && age !== '') update.age = Number(age);
    if (typeof email !== 'undefined') update.email = email;
    if (typeof phone !== 'undefined') update.phone = phone;
    if (typeof course !== 'undefined') update.course = course;

    const updated = await Student.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    console.log('Updated student:', updated && updated._id ? updated._id : 'not found');
    res.redirect('/');
  } catch (err) {
    console.error('Error updating student:', err);
    next(err);
  }
});

// Delete student
router.delete('/students/:id', async (req, res, next) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
