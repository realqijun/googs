async function main() {
  let [tab] = await chrome.tabs.query({ active: true});
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
      alert('Hello from index.js');
    }
  });
}
document.getElementById('run-ai').addEventListener('click', main);