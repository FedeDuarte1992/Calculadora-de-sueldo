// domElements.js
// Contiene las referencias a todos los elementos del DOM utilizados en la aplicación.

// NO DEBE HABER DECLARACIONES 'let' O 'const' AQUÍ FUERA DE LA FUNCIÓN
document.addEventListener('DOMContentLoaded', () => {
    
    // TODAS las asignaciones de elementos DOM a 'window' deben estar aquí
    window.stepSelectTurno = document.getElementById('step-select-turno');
    window.stepFichajeStatus = document.getElementById('step-fichaje-status');
    window.stepInputHora = document.getElementById('step-input-hora');
    window.inputHoraIngreso = document.getElementById('input-hora-ingreso');
    window.stepSelectCategory = document.getElementById('step-select-category');
    window.stepSelectAntiguedad = document.getElementById('step-select-antiguedad');
    window.antiguedadOptionsContainer = document.getElementById('antiguedad-options');

    window.stepExtraHours = document.getElementById('step-extra-hours');
    window.extraHoursInputGroup = document.getElementById('extra-hours-input-group');
    window.inputExtraHours = document.getElementById('input-extra-hours');
    window.resultDisplay = document.getElementById('result');
    window.historyList = document.getElementById('history-list');
    window.quincenaDisplay = document.getElementById('quincena-display');
    window.editingMessage = document.getElementById('editing-message');
    window.editingDateDisplay = document.getElementById('editing-date-display');
    window.deleteRecordBtn = document.getElementById('delete-record-btn');

    window.currentMonthYearDisplay = document.getElementById('current-month-year');
    window.calendarDaysGrid = document.getElementById('calendar-days');

    window.prevMonthBtn = document.getElementById('prevMonthBtn');
    window.nextMonthBtn = document.getElementById('nextMonthBtn');
    window.cancelEditBtn = document.getElementById('cancelEditBtn');

    // **IMPORTANTE: Asegúrate de que estos IDs existan en tu HTML**
    window.mananaBtn = document.getElementById('mananaBtn');
    window.tardeBtn = document.getElementById('tardeBtn');
    window.nocheBtn = document.getElementById('nocheBtn');
    window.fichajeTempranoBtn = document.getElementById('fichajeTempranoBtn');
    window.fichajeTardeBtn = document.getElementById('fichajeTardeBtn');
    window.confirmarHoraIngresoBtn = document.getElementById('confirmarHoraIngresoBtn');
    window.extraHoursYesBtn = document.getElementById('extraHoursYesBtn');
    window.extraHoursNoBtn = document.getElementById('extraHoursNoBtn');
    window.confirmExtraHoursBtn = document.getElementById('confirmExtraHoursBtn');
    window.clearHistoryBtn = document.getElementById('clearHistoryBtn'); 
});