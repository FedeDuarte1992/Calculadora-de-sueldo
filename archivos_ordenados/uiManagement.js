// uiManagement.js
// Contiene funciones para manipular la interfaz de usuario (mostrar/ocultar elementos, reiniciar la vista).
// Depende de domElements.js y globalState.js

// Función para ocultar todos los pasos de entrada
function hideAllSteps() {
    stepSelectTurno.style.display = 'none';
    stepFichajeStatus.style.display = 'none';
    stepInputHora.style.display = 'none';
    inputHoraIngreso.value = ''; // Limpiar el input al ocultarlo
    stepSelectCategory.style.display = 'none';
    stepSelectAntiguedad.style.display = 'none';
    stepExtraHours.style.display = 'none';
    extraHoursInputGroup.style.display = 'none'; // También ocultar el grupo de input de horas extras
    editingMessage.style.display = 'none';
}

// Función para reiniciar el estado de la interfaz y variables globales
function resetInterface() {
    hideAllSteps();
    stepSelectTurno.style.display = 'block'; // Mostrar el primer paso

    // Resetear variables de estado (definidas en globalState.js)
    selectedTurno = null;
    entryTime = null;
    selectedCategory = null;
    selectedAntiguedad = null;
    extraHoursMade = 0;
    isEditingMode = false;
    editingDateKey = null;

    inputHoraIngreso.value = '';
    inputExtraHours.value = '1';
    resultDisplay.textContent = 'Selecciona un día en el calendario o tu turno para empezar un nuevo registro.';
    deleteRecordBtn.style.display = 'none';
}

// Funciones para añadir/eliminar registros del historial (se moverán aquí si las tienes)
// function addRecordToHistory(record) { ... }
// function removeRecordFromHistory(dateKey) { ... }
// function updateHistoryDisplay() { ... }

function addRecordToHistory(recordText) {
    const listItem = document.createElement('li');
    listItem.textContent = recordText;
    historyList.prepend(listItem);
}

