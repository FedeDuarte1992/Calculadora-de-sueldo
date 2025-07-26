// globalState.js
// Contiene las variables de estado global de la aplicación.

(function() { // ASEGÚRATE DE QUE ESTE ES EL PRIMER CARÁCTER EN LA LÍNEA 1
    let selectedTurno = null;
    let selectedCategory = null;
    let selectedAntiguedad = null;
    let entryTime = null;
    let extraHoursMade = 0;
    let currentDate = new Date(); // La fecha actual para el calendario
    let isEditingMode = false;
    let editingDateKey = null;

    // Exponer estas variables al ámbito global (window)
    window.selectedTurno = selectedTurno;
    window.selectedCategory = selectedCategory;
    window.selectedAntiguedad = selectedAntiguedad;
    window.entryTime = entryTime;
    window.extraHoursMade = extraHoursMade;
    window.currentDate = currentDate;
    window.isEditingMode = isEditingMode;
    window.editingDateKey = editingDateKey;

    // IMPORTANTE: Si tienes más variables en globalState.js, también deben ir dentro de esta IIFE
    // y ser expuestas a window si son usadas en otros archivos.
})();