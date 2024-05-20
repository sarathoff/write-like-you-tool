const express = require('express');
const serverless = require('serverless-http');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.post('/generate', async (req, res) => {
  const { topic, specialPrompt } = req.body;
  const prompt = `${specialPrompt} ${topic}`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    res.json({ generated_text: text });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating content');
  }
});

module.exports.handler = serverless(app);
