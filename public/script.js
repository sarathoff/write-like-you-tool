document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('generateForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const topic = document.getElementById('topic').value;
    const loading = document.getElementById('loading');
    const generatedContent = document.getElementById('generatedContent');

    loading.classList.remove('hidden');
    generatedContent.innerHTML = ''; // Clear previous content

    try {
      const response = await fetch('/.netlify/functions/server/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ topic })
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
});
