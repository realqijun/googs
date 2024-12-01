// Create a container for notes
const notesContainer = document.createElement("div");
notesContainer.id = "notes-container";
document.body.appendChild(notesContainer);

// Load saved notes for the current page
const pageKey = `notes-${window.location.hostname}`;
chrome.storage.local.get(pageKey, (data) => {
  if (data[pageKey]) {
    notesContainer.innerHTML = data[pageKey];
  }
});

// Add a note
function createNote() {
  const note = document.createElement("div");
  note.className = "note";
  note.contentEditable = "true";
  note.textContent = "New Note";
  notesContainer.appendChild(note);
  saveNotes();
}

// Save notes to Chrome's local storage
function saveNotes() {
  const notesHTML = notesContainer.innerHTML;
  chrome.storage.local.set({ [pageKey]: notesHTML });
}

// Add a button to create notes
const addButton = document.createElement("button");
addButton.id = "add-note-button";
addButton.textContent = "Add Note";
addButton.onclick = createNote;
document.body.appendChild(addButton);

// Clear all notes
function clearNotes() {
  if (confirm("Are you sure you want to clear all notes for this page?")) {
    while (notesContainer.firstChild) {
      notesContainer.removeChild(notesContainer.firstChild);
    }
  }
}

const clearButton = document.createElement("button");
clearButton.id = "clear-notes-button";
clearButton.textContent = "Clear Notes";
clearButton.onclick = clearNotes;
document.body.appendChild(clearButton);

const hideButton = document.createElement("button");
hideButton.id = "hide-notes-button";
hideButton.textContent = "Hide Notes";
hideButton.onclick = () => {
  notesContainer.style.display = notesContainer.style.display === "hidden" ? "block" : "hidden";
};
document.body.appendChild(hideButton);

// Listen for changes in the notes and save them
notesContainer.addEventListener("input", saveNotes);
