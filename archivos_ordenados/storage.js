// storage.js
// Contiene las funciones para guardar y cargar registros de trabajo en el almacenamiento local.

(function() { // ASEGÚRATE DE QUE ESTE ES EL PRIMER CARÁCTER EN LA LÍNEA 1
    /**
     * Carga los registros de trabajo desde el almacenamiento local.
     * @returns {Object} Los registros de trabajo.
     */
    function getWorkRecords() {
        const records = localStorage.getItem('workRecords');
        return records ? JSON.parse(records) : {};
    }

    // Inicializa workRecords al cargar el script, dentro del ámbito de esta IIFE.
    let workRecords = getWorkRecords();

    /**
     * Guarda un registro de trabajo para un día específico en el almacenamiento.
     * @param {Date} date - La fecha del registro.
     * @param {string} turno - Turno seleccionado (manana, tarde, noche).
     * @param {number} jornadaHoras - Horas de la jornada estándar.
     * @param {number} extraHoursMade - Horas extras realizadas.
     * @param {Date} entryTime - Hora de ingreso.
     * @param {string} category - Categoría seleccionada (A, B, C...).
     * @param {string} antiguedad - Años de antigüedad (ej. '1 años', '3 años').
     * @param {number} valorHoraBase - Valor base de la hora.
     * @param {number} bonificacionPorAntiguedad - Bonificación por antigüedad.
     * @param {number} jornalDiario - Salario diario sin extras ni presentismo.
     * @param {number} salarioDiarioBruto - Salario diario bruto (con extras y presentismo).
     * @param {number} lateMinutes - Minutos de tardanza.
     * @param {boolean} isAbsentDueToLateness - Si se considera ausencia por tardanza.
     * @param {number} valorHoraNormalCalculado - Valor hora normal calculado.
     * @param {number} horaNocturnaCalculada - Valor hora nocturna calculado.
     * @param {number} horaExtraDiurnaCalculada - Valor hora extra diurna calculado.
     * @param {number} horaExtraNocturnaCalculada - Valor hora extra nocturna calculado.
     * @param {number} feriadoDiurnoCalculado - Valor feriado diurno calculado.
     * @param {number} feriadoNocturnoCalculado - Valor feriado nocturno calculado.
     * @param {number} dayOfWeek - Día de la semana (0-6).
     * @param {number} montoPresentismo - Monto de presentismo.
     */
    function saveWorkRecord(date, turno, jornadaHoras, extraHoursMade, entryTime, category, antiguedad, valorHoraBase, bonificacionPorAntiguedad, jornalDiario, salarioDiarioBruto, lateMinutes, isAbsentDueToLateness, valorHoraNormalCalculado, horaNocturnaCalculada, horaExtraDiurnaCalculada, horaExtraNocturnaCalculada, feriadoDiurnoCalculado, feriadoNocturnoCalculado, dayOfWeek, montoPresentismo) {
        const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        
        workRecords[dateKey] = {
            turno: turno,
            jornadaHoras: jornadaHoras,
            extraHoursMade: extraHoursMade,
            entryTime: entryTime.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }).substring(0, 5), // Guardar como string
            category: category,
            antiguedad: antiguedad,
            valorHoraBase: valorHoraBase,
            bonificacionPorAntiguedad: bonificacionPorAntiguedad,
            jornalDiario: jornalDiario,
            salarioDiarioBruto: salarioDiarioBruto,
            lateMinutes: lateMinutes,
            isAbsentDueToLateness: isAbsentDueToLateness,
            valorHoraNormalCalculado: valorHoraNormalCalculado,
            horaNocturnaCalculada: horaNocturnaCalculada,
            horaExtraDiurnaCalculada: horaExtraDiurnaCalculada,
            horaExtraNocturnaCalculada: horaExtraNocturnaCalculada,
            feriadoDiurnoCalculado: feriadoDiurnoCalculado,
            feriadoNocturnoCalculado: feriadoNocturnoCalculado,
            dayOfWeek: dayOfWeek,
            montoPresentismo: montoPresentismo
        };
        // Guardar en localStorage
        localStorage.setItem('workRecords', JSON.stringify(workRecords));
        console.log('Registro guardado:', workRecords[dateKey]);
    }
    
    /**
     * Función para limpiar todos los registros del almacenamiento local.
     */
    function clearAllWorkRecords() {
        localStorage.removeItem('workRecords');
        workRecords = {}; // Reinicia la variable en memoria
        console.log('Todos los registros de trabajo han sido eliminados.');
    }

    // Exponer las funciones y la variable workRecords al ámbito global (window)
    window.saveWorkRecord = saveWorkRecord;
    window.getWorkRecords = getWorkRecords;
    window.clearAllWorkRecords = clearAllWorkRecords;
    window.workRecords = workRecords; // ¡Esto es CRÍTICO para que otros scripts la vean!
})();