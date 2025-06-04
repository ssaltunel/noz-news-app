// server.js
const express = require('express');
const Parser = require('rss-parser');
const cors = require('cors');

const app = express();
const parser = new Parser();

app.use(cors());

app.get('/api/rss', async (req, res) => {
  try {
    const feed = await parser.parseURL('https://www.noz.de/rss');
    res.json(feed);
  } catch (err) {
    res.status(500).json({ error: 'RSS fetch error' });
  }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`RSS proxy running on port ${PORT}`));
