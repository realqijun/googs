// Scripts that has access to DOM(content) of website

const article = document.querySelector("article");

// `document.querySelector` may return null if the selector doesn't match anything.
if (article) {

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Check if the message contains a color property
    if (message.color) {
      // Use the color to modify the webpage
      document.body.style.backgroundColor = message.color;
      console.log(`Background color changed to: ${message.color}`);
    }
  });

  const text = article.textContent;
  const wordMatchRegExp = /[^\s]+/g; // Regular expression
  const words = text.matchAll(wordMatchRegExp);
  // matchAll returns an iterator, convert to array to get word count
  const wordCount = [...words].length;
  const readingTime = Math.round(wordCount / 200);
  const badge = document.createElement("p");
  // Use the same styling as the publish information in an article's header
  badge.classList.add("color-secondary-text", "type--caption");
  badge.textContent = `⏱️ ${readingTime} min read yeah buddy`;

  // Support for API reference docs
  const heading = article.querySelector("h1");
  // Support for article docs with date
  const date = article.querySelector("time")?.parentNode;

  (date ?? heading).insertAdjacentElement("afterend", badge);
}
