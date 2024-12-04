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
  const button = createRemoveButton();
  note.className = "note";
  note.contentEditable = "true";
  note.appendChild(button);
  note.addEventListener("mouseover", () => showRemoveButton(button));
  notesContainer.appendChild(note);
  saveNotes();
}

function createRemoveButton() {
    const removeButton = document.createElement("button");
    removeButton.className = "remove-note-button";
    removeButton.textContent = "X";
    removeButton.contentEditable = "false";
    removeButton.addEventListener("click", () => deleteNote(removeButton.parentNode));
    return removeButton;
}

// Save notes to Chrome's local storage
function saveNotes() {
  const notesHTML = notesContainer.innerHTML;
  chrome.storage.local.set({ [pageKey]: notesHTML });
}

function showRemoveButton(button) {
    button.style.display = "inline-block";
}

function deleteNote(note) {
  EventTarget.parentNode.remove();
  saveNotes();
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
    saveNotes(); // Save changes
  }
}

const clearButton = document.createElement("button");
clearButton.id = "clear-notes-button";
clearButton.textContent = "Clear Notes";
clearButton.onclick = clearNotes;
document.body.appendChild(clearButton);

function deleteNote(note) {
    if (confirm("Are you sure you want to delete this note?")) {
      notesContainer.removeChild(note);
    }
};

const hideButton = document.createElement("button");
hideButton.id = "hide-notes-button";
hideButton.textContent = "Hide Notes";
hideButton.onclick = () => {
  const notes = notesContainer.getElementsByClassName("note");
  for (const note of notes) {
    note.setAttribute("hidden", ""); // Hide each note
  }
  showButton.style.display = "inline-block";
};
document.body.appendChild(hideButton);

const showButton = document.createElement("button");
showButton.id = "show-notes-button";
showButton.textContent = "Show Notes";
showButton.style.display = "none";
showButton.onclick = () => {
  const notes = notesContainer.getElementsByClassName("note");
  for (const note of notes) {
    note.removeAttribute("hidden"); // Show each note
  }
  showButton.style.display = "none";
};
document.body.appendChild(showButton);

// Listen for changes in the notes and save them
notesContainer.addEventListener("input", saveNotes);
