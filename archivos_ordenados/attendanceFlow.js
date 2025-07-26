
function formatCurrency(number) {
    if (typeof number !== 'number') {
        return number;
    }
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(number);
}

// Función para obtener la bonificación por antigüedad
function getBonificacionAntiguedad(antiguedad_anos, currentMonthName) {
    const antiguedadKey = `${antiguedad_anos} años`;
    if (TABLA_ANTIGUEDAD[antiguedadKey]) {
        // Buscar primero con el formato completo (Mes Año)
        if (TABLA_ANTIGUEDAD[antiguedadKey][currentMonthName]) {
            return TABLA_ANTIGUEDAD[antiguedadKey][currentMonthName];
        }
        // Si no encuentra, intentar con solo el nombre del mes
        const monthOnly = currentMonthName.split(' ')[0];
        if (TABLA_ANTIGUEDAD[antiguedadKey][monthOnly]) {
            return TABLA_ANTIGUEDAD[antiguedadKey][monthOnly];
        }
    }
    console.warn(`No se encontró bonificación por antigüedad para ${antiguedadKey} en ${currentMonthName}. Usando 0.`);
    return 0;
}

// Función para ocultar todos los pasos de entrada
function hideAllSteps() {
    stepSelectTurno.style.display = 'none';
    stepFichajeStatus.style.display = 'none';
    stepInputHora.style.display = 'none';
    stepSelectCategory.style.display = 'none';
    stepSelectAntiguedad.style.display = 'none';
    stepExtraHours.style.display = 'none';
    extraHoursInputGroup.style.display = 'none';
    editingMessage.style.display = 'none';
}

