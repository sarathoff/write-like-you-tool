document.getElementById('generateForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  
  const topic = document.getElementById('topic').value;
  const loading = document.getElementById('loading');
  const generatedContent = document.getElementById('generatedContent');
  
  loading.classList.remove('hidden');
  generatedContent.innerHTML = ''; // Clear previous content

  try {
    const defaultText = "you are a famous copywriter and you are awarded for your best writing ,you need to write content for the given topic which should be the human written content ,the content should be undetectable even ai content analyser as much your content should be like a 100% human written the writing style should be clearn and concise use some copywriting techniques to make the content more engaging and it should be no jargon the topic is about"; // Set your default text here
    const response = await fetch('/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ topic, specialPrompt: defaultText })
    });
    
    const data = await response.json();
    loading.classList.add('hidden');

    // Remove asterisks from the generated text
    const processedText = data.generated_text.replace(/\*/g, '');

    // Process the generated text
    const paragraphs = processedText.split('\n').filter(p => p.trim() !== '');
    generatedContent.innerHTML = paragraphs.map(p => `<p class="generated-paragraph">${p}</p>`).join('');
  } catch (error) {
    console.error('Error:', error);
    loading.classList.add('hidden');
    generatedContent.innerHTML = '<p class="text-red-500">Error generating content</p>';
  }
});

// Event listener for the copy button
document.getElementById('copyButton').addEventListener('click', function() {
  // Select the generated content
  const generatedContent = document.getElementById('generatedContent');
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(generatedContent);
  selection.removeAllRanges();
  selection.addRange(range);
  
  // Copy the selected content
  document.execCommand('copy');
  
  // Deselect the content
  selection.removeAllRanges();

  // Show a message indicating the content has been copied
  alert('Content copied to clipboard!');
});
