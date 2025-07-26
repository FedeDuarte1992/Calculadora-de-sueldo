// calculations.js
// Contiene la lógica principal para el cálculo de salarios y el registro de asistencia.
// Depende de constants.js, globalState.js, utils.js, domElements.js, uiManagement.js, history.js, calendar.js

// Función para calcular los minutos de tardanza
// Depende de HORAS_ESTANDAR_INGRESO (de constants.js)
function calculateLateMinutes(actualEntryTime, standardTurnoTimeStr) {
    const [standardHours, standardMinutes] = standardTurnoTimeStr.split(':').map(Number);

    const standardEntryDate = new Date(actualEntryTime.getFullYear(), actualEntryTime.getMonth(), actualEntryTime.getDate(), standardHours, standardMinutes, 0);

    if (actualEntryTime.getTime() > standardEntryDate.getTime()) {
        const diffMs = actualEntryTime.getTime() - standardEntryDate.getTime();
        return Math.floor(diffMs / (1000 * 60));
    }
    return 0;
}

// Función principal para registrar asistencia y calcular salario
// Depende de globalState.js, constants.js, domElements.js, utils.js, uiManagement.js, history.js, calendar.js
function recordAttendance() {
    let recordDayDate;
    if (isEditingMode && editingDateKey) { // Variables de globalState.js
        const [year, month, day] = editingDateKey.split('-').map(Number);
        recordDayDate = new Date(year, month - 1, day, 12, 0, 0);
    } else {
        recordDayDate = entryTime || new Date(); // Variable de globalState.js
    }

    if (!selectedTurno || !selectedCategory || !selectedAntiguedad || !entryTime) { // Variables de globalState.js
        resultDisplay.textContent = 'Error: Faltan datos para el registro. Por favor, completa todos los pasos.'; // Elemento de domElements.js
        if (!isEditingMode) {
            resetInterface(); // Función de uiManagement.js
        }
        return;
    }

    const currentMonthIndex = recordDayDate.getMonth();
    const currentMonthName = MONTH_NAMES[currentMonthIndex]; // Constante de constants.js
    const dayOfWeek = recordDayDate.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado

    const valorHoraBase = TABLA_SALARIAL[selectedCategory]?.[currentMonthName]; // Constante de constants.js
    const bonificacionPorAntiguedad = getBonificacionAntiguedad(selectedAntiguedad, currentMonthName); // Función de utils.js

    if (valorHoraBase === undefined) {
        resultDisplay.textContent = `Error: No se encontraron datos salariales para la categoría ${selectedCategory} en el mes de ${currentMonthName}. Por favor, verifica la configuración.`; // Elemento de domElements.js
        if (!isEditingMode) {
            resetInterface(); // Función de uiManagement.js
        }
        return;
    }

    let jornalDiario = 0;
    let valorHoraNormalCalculado = 0;
    let horaNocturnaCalculada = 0;
    let horaExtraDiurnaCalculada = 0;
    let horaExtraNocturnaCalculada = 0;
    let feriadoDiurnoCalculado = 0;
    let feriadoNocturnoCalculado = 0;

    let valorHoraBaseDiurna = valorHoraBase;
    let valorHoraBaseNocturna20pct = valorHoraBase * 1.20;
    let valorHoraBaseNocturna7pct = valorHoraBase * 1.07;

    if (dayOfWeek === 6) { // Si es sábado (6)
        if (selectedTurno === 'tarde') {
            valorHoraBaseDiurna = valorHoraBase * (1 + 1.33);
            valorHoraBaseNocturna20pct = (valorHoraBase * 1.20) * (1 + 1.53);
            valorHoraBaseNocturna7pct = 0;
        } else if (selectedTurno === 'noche') {
            valorHoraBaseNocturna20pct = (valorHoraBase * 1.20) * (1 + 1.53);
            valorHoraBaseNocturna7pct = 0;
            valorHoraBaseDiurna = 0;
        }
    }

    let horaDiurnaConAntiguedad = valorHoraBaseDiurna + bonificacionPorAntiguedad;
    let horaNocturna20pctConAntiguedad = valorHoraBaseNocturna20pct + bonificacionPorAntiguedad;
    let horaNocturna7pctConAntiguedad = valorHoraBaseNocturna7pct + bonificacionPorAntiguedad;

    switch (selectedTurno) {
        case 'manana': // 06:00-14:00 (8 horas diurnas)
            jornalDiario = JORNADA_HORAS * horaDiurnaConAntiguedad; // Constante de constants.js
            valorHoraNormalCalculado = horaDiurnaConAntiguedad;
            horaNocturnaCalculada = horaNocturna20pctConAntiguedad;
            break;
        case 'tarde': // 14:00-22:00 (7 horas diurnas + 1 hora nocturna)
            let salarioDiurnoTarde = 7 * horaDiurnaConAntiguedad;
            let salarioNocturnoTarde = 1 * horaNocturna20pctConAntiguedad;
            jornalDiario = salarioDiurnoTarde + salarioNocturnoTarde;
            valorHoraNormalCalculado = horaDiurnaConAntiguedad;
            horaNocturnaCalculada = horaNocturna20pctConAntiguedad;
            break;
        case 'noche': // 21:00-06:00 (8 horas nocturnas con 7% Art. 11)
            jornalDiario = JORNADA_HORAS * horaNocturna7pctConAntiguedad; // Constante de constants.js
            valorHoraNormalCalculado = horaNocturna7pctConAntiguedad;
            horaNocturnaCalculada = horaNocturna7pctConAntiguedad;
            break;
        default:
            jornalDiario = 0;
            break;
    }

    horaExtraDiurnaCalculada = valorHoraNormalCalculado * 1.50;
    horaExtraNocturnaCalculada = horaNocturnaCalculada * 1.50;
    feriadoDiurnoCalculado = valorHoraNormalCalculado * 2.00;
    feriadoNocturnoCalculado = horaNocturnaCalculada * 2.00;

    let salarioBrutoSinPresentismo = jornalDiario;
    let extraHoursInfo = "";

    if (extraHoursMade > 0) { // Variable de globalState.js
        if (selectedTurno === 'noche' || (selectedTurno === 'tarde' && entryTime.getHours() >= 21) || (dayOfWeek === 6 && selectedTurno === 'noche')) {
            salarioBrutoSinPresentismo += (extraHoursMade * horaExtraNocturnaCalculada);
        } else {
            salarioBrutoSinPresentismo += (extraHoursMade * horaExtraDiurnaCalculada);
        }
        extraHoursInfo = ` (+${extraHoursMade}hs extras)`;
    }

    let montoPresentismo = salarioBrutoSinPresentismo * 0.20;
    let salarioDiarioBruto = salarioBrutoSinPresentismo + montoPresentismo;

    const formattedEntryTime = entryTime.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }).substring(0, 5); // Variable de globalState.js
    const formattedDate = recordDayDate.toLocaleDateString('es-AR', { year: 'numeric', month: '2-digit', day: '2-digit' });

    const standardTurnoTime = HORAS_ESTANDAR_INGRESO[selectedTurno]; // Constante de constants.js
    const lateMinutes = calculateLateMinutes(entryTime, standardTurnoTime); // Esta misma función
    const isAbsentDueToLateness = lateMinutes > MINUTOS_TOLERANCIA_TARDE; // Constante de constants.js

    const entryStatusText = isAbsentDueToLateness ? `Tarde (${lateMinutes} min) - AUSENCIA` :
        (lateMinutes > 0 ? `Tarde (${lateMinutes} min)` : 'Temprano/A tiempo');

    resultDisplay.textContent = `¡Registro exitoso! Fecha: ${formattedDate} - Ingreso: ${formattedEntryTime} - Estado: ${entryStatusText} - Turno: ${selectedTurno.charAt(0).toUpperCase() + selectedTurno.slice(1)} (${JORNADA_HORAS}hs)${extraHoursInfo} - Categoría: ${selectedCategory} - Antigüedad: ${selectedAntiguedad} años`; // Elementos de domElements.js, variables de globalState.js, constantes de constants.js

    // Guardar en workRecords los valores separados para el cálculo final
    // (Se asume que saveWorkRecord existe, quizás en un archivo 'storage.js' o similar)
    saveWorkRecord(recordDayDate, selectedTurno, JORNADA_HORAS, extraHoursMade, entryTime, selectedCategory, selectedAntiguedad, valorHoraBase, bonificacionPorAntiguedad, jornalDiario, salarioDiarioBruto, lateMinutes, isAbsentDueToLateness, valorHoraNormalCalculado, horaNocturnaCalculada, horaExtraDiurnaCalculada, horaExtraNocturnaCalculada, feriadoDiurnoCalculado, feriadoNocturnoCalculado, dayOfWeek, montoPresentismo);

    // (Se asume que addRecordToHistory existe, quizás en 'uiManagement.js' o 'history.js')
    addRecordToHistory(resultDisplay.textContent);

    resetInterface(); // Función de uiManagement.js
    generateCalendar(); // Función de calendar.js
    calculateQuincenaTotal(); // Función que aún no tenemos, pero probablemente irá en 'calculations.js' o 'summary.js'
}

