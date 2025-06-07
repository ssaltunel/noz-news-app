require('dotenv').config();
const express = require('express');
const Parser = require('rss-parser');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
const parser = new Parser();

app.use(cors());
app.use(express.json());

if (!process.env.OPENAI_API_KEY) {
  console.error("FATAL ERROR: OPENAI_API_KEY is not set in your .env");
  process.exit(1);
}

console.log(process.env.OPENAI_API_KEY);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// RSS feed endpoint
app.get('/api/rss', async (req, res) => {
  try {
    const feed = await parser.parseURL('https://www.noz.de/rss');
    res.json(feed);
  } catch (err) {
    console.error('RSS fetch error:', err);
    res.status(500).json({ error: 'Could not fetch RSS feed.' });
  }
});

// Chat endpoint expecting { message, newsTitle, newsContent }
app.post('/api/chat', async (req, res) => {
  const { message, newsTitle, newsContent } = req.body;

  if (!message) return res.status(400).json({ error: 'Message is required' });

  const sanitizedContent = newsContent ? newsContent.substring(0, 12000) : '';

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant summarizing German news articles for the user.`
        },
        {
          role: 'user',
          content: `Article Title: "${newsTitle}"\nArticle Content: ${sanitizedContent}\nQuestion: ${message}`
        }
      ],
    });

    const answer = completion.choices[0].message.content;
    res.json({ reply: answer });
  } catch (error) {
    console.error('OpenAI error:', error);
    res.status(500).json({ error: 'AI communication error.' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
