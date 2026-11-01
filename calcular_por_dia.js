const DAY_MONTH_NAMES = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

const DAY_SCHEDULES = {
    weekday: {
        morning: { normales: 8 },
        afternoon: { normales: 7, nocturnas: 1 },
        night: { nocturnas: 7, nocturnas50: 1 }
    },
    saturday: {
        morning: { normales: 7, horasSabado: 1 },
        afternoon: { horasSabado: 7, nocturnas100: 1 }
    },
    sunday: {
        night: { nocturnas: 6, nocturnas100: 2 }
    }
};

const DAY_INPUTS = [
    ['weekday', 'morning', 'weekday-morning'],
    ['weekday', 'afternoon', 'weekday-afternoon'],
    ['weekday', 'night', 'weekday-night'],
    ['saturday', 'morning', 'saturday-morning'],
    ['saturday', 'afternoon', 'saturday-afternoon'],
    ['sunday', 'night', 'sunday-night']
];

function getDayMonthKey(value) {
    const [year, month] = value.split('-').map(Number);
    return `${DAY_MONTH_NAMES[month - 1]}${String(year).slice(-2)}`;
}

function getDayInputs() {
    return DAY_INPUTS.map(([day, shift, id]) => ({
        day,
        shift,
        count: Number(document.getElementById(id).value)
    }));
}

function calculateWorkedHours(days) {
    const hours = {
        normales: 0,
        nocturnas: 0,
        horasSabado: 0,
        nocturnas50: 0,
        nocturnas100: 0,
        feriado: 0,
        horas50: 0
    };

    days.forEach(({ day, shift, count }) => {
        const schedule = DAY_SCHEDULES[day]?.[shift];
        if (!schedule) return;
        Object.entries(schedule).forEach(([type, value]) => {
            hours[type] += value * count;
        });
    });
    return hours;
}

function updateDayRateNote() {
    const category = document.getElementById('day-category').value;
    const monthValue = document.getElementById('day-month').value;
    const note = document.getElementById('day-rate-note');
    if (!category || !monthValue) {
        note.textContent = 'Selecciona categoría y mes para consultar el valor hora del convenio.';
        return;
    }

    const monthKey = getDayMonthKey(monthValue);
    const hourRate = SALARY_TABLES.hourly[category]?.[monthKey];
    const seniorityYears = document.getElementById('day-seniority').value;
    const seniorityRate = SALARY_TABLES.seniority[seniorityYears]?.[monthKey] || 0;
    note.textContent = hourRate
        ? `Valor hora categoría ${category}: $${hourRate.toLocaleString('es-AR')} · Antigüedad por hora: $${seniorityRate.toLocaleString('es-AR')}`
        : 'No hay un valor publicado para el mes seleccionado.';
}

function calculateDayTotals() {
    const category = document.getElementById('day-category').value;
    const monthValue = document.getElementById('day-month').value;
    const days = getDayInputs();
    const hasDays = days.some(({ count }) => Number.isInteger(count) && count > 0);
    if (!category || !monthValue || !hasDays) return null;

    const monthKey = getDayMonthKey(monthValue);
    const valorHora = SALARY_TABLES.hourly[category]?.[monthKey];
    if (!valorHora) return null;

    const hours = calculateWorkedHours(days);

    const seniorityYears = Number(document.getElementById('day-seniority').value);
    const seniorityRate = SALARY_TABLES.seniority[seniorityYears]?.[monthKey] || 0;
    const result = calcularSalarioCalendario({
        valorHora,
        horasNormales: hours.normales,
        horasNocturnas: hours.nocturnas,
        horasSabado: hours.horasSabado,
        horasNocturnas50: hours.nocturnas50,
        horasNocturnas100: hours.nocturnas100,
        horasFeriado: hours.feriado,
        horas50: hours.horas50,
        presentismo: Number(document.getElementById('day-attendance').value),
        adicionalPorcentaje: Number(document.getElementById('day-additional').value) || 0,
        antiguedadAnios: seniorityYears,
        monthKey
    });

    const daysWorked = days.reduce((sum, item) => sum + item.count, 0);
    const bonus = document.getElementById('day-bonus').checked
        ? (SALARY_TABLES.nonRemunerative[monthKey] || 0)
        : 0;
    const deferredBonus = document.getElementById('day-bonus').checked
        ? (SALARY_TABLES.deferredNonRemunerative[monthKey] || 0)
        : 0;

    return { daysWorked, hours, valorHora, seniorityRate, result, bonus, deferredBonus };
}

function renderDayResults(calculation) {
    const section = document.getElementById('day-results');
    const hoursSummary = document.getElementById('day-hours-summary');
    const wageSummary = document.getElementById('day-wage-summary');
    if (!calculation) {
        section.hidden = true;
        return;
    }

    const hourRows = [
        ['Horas normales', calculation.hours.normales],
        ['Horas nocturnas', calculation.hours.nocturnas],
        ['Horas sábado al 100%', calculation.hours.horasSabado],
        ['Horas nocturnas al 50%', calculation.hours.nocturnas50],
        ['Horas nocturnas al 100%', calculation.hours.nocturnas100]
    ].filter(([, hours]) => hours > 0);

    hoursSummary.innerHTML = `
        <h3>${calculation.daysWorked} días trabajados · ${Object.values(calculation.hours).reduce((a, b) => a + b, 0)} horas</h3>
        <ul>${hourRows.map(([label, hours]) => `<li>${label}: <strong>${hours}</strong></li>`).join('')}</ul>
    `;

    const format = amount => amount.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
    const total = calculation.result.totalACobrar + calculation.bonus;
    wageSummary.innerHTML = `
        <h3>Estimación salarial</h3>
        <p>Valor hora: <strong>${format(calculation.valorHora)}</strong> · Antigüedad por hora: <strong>${format(calculation.seniorityRate)}</strong></p>
        <p>Total bruto estimado: <strong>${format(calculation.result.totalSinRetenciones)}</strong></p>
        <p>Total a cobrar estimado (descuentos estimados del 20%): <strong>${format(calculation.result.totalACobrar)}</strong></p>
        ${calculation.bonus ? `<p>Suma no remunerativa del mes: <strong>${format(calculation.bonus)}</strong></p>` : ''}
        ${calculation.deferredBonus ? `<p>Suma no remunerativa diferida a enero de 2027: <strong>${format(calculation.deferredBonus)}</strong></p>` : ''}
        ${calculation.bonus ? `<p>Total estimado incluyendo suma no remunerativa: <strong>${format(total)}</strong></p>` : ''}
    `;
    section.hidden = false;
}

function updateDayCalculation() {
    updateDayRateNote();
    const days = getDayInputs();
    const invalidCount = days.some(({ count }) => !Number.isInteger(count) || count < 0);
    const additional = Number(document.getElementById('day-additional').value);
    if (invalidCount || !Number.isFinite(additional) || additional < 0) {
        renderDayResults(null);
        return;
    }
    renderDayResults(calculateDayTotals());
}

document.addEventListener('DOMContentLoaded', () => {
    const monthInput = document.getElementById('day-month');
    const currentDate = new Date();
    monthInput.value = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

    document.querySelectorAll('#day-category, #day-month, #day-seniority, #day-additional, #day-attendance, #day-bonus, .day-count')
        .forEach(input => input.addEventListener('input', updateDayCalculation));
    document.getElementById('day-calculate').addEventListener('click', updateDayCalculation);
    document.getElementById('day-clear').addEventListener('click', () => {
        document.querySelectorAll('.day-count').forEach(input => { input.value = '0'; });
        updateDayCalculation();
    });
    updateDayRateNote();
});
