// appFunctions.js
// Contiene las funciones principales para la lógica de la aplicación,
// como el cálculo del total de la quincena, la edición de registros
// y la inicialización general.

/**
 * Calcula y muestra el salario total estimado para la quincena actual.
 * Considera días trabajados, horas extras, presentismo y sumas no remunerativas.
 */
function calculateQuincenaTotal() {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let quincenaStartDate;
    let quincenaEndDate;
    let isSecondQuincena = false;

    // Determinar la quincena actual
    if (currentDay >= 1 && currentDay <= 15) {
        quincenaStartDate = new Date(currentYear, currentMonth, 1);
        quincenaEndDate = new Date(currentYear, currentMonth, 15);
    } else {
        quincenaStartDate = new Date(currentYear, currentMonth, 16);
        quincenaEndDate = new Date(currentYear, currentMonth + 1, 0); // Último día del mes
        isSecondQuincena = true;
    }

    let totalSalarioBaseMasExtras = 0;
    let daysWorkedInQuincena = 0;
    let absencesCount = 0;

    // Iterar sobre los registros de trabajo para la quincena
    for (const dateKey in workRecords) {
        const [year, month, day] = dateKey.split('-').map(Number);
        const recordDate = new Date(year, month - 1, day);

        if (recordDate >= quincenaStartDate && recordDate <= quincenaEndDate) {
            const record = workRecords[dateKey];
            totalSalarioBaseMasExtras += record.salario_bruto_diario;
            if (record.category !== 'Ausencia Injustificada') {
                daysWorkedInQuincena++;
            } else {
                absencesCount++;
            }
        }
    }

    let presentismoQuincenalImpact = '';
    if (absencesCount === 1) {
        presentismoQuincenalImpact = ' (1 ausencia impacta presentismo)';
    } else if (absencesCount === 2) {
        presentismoQuincenalImpact = ' (2 ausencias impactan presentismo)';
    } else if (absencesCount > 2) {
        presentismoQuincenalImpact = ` (${absencesCount} ausencias impactan presentismo)`;
    } else {
        presentismoQuincenalImpact = ' (0 ausencias)';
    }

    let montoSumaNoRemunerativa = 0;
    const currentMonthName = Object.keys(MONTH_NAMES_MAP).find(key => MONTH_NAMES_MAP[key] === currentMonth + 1);

    if (isSecondQuincena) {
        montoSumaNoRemunerativa = SUMA_NO_REMUN[currentMonthName] || 0;
        if (montoSumaNoRemunerativa === 0) {
            console.warn(`No se encontró Suma No Remunerativa para el mes de ${currentMonthName}. Usando 0.`);
        }
    }

    // El salario final de la quincena es la suma de los salarios diarios brutos (que ya incluyen presentismo diario)
    // más la suma no remunerativa si aplica.
    const salarioFinalQuincena = totalSalarioBaseMasExtras + montoSumaNoRemunerativa;

    quincenaDisplay.innerHTML = `
        <p><strong>Salario Estimado esta Quincena (${quincenaStartDate.toLocaleDateString('es-AR')} - ${quincenaEndDate.toLocaleDateString('es-AR')})</strong></p>
        <p>Total de Salario por Jornadas y Horas Extras (incluye presentismo diario): <strong>${formatCurrency(totalSalarioBaseMasExtras)}</strong></p>
        <p>Impacto de Presentismo Quincenal: ${presentismoQuincenalImpact}</p>
        <p>Suma No Remunerativa (solo 2da Quincena): <strong>${formatCurrency(montoSumaNoRemunerativa)}</strong></p>
        <p>Salario Total Estimado de la Quincena: <strong>${formatCurrency(salarioFinalQuincena)}</strong> (${daysWorkedInQuincena} días registrados, ${absencesCount} ausencias)</p>
    `;
}

/**
 * Inicia el modo de edición para un día específico o permite agregar un nuevo registro.
 * @param {string} dateKey - La clave de la fecha (YYYY-MM-DD) del día a editar.
 */
