// localStorageManagement.js
// Se encarga de la interacción con el localStorage del navegador.
// Guarda y carga los registros de asistencia para persistencia de datos.

/**
 * Guarda un registro de trabajo en localStorage para una fecha específica.
 * @param {Date} date - Objeto Date del día registrado.
 * @param {string} turno - Turno de trabajo.
 * @param {number} jornadaHoras - Horas trabajadas en la jornada.
 * @param {number} extraHours - Horas extras realizadas.
 * @param {Date} actualEntryTime - Objeto Date con la hora de entrada real.
 * @param {string} category - Categoría laboral.
 * @param {number} selectedAntiguedad - Años de antigüedad.
 * @param {number} valorHoraBase - Valor base de la hora.
 * @param {number} bonificacionPorAntiguedad - Monto de la bonificación por antigüedad.
 * @param {number} jornalDiario - Salario diario sin presentismo ni extras.
 * @param {number} salarioDiarioBruto - Salario diario bruto (con presentismo y extras).
 * @param {number} lateMinutes - Minutos de tardanza.
 * @param {boolean} isAbsentDueToLateness - Indica si hay ausencia por tardanza.
 * @param {number} valorHoraNormal - Valor de la hora normal predominante en la jornada.
 * @param {number} horaNocturna - Valor de la hora nocturna predominante en la jornada.
 * @param {number} horaExtraDiurna - Valor de la hora extra diurna.
 * @param {number} horaExtraNocturna - Valor de la hora extra nocturna.
 * @param {number} feriadoDiurno - Valor de la hora feriado diurno.
 * @param {number} feriadoNocturno - Valor de la hora feriado nocturno.
 * @param {number} dayOfWeek - Día de la semana (0=Dom, 6=Sab).
 * @param {number} montoPresentismo - Monto de presentismo diario.
 */
function saveWorkRecord(date, turno, jornadaHoras, extraHours, actualEntryTime, category, selectedAntiguedad, valorHoraBase, bonificacionPorAntiguedad, jornalDiario, salarioDiarioBruto, lateMinutes, isAbsentDueToLateness, valorHoraNormal, horaNocturna, horaExtraDiurna, horaExtraNocturna, feriadoDiurno, feriadoNocturno, dayOfWeek, montoPresentismo) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;

    let exitTime = new Date(actualEntryTime.getTime());
    exitTime.setHours(actualEntryTime.getHours() + jornadaHoras);

    const formattedEntryTime = actualEntryTime.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }).substring(0,5);
    const formattedExitTime = exitTime.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }).substring(0,5);

    workRecords[dateKey] = {
        turno: turno,
        horas_trabajadas: jornadaHoras,
        horas_extras: extraHours,
        entrada: formattedEntryTime,
        salida: formattedExitTime,
        category: category,
        antiguedad_anos: selectedAntiguedad,
        valor_hora_base: valorHoraBase,
        bonificacion_antiguedad: bonificacionPorAntiguedad,
        jornal_diario: jornalDiario,
        salario_diario_bruto: salarioDiarioBruto,
        monto_presentismo_diario: montoPresentismo, 
        late_minutes: lateMinutes,
        is_absent_due_to_lateness: isAbsentDueToLateness,
        day_of_week: dayOfWeek, 
        valor_hora_normal: valorHoraNormal,
        hora_nocturna: horaNocturna,
        hora_extra_diurna: horaExtraDiurna,
        hora_extra_nocturna: horaExtraNocturna,
        feriado_diurno: feriadoDiurno,
        feriado_nocturno: feriadoNocturno
    };
    localStorage.setItem('workRecords', JSON.stringify(workRecords));
}

/**
 * Elimina un registro de trabajo del localStorage.
 * Esta función es llamada desde el `calendarLogic.js` cuando se elimina un día.
 * @param {string} dateKey - La clave de la fecha del registro a eliminar (ej. "AAAA-MM-DD").
 */
// Esta función ya está implícitamente en calendarLogic.js con delete workRecords[dateKey]
// pero si quieres una función explícita para la gestión de localStorage sería así:
// function deleteWorkRecord(dateKey) {
//     delete workRecords[dateKey];
//     localStorage.setItem('workRecords', JSON.stringify(workRecords));
// }