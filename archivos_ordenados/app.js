// app.js
// Archivo principal que orquesta la aplicación. Contiene inicializaciones y listeners de eventos globales.
// Depende de domElements.js, constants.js, attendanceFlow.js, calendar.js, calculations.js, uiManagement.js

// Función para generar dinámicamente los botones de antigüedad
// Depende de domElements.js, constants.js, attendanceFlow.js
function generateAntiguedadOptions() {
    antiguedadOptionsContainer.innerHTML = ''; // Elemento de domElements.js
    // Mapeamos las claves de TABLA_ANTIGUEDAD para obtener los años y ordenarlos numéricamente
    const years = Object.keys(TABLA_ANTIGUEDAD).map(key => parseInt(key.replace(' años', ''))).sort((a, b) => a - b); // Constante de constants.js

    years.forEach(year => {
        const button = document.createElement('button');
        button.textContent = `${year} años`;
        button.onclick = () => selectAntiguedad(year); // Función de attendanceFlow.js
        antiguedadOptionsContainer.appendChild(button); // Elemento de domElements.js
    });
}


// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar el calendario con el mes actual
    generateCalendar(); // Función de calendar.js

    // Calcular y mostrar el total de la quincena al cargar
    calculateQuincenaTotal(); // Función de calculations.js

    // Generar los botones de antigüedad dinámicamente
    generateAntiguedadOptions(); // Esta misma función

    // Reiniciar la interfaz a su estado inicial
    resetInterface(); // Función de uiManagement.js

    // Asignar event listeners a los botones principales
    // Botones de Turno (en attendanceFlow.js, pero los listeners se asignan aquí)
    document.getElementById('mananaBtn').onclick = () => selectTurno('manana');
    document.getElementById('tardeBtn').onclick = () => selectTurno('tarde');
    document.getElementById('nocheBtn').onclick = () => selectTurno('noche');

    // Botones de Fichaje Status
    document.getElementById('fichajeTempranoBtn').onclick = () => fichajeStatus('temprano');
    document.getElementById('fichajeTardeBtn').onclick = () => fichajeStatus('tarde');
    document.getElementById('confirmarHoraIngresoBtn').onclick = registerCustomEntryTime;

    // Botones de Categoría (asumiendo que están generados dinámicamente o tienen IDs)
    // Si no son dinámicos, deberías agregarlos aquí o en domElements.js
    document.getElementById('catMaestroButton').onclick = () => selectCategory('Maestro');
    document.getElementById('catOficialButton').onclick = () => selectCategory('Oficial');
    document.getElementById('catMedioOficialButton').onclick = () => selectCategory('Medio oficial');
    document.getElementById('catAyudanteButton').onclick = () => selectCategory('Ayudante');

    // Botones de Horas Extras
    document.getElementById('extraHoursYesBtn').onclick = () => handleExtraHours(true);
    document.getElementById('extraHoursNoBtn').onclick = () => handleExtraHours(false);
    document.getElementById('confirmExtraHoursBtn').onclick = registerExtraHours;

    // Botones de navegación del calendario
    prevMonthBtn.onclick = () => changeMonth(-1); // Elemento de domElements.js, función de calendar.js
    nextMonthBtn.onclick = () => changeMonth(1); // Elemento de domElements.js, función de calendar.js

    // Botones de edición
    cancelEditBtn.onclick = cancelEditing; // Elemento de domElements.js, función de calendar.js
    deleteRecordBtn.onclick = deleteRecord; // Elemento de domElements.js, función de calendar.js
});