function calculateQuincenaTotal() {
    const currentDay = currentCalendarDate.getDate();
    const currentMonth = currentCalendarDate.getMonth();
    const currentYear = currentCalendarDate.getFullYear();
    const currentMonthName = MONTH_NAMES[currentMonth];

    let quincenaStartDate, quincenaEndDate;
    let isSecondQuincena = false;

    if (currentDay <= 15) {
        quincenaStartDate = new Date(currentYear, currentMonth, 1, 12, 0, 0); 
        quincenaEndDate = new Date(currentYear, currentMonth, 15, 12, 0, 0); 
    } else {
        quincenaStartDate = new Date(currentYear, currentMonth, 16, 12, 0, 0); 
        quincenaEndDate = new Date(currentYear, currentMonth + 1, 0, 12, 0, 0);
        isSecondQuincena = true;
    }

    let totalSalarioBaseMasExtras = 0;
    let absencesCount = 0;
    let daysWorkedInQuincena = 0;

    for (const dateKey in workRecords) {
        const [rYear, rMonth, rDay] = dateKey.split('-').map(Number);
        const recordDateLocalNoon = new Date(rYear, rMonth - 1, rDay, 12, 0, 0);

        if (recordDateLocalNoon >= quincenaStartDate && recordDateLocalNoon <= quincenaEndDate) {
            const record = workRecords[dateKey];
            
            // Sumar el salario diario bruto calculado (que YA incluye presentismo para ese día, según tus ejemplos)
            if (record.salario_diario_bruto !== undefined) {
                totalSalarioBaseMasExtras += record.salario_diario_bruto;
                daysWorkedInQuincena++;
            }

            // Aquí la lógica de presentismo de la quincena podría ser redundante o generar doble conteo.
            // Si el "salario_diario_bruto" YA incluye el presentismo del día, entonces `montoPresentismo`
            // de la quincena debería calcularse de otra manera, o esta lógica de ausencias debe ajustarse
            // para NO aplicar un doble porcentaje.
            // Por la forma en que los ejemplos diarios incluyen presentismo, el presentismo quincenal debería
            // ser un ajuste, no un nuevo cálculo del 20% sobre el total.
            // Para mantener la consistencia con tus ejemplos DIARIOS, asumimos que `salario_diario_bruto`
            // ya lleva el presentismo incluido para ese día.
            // Entonces, `absencesCount` solo se usará para el mensaje informativo o para futuras deducciones.
            if (record.is_absent_due_to_lateness) {
                absencesCount++;
            }
        }
    }

    // La lógica de presentismo en la quincena necesita ser revisada si el presentismo ya se suma por día.
    // Si el presentismo de la quincena es una "penalización" por ausencias, no un "bonus" fijo.
    // Si tus ejemplos diarios ya suman el 20% de presentismo, entonces la `totalSalarioBaseMasExtras` ya lo contiene.
    // Si las ausencias implican que no se cobra el 20% en esos días, el `salario_diario_bruto` de los días con ausencia
    // debería calcularse SIN presentismo.
    // Para simplificar, y dado que tus ejemplos diarios YA SUMAN el presentismo, vamos a asumir que
    // el `absencesCount` aquí es solo informativo, y el cálculo del presentismo de la quincena
    // como un `montoPresentismo` adicional no es necesario, porque ya se incluyó día a día.
    // Solo se mostrará el mensaje de ausencias.

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

function calculateQuincenaTotal() {
    const currentDay = currentCalendarDate.getDate(); // Variable de globalState.js
    const currentMonth = currentCalendarDate.getMonth(); // Variable de globalState.js
    const currentYear = currentCalendarDate.getFullYear();
    const currentMonthName = MONTH_NAMES[currentMonth]; // Constante de constants.js

    let quincenaStartDate, quincenaEndDate;
    let isSecondQuincena = false;

    if (currentDay <= 15) {
        quincenaStartDate = new Date(currentYear, currentMonth, 1, 12, 0, 0);
        quincenaEndDate = new Date(currentYear, currentMonth, 15, 12, 0, 0);
    } else {
        quincenaStartDate = new Date(currentYear, currentMonth, 16, 12, 0, 0);
        quincenaEndDate = new Date(currentYear, currentMonth + 1, 0, 12, 0, 0);
        isSecondQuincena = true;
    }

    let totalSalarioBaseMasExtras = 0;
    let absencesCount = 0;
    let daysWorkedInQuincena = 0;

    for (const dateKey in workRecords) { // Variable global de globalState.js
        const [rYear, rMonth, rDay] = dateKey.split('-').map(Number);
        const recordDateLocalNoon = new Date(rYear, rMonth - 1, rDay, 12, 0, 0);

        if (recordDateLocalNoon >= quincenaStartDate && recordDateLocalNoon <= quincenaEndDate) {
            const record = workRecords[dateKey];

            if (record.salario_diario_bruto !== undefined) {
                totalSalarioBaseMasExtras += record.salario_diario_bruto;
                daysWorkedInQuincena++;
            }

            if (record.is_absent_due_to_lateness) {
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
    if (isSecondQuincena) {
        montoSumaNoRemunerativa = SUMA_NO_REMUN[currentMonthName] || 0; // Constante de constants.js
        if (montoSumaNoRemunerativa === 0) {
            console.warn(`No se encontró Suma No Remunerativa para el mes de ${currentMonthName}. Usando 0.`);
        }
    }

    const salarioFinalQuincena = totalSalarioBaseMasExtras + montoSumaNoRemunerativa;

    quincenaDisplay.innerHTML = `
        <p><strong>Salario Estimado esta Quincena (${quincenaStartDate.toLocaleDateString('es-AR')} - ${quincenaEndDate.toLocaleDateString('es-AR')})</strong></p>
        <p>Total de Salario por Jornadas y Horas Extras (incluye presentismo diario): <strong>${formatCurrency(totalSalarioBaseMasExtras)}</strong></p>
        <p>Impacto de Presentismo Quincenal: ${presentismoQuincenalImpact}</p>
        <p>Suma No Remunerativa (solo 2da Quincena): <strong>${formatCurrency(montoSumaNoRemunerativa)}</strong></p>
        <p>Salario Total Estimado de la Quincena: <strong>${formatCurrency(salarioFinalQuincena)}</strong> (${daysWorkedInQuincena} días registrados, ${absencesCount} ausencias)</p>
    `; // Elemento de domElements.js, función de utils.js
}