function editDayRecord(dateKey) {
    hideAllSteps();
    editingMessage.style.display = 'block';

    const [year, month, day] = dateKey.split('-').map(Number);
    const displayDate = new Date(year, month - 1, day, 12, 0, 0);

    editingDateDisplay.textContent = displayDate.toLocaleDateString('es-AR');

    isEditingMode = true;
    editingDateKey = dateKey;

    const record = workRecords[dateKey];

    if (record) {
        selectedTurno = record.turno;
        const [recordedHours, recordedMinutes] = record.entrada.split(':').map(Number);
        entryTime = new Date(year, month - 1, day, recordedHours, recordedMinutes, 0);
        selectedCategory = record.category;
        selectedAntiguedad = record.antiguedad_anos;
        extraHoursMade = record.horas_extras;

        deleteRecordBtn.style.display = 'block';

        resultDisplay.textContent = `Editando registro para el ${displayDate.toLocaleDateString('es-AR')}.`;

        stepSelectTurno.style.display = 'block';
    } else {
        selectedTurno = null;
        entryTime = null;
        selectedCategory = null;
        selectedAntiguedad = null;
        extraHoursMade = 0;
        inputHoraIngreso.value = '';
        inputExtraHours.value = '1';
        deleteRecordBtn.style.display = 'none';
        resultDisplay.textContent = `Agregando registro para el ${displayDate.toLocaleDateString('es-AR')}.`;
        stepSelectTurno.style.display = 'block';
    }
}

/**
 * Cancela el modo de edición y reinicia la interfaz a su estado inicial.
 */
function cancelEditing() {
    resetInterface();
    resultDisplay.textContent = 'Edición cancelada. Selecciona tu turno para empezar un nuevo registro.';
    generateCalendar();
    calculateQuincenaTotal();
}

/**
 * Elimina un registro de trabajo del almacenamiento local para la fecha de edición actual.
 * Solicita confirmación al usuario antes de eliminar.
 */
function deleteRecord() {
    if (confirm(`¿Estás seguro de que quieres eliminar el registro para el día ${editingDateDisplay.textContent}?`)) {
        delete workRecords[editingDateKey];
        localStorage.setItem('workRecords', JSON.stringify(workRecords));
        resetInterface();
        generateCalendar();
        calculateQuincenaTotal();
        resultDisplay.textContent = `Registro para el ${editingDateDisplay.textContent} eliminado.`;
    }
}

/**
 * Genera dinámicamente los botones de opción de antigüedad basados en `TABLA_ANTIGUEDAD`.
 */
function generateAntiguedadOptions() {
    antiguedadOptionsContainer.innerHTML = '';
    const years = Object.keys(TABLA_ANTIGUEDAD).map(key => parseInt(key.replace(' años', ''))).sort((a, b) => a - b);

    years.forEach(year => {
        const button = document.createElement('button');
        button.classList.add('secondary'); // Añadir clase 'secondary' como en eventListeners.js
        button.textContent = `${year} años`;
        button.onclick = () => selectAntiguedad(year);
        antiguedadOptionsContainer.appendChild(button);
    });
}

import { calculateQuincenaTotal } from './calculations.js';

export function renderQuincenaResumen() {
  const resumen = calculateQuincenaTotal();
  const quincenaDisplay = document.getElementById('quincena-display');

  if (!quincenaDisplay) return;

  quincenaDisplay.innerHTML = `
    <h2>Resumen de la Quincena</h2>
    <p><strong>Total base + extras:</strong> ${formatCurrency(resumen.totalSalarioBaseMasExtras)}</p>
    <p><strong>Presentismo:</strong> ${formatCurrency(resumen.totalPresentismo)}</p>
    <p><strong>Total con presentismo:</strong> ${formatCurrency(resumen.totalConPresentismo)}</p>
  `;
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    generateAntiguedadOptions();
    generateCalendar();
    calculateQuincenaTotal();
    resetInterface();
});