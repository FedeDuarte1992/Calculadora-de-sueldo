// history.js
// Contiene funciones para gestionar y mostrar el historial de registros.
// Depende de domElements.js

function addRecordToHistory(recordText) {
    const listItem = document.createElement('li');
    listItem.textContent = recordText;
    historyList.prepend(listItem); // Elemento de domElements.js
}