const serverless = require('serverless-http');
const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');

const app = express();
app.use(bodyParser.json());

const genAI = new TextToSpeechClient();

app.post('/generate', async (req, res) => {
  const { topic } = req.body;

  try {
    const defaultText = "you are a famous copywriter and you are awarded for your best writing, you need to write content for the given topic which should be the human written content, the content should be undetectable even ai content analyser as much your content should be like a 100% human written the writing style should be clear and concise use some copywriting techniques to make the content more engaging and it should be no jargon the topic is about";
    const prompt = `${defaultText} ${topic}`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    res.json({ generated_text: text });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error generating content' });
  }
});

module.exports.handler = serverless(app);
