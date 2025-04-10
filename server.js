// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets from /public
app.use(express.static(path.join(__dirname, 'public')));

// Parse JSON bodies from incoming requests
app.use(express.json());

// GET: Return JSON file contents from /data directory
app.get('/api/data/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'data', filename);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`⚠️ File not found: ${filename}`);
      return res.status(404).json({ error: 'File not found' });
    }

    try {
      const parsed = JSON.parse(data); // verify valid JSON
      res.json(parsed);
    } catch (parseErr) {
      console.error(`❌ Invalid JSON in ${filename}:`, parseErr);
      res.status(500).json({ error: 'Malformed JSON' });
    }
  });
});

// POST: Handle fake signup (no database)
app.post('/api/signup', (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: 'Name and email are required',
    });
  }

  console.log(`✅ Signup received: ${name} <${email}>`);
  res.json({
    success: true,
    message: 'Thank you for signing up to our newsletter!',
  });
});

// Catch-all: Send back index.html for frontend routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
