const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const COUNT_FILE = path.join(__dirname, 'count.txt');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

function readCount() {
  try {
    return parseInt(fs.readFileSync(COUNT_FILE, 'utf8')) || 0;
  } catch {
    return 0;
  }
}

function writeCount(count) {
  fs.writeFileSync(COUNT_FILE, String(count));
}

app.get('/api/count', (req, res) => {
  res.json({ count: readCount() });
});

app.post('/api/count', (req, res) => {
  let { action } = req.body;
  let count = readCount();
  if (action === 'inc') count++;
  if (action === 'dec' && count > 0) count--;
  if (action === 'reset') count = 0;
  writeCount(count);
  res.json({ count });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
