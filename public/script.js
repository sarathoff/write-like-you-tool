document.getElementById('generateForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  
  const topic = document.getElementById('topic').value;
  const loading = document.getElementById('loading');
  const generatedContent = document.getElementById('generatedContent');
  
  loading.classList.remove('hidden');
  generatedContent.innerHTML = ''; // Clear previous content

  try {
    const defaultText = "you are a famous copywriter and you are awarded for your best writing, you need to write content for the given topic which should be the human written content, the content should be undetectable even ai content analyser as much your content should be like a 100% human written the writing style should be clear and concise use some copywriting techniques to make the content more engaging and it should be no jargon the topic is about"; // Set your default text here
    const response = await fetch('/.netlify/functions/server.js/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ topic, specialPrompt: defaultText })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    loading.classList.add('hidden');

    // Process the generated text
    const paragraphs = data.generated_text.split('\n').filter(p => p.trim() !== '');
    generatedContent.innerHTML = paragraphs.map(p => `<p class="generated-paragraph">${p}</p>`).join('');
  } catch (error) {
    console.error('Error:', error);
    loading.classList.add('hidden');
    generatedContent.innerHTML = '<p class="text-red-500">Error generating content</p>';
  }
});