// Función para reiniciar el estado de la interfaz y variables globales
function resetInterface() {
    hideAllSteps();
    stepSelectTurno.style.display = 'block';
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

// Función para seleccionar el turno (Paso 1)
function selectTurno(turno) {
    selectedTurno = turno;
    hideAllSteps();
    stepFichajeStatus.style.display = 'block';
    resultDisplay.textContent = `Turno seleccionado: ${turno.charAt(0).toUpperCase() + turno.slice(1)}.`;
}

// Función para manejar el estado del fichaje (temprano/tarde) (Paso 2)
function fichajeStatus(status) {
    let dateToUse;
    if (isEditingMode && editingDateKey) {
        const [year, month, day] = editingDateKey.split('-').map(Number);
        dateToUse = new Date(year, month - 1, day, 12, 0, 0);
    } else {
        dateToUse = new Date();
    }

    if (status === 'temprano') {
        const standardTime = HORAS_ESTANDAR_INGRESO[selectedTurno];
        const [hours, minutes] = standardTime.split(':').map(Number);
        
        entryTime = new Date(dateToUse.getFullYear(), dateToUse.getMonth(), dateToUse.getDate(), hours, minutes, 0);

        hideAllSteps();
        stepSelectCategory.style.display = 'block';
        resultDisplay.textContent = '¡Ingreso registrado! Ahora, selecciona tu categoría.';

    } else {
        hideAllSteps();
        stepInputHora.style.display = 'block';
        resultDisplay.textContent = 'Por favor, ingresa la hora exacta en la que ingresaste (Ej: 06:15).';
    }
}



// Función para registrar la hora de ingreso personalizada (cuando fichó tarde) (Paso 2b)
function registerCustomEntryTime() {
    const customTime = inputHoraIngreso.value;
    if (!customTime) {
        alert('Por favor, ingresa una hora válida (Ej: 06:15).');
        return;
    }

    let dateToUse;
    if (isEditingMode && editingDateKey) {
        const [year, month, day] = editingDateKey.split('-').map(Number);
        dateToUse = new Date(year, month - 1, day, 12, 0, 0); 
    } else {
        dateToUse = new Date();
    }

    const [hours, minutes] = customTime.split(':').map(Number);
    
    entryTime = new Date(dateToUse.getFullYear(), dateToUse.getMonth(), dateToUse.getDate(), hours, minutes, 0); 

    hideAllSteps();
    stepSelectCategory.style.display = 'block';
    resultDisplay.textContent = 'Hora de ingreso personalizada registrada. Ahora, selecciona tu categoría.';
}

// Función para seleccionar la categoría (Paso 3)
function selectCategory(category) {
    selectedCategory = category;
    hideAllSteps();
    stepSelectAntiguedad.style.display = 'block';
    resultDisplay.textContent = `Categoría seleccionada: ${category}. Ahora, selecciona tus años de antigüedad.`;
}

// Función para seleccionar la antigüedad (Paso 4)
function selectAntiguedad(anos) {
    selectedAntiguedad = anos;
    hideAllSteps();
    stepExtraHours.style.display = 'block';
    resultDisplay.textContent = `Antigüedad seleccionada: ${anos} años. ¿Realizaste horas extras?`;
}

// Función para manejar las horas extras (Paso 5)
function handleExtraHours(hasExtras) {
    if (hasExtras) {
        extraHoursInputGroup.style.display = 'block';
        resultDisplay.textContent = 'Por favor, ingresa la cantidad de horas extras realizadas.';
    } else {
        extraHoursMade = 0;
        recordAttendance();
    }
}

// Función para registrar la cantidad de horas extras
function registerExtraHours() {
    const hours = parseInt(inputExtraHours.value);
    if (isNaN(hours) || hours <= 0) {
        alert('Por favor, ingresa un número válido de horas extras.');
        return;
    }
    extraHoursMade = hours;
    recordAttendance();
}

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
function recordAttendance() {
    let recordDayDate;
    if (isEditingMode && editingDateKey) {
        const [year, month, day] = editingDateKey.split('-').map(Number);
        recordDayDate = new Date(year, month - 1, day, 12, 0, 0);
    } else {
        recordDayDate = entryTime || new Date();
    }
    
    if (!selectedTurno || !selectedCategory || !selectedAntiguedad || !entryTime) {
        resultDisplay.textContent = 'Error: Faltan datos para el registro. Por favor, completa todos los pasos.';
        if (!isEditingMode) {
            resetInterface();
        }
        return;
    }

    const currentMonthIndex = recordDayDate.getMonth();
    const currentMonthName = MONTH_NAMES[currentMonthIndex];
    const dayOfWeek = recordDayDate.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado

    const valorHoraBase = TABLA_SALARIAL[selectedCategory]?.[currentMonthName];
    const bonificacionPorAntiguedad = getBonificacionAntiguedad(selectedAntiguedad, currentMonthName);

    if (valorHoraBase === undefined) {
        resultDisplay.textContent = `Error: No se encontraron datos salariales para la categoría ${selectedCategory} en el mes de ${currentMonthName}. Por favor, verifica la configuración.`;
        if (!isEditingMode) {
            resetInterface();
        }
        return;
    }
    
    let jornalDiario = 0;
    let valorHoraNormalCalculado = 0; // Para guardar el valor de la hora normal predominante en la jornada
    let horaNocturnaCalculada = 0; // Para guardar el valor de la hora nocturna predominante en la jornada
    let horaExtraDiurnaCalculada = 0;
    let horaExtraNocturnaCalculada = 0;
    let feriadoDiurnoCalculado = 0;
    let feriadoNocturnoCalculado = 0;

    // Determine base hourly rates including shift-specific multipliers but before antiquity
    let valorHoraBaseDiurna = valorHoraBase;
    let valorHoraBaseNocturna20pct = valorHoraBase * 1.20; // Standard 20% night plus
    let valorHoraBaseNocturna7pct = valorHoraBase * 1.07; // Art. 11 night plus

    // --- Lógica de Sábados: Modifica los valores base si es sábado ---
    if (dayOfWeek === 6) { // Si es sábado (6)
        if (selectedTurno === 'tarde') {
            // "Sábado (14:00-21:00) $3,120.00+133% (convenio A.O.T.)~$7,286.40"
            // This 133% is applied to the base diurnal rate
            valorHoraBaseDiurna = valorHoraBase * (1 + 1.33);

            // "Sábado (21:00-22:00) $3,744.00+153% adicional (convenio)~$9,472.32"
            // This 153% is applied to the standard 20% nocturnal rate ($3,744.00 is 3,120 * 1.20)
            valorHoraBaseNocturna20pct = (valorHoraBase * 1.20) * (1 + 1.53);
            
            // For Saturday Tarde, Art. 11 (7%) might not apply directly to the whole shift,
            // or the 153% takes precedence for night hours. Assuming 153% replaces 7% for these specific hours.
            valorHoraBaseNocturna7pct = 0; // Or define specific logic if 7% stacks/applies differently
            
        } else if (selectedTurno === 'noche') { // Assuming 'noche' starts at 22:00 or covers the later Saturday hours
            // Your example: "$3,744.00+153% adicional (convenio)~$9,472.32"
            // This implies the standard 20% nocturnal hour gets an additional 153% for Saturday night.
            valorHoraBaseNocturna20pct = (valorHoraBase * 1.20) * (1 + 1.53);
            valorHoraBaseNocturna7pct = 0; // Assuming 153% overrides/includes 7% for Saturday night
            valorHoraBaseDiurna = 0; // A full night shift on Saturday would likely not use diurnal rates
        }
    }
    // --- Fin Lógica Sábados ---


    // Calculate final hour values by adding antiquity to the base values (which may already have shift/saturday bonuses)
    let horaDiurnaConAntiguedad = valorHoraBaseDiurna + bonificacionPorAntiguedad;
    let horaNocturna20pctConAntiguedad = valorHoraBaseNocturna20pct + bonificacionPorAntiguedad;
    let horaNocturna7pctConAntiguedad = valorHoraBaseNocturna7pct + bonificacionPorAntiguedad;


    switch (selectedTurno) {
        case 'manana': // 06:00-14:00 (8 horas diurnas)
            jornalDiario = JORNADA_HORAS * horaDiurnaConAntiguedad;
            valorHoraNormalCalculado = horaDiurnaConAntiguedad;
            horaNocturnaCalculada = horaNocturna20pctConAntiguedad; // Keep standard for general reference
            break;
        case 'tarde': // 14:00-22:00 (7 horas diurnas + 1 hora nocturna)
            // Horas diurnas (14:00-21:00): 7 horas
            let salarioDiurnoTarde = 7 * horaDiurnaConAntiguedad;

            // Hora nocturna (21:00-22:00): 1 hora (usa 20% plus)
            let salarioNocturnoTarde = 1 * horaNocturna20pctConAntiguedad;

            jornalDiario = salarioDiurnoTarde + salarioNocturnoTarde;
            valorHoraNormalCalculado = horaDiurnaConAntiguedad; // Predominant diurnal part
            horaNocturnaCalculada = horaNocturna20pctConAntiguedad; // Predominant nocturnal part
            break;
        case 'noche': // 21:00-06:00 (8 horas nocturnas con 7% Art. 11)
            jornalDiario = JORNADA_HORAS * horaNocturna7pctConAntiguedad;
            valorHoraNormalCalculado = horaNocturna7pctConAntiguedad; // Here, "normal" is the nocturnal with 7%
            horaNocturnaCalculada = horaNocturna7pctConAntiguedad; // Explicitly for clarity
            break;
        default:
            jornalDiario = 0;
            break;
    }
    
    // Recalculate extra/holiday rates based on the "calculated" base rates for the day
    horaExtraDiurnaCalculada = valorHoraNormalCalculado * 1.50; // Use the value determined for "normal" jornada
    horaExtraNocturnaCalculada = horaNocturnaCalculada * 1.50; // Use the value determined for "nocturna" jornada
    feriadoDiurnoCalculado = valorHoraNormalCalculado * 2.00;
    feriadoNocturnoCalculado = horaNocturnaCalculada * 2.00;


    let salarioBrutoSinPresentismo = jornalDiario;
    let extraHoursInfo = "";

    if (extraHoursMade > 0) {
        // Asumimos que las horas extras se cobran con la tarifa correspondiente al tipo de jornada predominante
        // Si hay más complejidad (extras diurnas en turno noche, etc.), se necesitaría más lógica.
        if (selectedTurno === 'noche' || (selectedTurno === 'tarde' && entryTime.getHours() >= 21) || (dayOfWeek === 6 && selectedTurno === 'noche')) {
             salarioBrutoSinPresentismo += (extraHoursMade * horaExtraNocturnaCalculada);
        } else {
             salarioBrutoSinPresentismo += (extraHoursMade * horaExtraDiurnaCalculada);
        }
        extraHoursInfo = ` (+${extraHoursMade}hs extras)`;
    }

    // Presentismo calculation
    let montoPresentismo = salarioBrutoSinPresentismo * 0.20; // Always 20% for calculation example
    let salarioDiarioBruto = salarioBrutoSinPresentismo + montoPresentismo;


    const formattedEntryTime = entryTime.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }).substring(0,5);
    const formattedDate = recordDayDate.toLocaleDateString('es-AR', { year: 'numeric', month: '2-digit', day: '2-digit' });

    const standardTurnoTime = HORAS_ESTANDAR_INGRESO[selectedTurno];
    const lateMinutes = calculateLateMinutes(entryTime, standardTurnoTime);
    const isAbsentDueToLateness = lateMinutes > MINUTOS_TOLERANCIA_TARDE;

    // Ajustar presentismo si hay ausencias
    if (isAbsentDueToLateness) {
        // En tus ejemplos, el presentismo se calcula primero y luego se suma.
        // Si el presentismo se pierde por la tardanza, hay que ajustar esto.
        // Por ahora, tu ejemplo lo suma, pero la lógica de pérdida por tardanza (Ausencia) es previa.
        // Si "Ausencia" significa que no se cobra presentismo, entonces montoPresentismo debería ser 0 aquí.
        // Mantenemos la lógica de la quincena para el presentismo general.
        // Para el cálculo DIARIO de salarioBruto, asumimos que si hay "Ausencia", el presentismo de ese día NO se suma.
        // Sin embargo, tus ejemplos muestran presentismo sumado incluso con tardanza, lo cual es contradictorio.
        // Si el "Total diario (bruto)" ya incluye presentismo, y hay ausencias, esto necesitaría clarificación.
        // Por la simplicidad de tus ejemplos, el presentismo se suma al final del día.
        // La lógica de "absencesCount" en `calculateQuincenaTotal` ya maneja la pérdida del porcentaje.
    }


    const entryStatusText = isAbsentDueToLateness ? `Tarde (${lateMinutes} min) - AUSENCIA` :
                            (lateMinutes > 0 ? `Tarde (${lateMinutes} min)` : 'Temprano/A tiempo');
    
    resultDisplay.textContent = `¡Registro exitoso! Fecha: ${formattedDate} - Ingreso: ${formattedEntryTime} - Estado: ${entryStatusText} - Turno: ${selectedTurno.charAt(0).toUpperCase() + selectedTurno.slice(1)} (${JORNADA_HORAS}hs)${extraHoursInfo} - Categoría: ${selectedCategory} - Antigüedad: ${selectedAntiguedad} años`;
    
    // Guardar en workRecords los valores separados para el cálculo final
    saveWorkRecord(recordDayDate, selectedTurno, JORNADA_HORAS, extraHoursMade, entryTime, selectedCategory, selectedAntiguedad, valorHoraBase, bonificacionPorAntiguedad, jornalDiario, salarioDiarioBruto, lateMinutes, isAbsentDueToLateness, valorHoraNormalCalculado, horaNocturnaCalculada, horaExtraDiurnaCalculada, horaExtraNocturnaCalculada, feriadoDiurnoCalculado, feriadoNocturnoCalculado, dayOfWeek, montoPresentismo);

    addRecordToHistory(resultDisplay.textContent);

    resetInterface();
    generateCalendar();
    calculateQuincenaTotal();
}