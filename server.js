const express = require('express');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Load API key from environment variable
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Route to serve the main HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to handle content generation
app.post('/generate', async (req, res) => {
  let { topic, specialPrompt } = req.body;

  // Set default special prompt if not provided by the user
  if (!specialPrompt) {
    specialPrompt = "you are a copywriter and you are awarded for your writing , you need to write content about the given topic which should be seen like human generated content it should be engaging and jargon less and easy to readable and don't use asterisk(*) sign, tone should be clear and concise use emojis where ever needed "; // Replace this with your default prompt
  }

  try {
    // Combine user topic with the special prompt
    const combinedPrompt = `${specialPrompt} ${topic}`;

    // Request content generation with the combined prompt
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(combinedPrompt);
    const response = await result.response;
    let text = await response.text();

    // Remove asterisks from the generated text
    text = text.replace(/\*/g, '');

    res.json({ generated_text: text });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating content');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
