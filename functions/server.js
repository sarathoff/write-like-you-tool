const express = require('express');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
const serverless = require('serverless-http');

// Load environment variables
dotenv.config();

const app = express();
const router = express.Router();

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, './public'))); // Adjust path as needed

// Load API key from environment variable
const genAI = new GoogleGenerativeAI({ apiKey: process.env.API_KEY });

// Route to serve the main HTML page
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public', 'index.html')); // Adjust path as needed
});

// Route to handle content generation
router.post('/generate', async (req, res) => {
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
    console.error(error);
    res.status(500).send('Error generating content');
  }
});

app.use('/.netlify/functions/server.js', router);

module.exports.handler = serverless(app);
