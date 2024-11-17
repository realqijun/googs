async function query(text) {
  const {available, defaultTemperature, defaultTopK, maxTopK } = await ai.languageModel.capabilities();
  if (available !== "no") {
    const session = await ai.languageModel.create();
    // Prompt the model and wait for the whole result to come back.  
    const result = await session.prompt(text);
    alert(text);
    alert(result.text);
  }
}
document.getElementById('prompt-text-area').addEventListener('keydown', async (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();

    const text = event.target.value.trim();
    if (text) {
      await query(text);
      event.target.value = '';
    }
  }
});