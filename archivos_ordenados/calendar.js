// calendar.js
// Contiene la lógica para la visualización y navegación del calendario.
// Depende de domElements.js, globalState.js, constants.js, utils.js, calculations.js (para calculateQuincenaTotal)

// Función para generar y mostrar el calendario
function generateCalendar() {
    calendarDaysGrid.innerHTML = '';

    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();

    currentMonthYearDisplay.textContent = `${MONTH_NAMES[month]} ${year}`;

    const firstDayOfMonth = new Date(year, month, 1);
    let startDay = firstDayOfMonth.getDay();
    if (startDay === 0) startDay = 7;
    startDay--;

    for (let i = 0; i < startDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.classList.add('calendar-day');
        calendarDaysGrid.appendChild(emptyDay);
    }

    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day');
        
        const currentDayDate = new Date(year, month, day);
        const today = new Date();

        if (currentDayDate.toDateString() === today.toDateString()) {
            dayElement.classList.add('today');
        }

        const dayNumberSpan = document.createElement('span');
        dayNumberSpan.classList.add('day-number');
        dayNumberSpan.textContent = day;
        dayElement.appendChild(dayNumberSpan);

        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        dayElement.setAttribute('data-date-key', dateKey);
        
        dayElement.addEventListener('click', () => editDayRecord(dateKey));

        if (workRecords[dateKey]) {
            dayElement.classList.add('recorded-day');
            const record = workRecords[dateKey];
            
            // Mostrar horas de entrada/salida y horas trabajadas
            const workedHoursSpan = document.createElement('span');
            workedHoursSpan.classList.add('worked-hours');
            workedHoursSpan.classList.add(record.turno);
            
            let displayHours = `${record.entrada} - ${record.salida}`;
            if (record.turno === 'noche' && record.entrada === HORAS_ESTANDAR_INGRESO.noche) {
                displayHours = `${record.entrada} - ${record.salida} (+1 día)`;
            } else if (record.turno === 'noche' && parseInt(record.entrada.split(':')[0]) >= parseInt(HORAS_ESTANDAR_INGRESO.noche.split(':')[0])) {
                displayHours = `${record.entrada} - ${record.salida} (+1 día)`;
            }
            workedHoursSpan.textContent = `${displayHours} (${record.horas_trabajadas}hs)`;
            dayElement.appendChild(workedHoursSpan);

            // Mostrar horas extras si las hay
            if (record.horas_extras > 0) {
                const extraHoursSpan = document.createElement('span');
                extraHoursSpan.classList.add('worked-hours', 'extra');
                extraHoursSpan.textContent = `+${record.horas_extras}hs extras`;
                dayElement.appendChild(extraHoursSpan);
            }
            
            // Mostrar indicador de ausencia si aplica
            if (record.is_absent_due_to_lateness) {
                const absenceSpan = document.createElement('span');
                absenceSpan.classList.add('absence-indicator');
                absenceSpan.textContent = `(Ausencia por ${record.late_minutes} min)`;
                dayElement.appendChild(absenceSpan);
            }

            // AQUI ES DONDE SE AGREGA EL SALARIO BRUTO DE LA JORNADA
            if (record.salario_diario_bruto !== undefined) {
                const dailyWageSpan = document.createElement('span');
                dailyWageSpan.classList.add('daily-wage');
                dailyWageSpan.textContent = `Ganado: ${formatCurrency(record.salario_diario_bruto)}`;
                dayElement.appendChild(dailyWageSpan);
            }
        }
        calendarDaysGrid.appendChild(dayElement);
    }
}

function changeMonth(delta) {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + delta);
    generateCalendar();
    calculateQuincenaTotal();
}

function editDayRecord(dateKey) {
    hideAllSteps(); // Función de uiManagement.js
    editingMessage.style.display = 'block'; // Elemento de domElements.js

    const [year, month, day] = dateKey.split('-').map(Number);
    const displayDate = new Date(year, month - 1, day, 12, 0, 0);

    editingDateDisplay.textContent = displayDate.toLocaleDateString('es-AR'); // Elemento de domElements.js

    isEditingMode = true; // Variable de globalState.js
    editingDateKey = dateKey; // Variable de globalState.js

    const record = workRecords[dateKey]; // Variable global de globalState.js

    if (record) {
        selectedTurno = record.turno; // Variable de globalState.js
        const [recordedHours, recordedMinutes] = record.entrada.split(':').map(Number);
        entryTime = new Date(year, month - 1, day, recordedHours, recordedMinutes, 0); // Variable de globalState.js
        selectedCategory = record.category; // Variable de globalState.js
        selectedAntiguedad = record.antiguedad_anos; // Variable de globalState.js
        extraHoursMade = record.horas_extras; // Variable de globalState.js

        deleteRecordBtn.style.display = 'block'; // Elemento de domElements.js

        resultDisplay.textContent = `Editando registro para el ${displayDate.toLocaleDateString('es-AR')}.`; // Elemento de domElements.js

        stepSelectTurno.style.display = 'block'; // Elemento de domElements.js
    } else {
        selectedTurno = null;
        entryTime = null;
        selectedCategory = null;
        selectedAntiguedad = null;
        extraHoursMade = 0;
        inputHoraIngreso.value = ''; // Elemento de domElements.js
        inputExtraHours.value = '1'; // Elemento de domElements.js
        deleteRecordBtn.style.display = 'none'; // Elemento de domElements.js
        resultDisplay.textContent = `Agregando registro para el ${displayDate.toLocaleDateString('es-AR')}.`; // Elemento de domElements.js
        stepSelectTurno.style.display = 'block'; // Elemento de domElements.js
    }
}

// Función para cancelar el modo edición y reiniciar la interfaz
// Depende de uiManagement.js, calendar.js, calculations.js
function cancelEditing() {
    resetInterface(); // Función de uiManagement.js
    resultDisplay.textContent = 'Edición cancelada. Selecciona tu turno para empezar un nuevo registro.'; // Elemento de domElements.js
    generateCalendar(); // Esta misma función
    calculateQuincenaTotal(); // Función de calculations.js
}

// Función para eliminar un registro
// Depende de globalState.js, domElements.js, uiManagement.js, calendar.js, calculations.js
function deleteRecord() {
    if (confirm(`¿Estás seguro de que quieres eliminar el registro para el día ${editingDateDisplay.textContent}?`)) { // Elemento de domElements.js
        delete workRecords[editingDateKey]; // Variable global de globalState.js
        localStorage.setItem('workRecords', JSON.stringify(workRecords)); // Variable global de globalState.js
        resetInterface(); // Función de uiManagement.js
        generateCalendar(); // Esta misma función
        calculateQuincenaTotal(); // Función de calculations.js
        resultDisplay.textContent = `Registro para el ${editingDateDisplay.textContent} eliminado.`; // Elemento de domElements.js
    }
}