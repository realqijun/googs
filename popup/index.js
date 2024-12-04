const inputPrompt = document.body.querySelector('#input-prompt');
const buttonPrompt = document.body.querySelector('#button-prompt');
const buttonReset = document.body.querySelector('#button-reset');
const elementResponse = document.body.querySelector('#response');
const elementLoading = document.body.querySelector('#loading');
const elementError = document.body.querySelector('#error');
const sliderTemperature = document.body.querySelector('#temperature');
const sliderTopK = document.body.querySelector('#top-k');
const labelTemperature = document.body.querySelector('#label-temperature');
const labelTopK = document.body.querySelector('#label-top-k');

const buttonGetHighlight = document.body.querySelector('#button-get-highlight');
const elementHighlight = document.body.querySelector('#highlight');

buttonGetHighlight.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'getHighlightedText' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        elementHighlight.textContent = 'Error: Unable to retrieve highlighted text.';
      } else if (!response?.highlightedText) {
        elementHighlight.textContent = 'No text highlighted';
      } else {
        inputPrompt.value = response?.highlightedText;
        buttonPrompt.removeAttribute('disabled');
      }
    });
  });
});

let session;

async function runPrompt(prompt, params) {
  try {
    if (!session) {
      session = await ai.languageModel.create(params);
    }
    const response = await session.prompt(prompt);
    console.log('Prompt response:', response);
    return response;
  } catch (e) {
    console.log('Prompt failed');
    console.error(e);
    console.log('Prompt:', prompt);
    // Reset session
    reset();
    throw e;
  }
}

async function reset() {
  if (session) {
    session.destroy();
  }
  session = null;
}

async function initDefaults() {
  if (!('languageModel' in ai)) {
    showResponse('Error: ai.languageModel API not supported in this browser');
    return;
  }
  const defaults = await ai.languageModel.capabilities();
  console.log('Model default:', defaults);
  if (defaults.available !== 'readily') {
    showResponse(
      `Model not yet available (current state: "${defaults.available}")`
    );
    return;
  }
  
  const initialTemperature = 0;
  const initialTopK = 2;

  sliderTemperature.value = initialTemperature;
  labelTemperature.textContent = initialTemperature;

  sliderTopK.value = initialTopK;
  labelTopK.textContent = initialTopK;
  
  sliderTopK.max = defaults.maxTopK;
}

initDefaults();

buttonReset.addEventListener('click', () => {
  hide(elementLoading);
  hide(elementError);
  hide(elementResponse);
  reset();
  buttonReset.setAttribute('disabled', '');
});

sliderTemperature.addEventListener('input', (event) => {
  labelTemperature.textContent = event.target.value;
  reset();
});

sliderTopK.addEventListener('input', (event) => {
  labelTopK.textContent = event.target.value;
  reset();
});

inputPrompt.addEventListener('input', () => {
  if (inputPrompt.value.trim()) {
    buttonPrompt.removeAttribute('disabled');
  } else {
    buttonPrompt.setAttribute('disabled', '');
  }
});

buttonPrompt.addEventListener('click', async () => {
  const prompt = inputPrompt.value.trim();
  showLoading();
  try {
    const params = {
      systemPrompt: 'Be a helpful assistant. Provide clear and concise answers as plain text only. Do not use markdown or HTML.',
      temperature: sliderTemperature.value,
      topK: sliderTopK.value
    };
    const response = await runPrompt(prompt, params);
    showResponse(response);
  } catch (e) {
    showError(e);
  }
});

function showLoading() {
  buttonReset.removeAttribute('disabled');
  hide(elementResponse);
  hide(elementError);
  show(elementLoading);
}

function showResponse(response) {
  hide(elementLoading);
  show(elementResponse);

  elementResponse.textContent = response;
}

function showError(error) {
  show(elementError);
  hide(elementResponse);
  hide(elementLoading);
  elementError.textContent = error;
}

function show(element) {
  element.removeAttribute('hidden');
}

function hide(element) {
  element.setAttribute('hidden', '');
}
