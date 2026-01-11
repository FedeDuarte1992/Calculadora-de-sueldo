/**
 * SCRIPT PARA CALCULADORA DE CALENDARIO
 * Automatiza el cálculo de horas según turno y día de la semana
 */

// Importar tablas de valores desde script_hora.js
const valoresHoraCat = {
    "A": { "enero25": 2546, "febrero25": 2583, "marzo25": 2621, "abril25": 2658, "mayo25": 2696, "junio25": 2750, "julio25": 2804, "agosto25": 2858, "septiembre25": 2912, "octubre25": 2966, "noviembre25": 3020, "diciembre25": 3080, "enero26": 3141, "febrero26": 3141, "marzo26": 3231 },
    "B": { "enero25": 2593, "febrero25": 2631, "marzo25": 2669, "abril25": 2707, "mayo25": 2745, "junio25": 2800, "julio25": 2855, "agosto25": 2910, "septiembre25": 2965, "octubre25": 3020, "noviembre25": 3074, "diciembre25": 3135, "enero26": 3197, "febrero26": 3197, "marzo26": 3289 },
    "C": { "enero25": 2643, "febrero25": 2682, "marzo25": 2721, "abril25": 2759, "mayo25": 2798, "junio25": 2854, "julio25": 2910, "agosto25": 2966, "septiembre25": 3022, "octubre25": 3078, "noviembre25": 3134, "diciembre25": 3197, "enero26": 3259, "febrero26": 3259, "marzo26": 3353 },
    "D": { "enero25": 2690, "febrero25": 2729, "marzo25": 2769, "abril25": 2808, "mayo25": 2848, "junio25": 2905, "julio25": 2962, "agosto25": 3019, "septiembre25": 3076, "octubre25": 3133, "noviembre25": 3190, "diciembre25": 3254, "enero26": 3318, "febrero26": 3318, "marzo26": 3413 },
    "E": { "enero25": 2745, "febrero25": 2785, "marzo25": 2826, "abril25": 2866, "mayo25": 2906, "junio25": 2964, "julio25": 3022, "agosto25": 3080, "septiembre25": 3138, "octubre25": 3197, "noviembre25": 3255, "diciembre25": 3320, "enero26": 3385, "febrero26": 3385, "marzo26": 3483 },
    "F": { "enero25": 2798, "febrero25": 2839, "marzo25": 2880, "abril25": 2921, "mayo25": 2962, "junio25": 3021, "julio25": 3080, "agosto25": 3140, "septiembre25": 3199, "octubre25": 3258, "noviembre25": 3317, "diciembre25": 3383, "enero26": 3450, "febrero26": 3450, "marzo26": 3549 },
    "G": { "enero25": 2885, "febrero25": 2927, "marzo25": 2969, "abril25": 3012, "mayo25": 3054, "junio25": 3115, "julio25": 3176, "agosto25": 3237, "septiembre25": 3298, "octubre25": 3359, "noviembre25": 3420, "diciembre25": 3488, "enero26": 3557, "febrero26": 3557, "marzo26": 3659 },
    "H": { "enero25": 2947, "febrero25": 2990, "marzo25": 3033, "abril25": 3077, "mayo25": 3120, "junio25": 3182, "julio25": 3245, "agosto25": 3307, "septiembre25": 3370, "octubre25": 3432, "noviembre25": 3494, "diciembre25": 3564, "enero26": 3634, "febrero26": 3634, "marzo26": 3739 }
};

const valoresAntiguedad = {
    1:  { "enero25": 25, "julio25": 27, "septiembre25": 28, "enero26": 29, "marzo26": 30 },
    3:  { "enero25": 37, "julio25": 39, "septiembre25": 41, "enero26": 42, "marzo26": 43 },
    5:  { "enero25": 50, "julio25": 53, "septiembre25": 56, "enero26": 58, "marzo26": 60 },
    7:  { "enero25": 68, "julio25": 72, "septiembre25": 76, "enero26": 78, "marzo26": 81 },
    9:  { "enero25": 81, "julio25": 86, "septiembre25": 91, "enero26": 93, "marzo26": 96 },
    12: { "enero25": 108, "julio25": 114, "septiembre25": 121, "enero26": 124, "marzo26": 128 },
    15: { "enero25": 130, "julio25": 138, "septiembre25": 146, "enero26": 150, "marzo26": 155 },
    18: { "enero25": 152, "julio25": 161, "septiembre25": 170, "enero26": 174, "marzo26": 179 },
    22: { "enero25": 175, "julio25": 186, "septiembre25": 196, "enero26": 201, "marzo26": 207 },
    26: { "enero25": 198, "julio25": 210, "septiembre25": 222, "enero26": 228, "marzo26": 235 },
    30: { "enero25": 217, "julio25": 230, "septiembre25": 243, "enero26": 249, "marzo26": 256 },
    35: { "enero25": 238, "julio25": 252, "septiembre25": 267, "enero26": 273, "marzo26": 281 },
    40: { "enero25": 261, "julio25": 277, "septiembre25": 292, "enero26": 300, "marzo26": 309 }
};

const SUMA_NO_REMUN = {
    'enero25': 210000, 'febrero25': 210000, 'marzo25': 210000, 'abril25': 210000, 'mayo25': 210000,
    'junio25': 315000, 'julio25': 210000, 'agosto25': 210000, 'septiembre25': 210000, 'octubre25': 210000, 'noviembre25': 210000, 
    'diciembre25': 315000,
    'enero26': 210000, 
    'febrero26': 210000,
    'marzo26': 210000
};

// Variables globales
let currentDate = new Date();
let selectedDates = [];
let calculatedDays = {}; // Almacenar cálculos por día
let dayTurnos = {}; // Almacenar turno específico por día

// Configuración de turnos y horas
const SHIFT_HOURS = {
    manana: {
        weekday: { normales: 8, nocturnas: 0, sabado: 0, nocturnas50: 0, nocturnas100: 0, feriado: 0 },
        saturday: { normales: 7, nocturnas: 0, sabado: 1, nocturnas50: 0, nocturnas100: 0, feriado: 0 }
    },
    tarde: {
        weekday: { normales: 7, nocturnas: 1, sabado: 0, nocturnas50: 0, nocturnas100: 0, feriado: 0 },
        saturday: { normales: 0, nocturnas: 0, sabado: 7, nocturnas50: 0, nocturnas100: 1, feriado: 0 }
    },
    noche: {
        weekday: { normales: 0, nocturnas: 7, sabado: 0, nocturnas50: 1, nocturnas100: 0, feriado: 0 },
        sunday: { normales: 0, nocturnas: 6, sabado: 0, nocturnas50: 0, nocturnas100: 2, feriado: 0 }
    }
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    loadAntiguedadOptions();
    loadSavedConfiguration();
    generateCalendar();
    setupEventListeners();
});

// Guardar configuración en localStorage
function saveConfiguration() {
    const config = {
        categoria: document.getElementById('categoria-select').value,
        antiguedad: document.getElementById('antiguedad-select').value,
        adicional: document.getElementById('adicional-input').value,
        turno: document.getElementById('turno-select').value,
        extras: document.getElementById('extras-input').value,
        presentismo: document.getElementById('presentismo-select').value
    };
    localStorage.setItem('salaryCalcConfig', JSON.stringify(config));
}

// Cargar configuración guardada
function loadSavedConfiguration() {
    const saved = localStorage.getItem('salaryCalcConfig');
    if (saved) {
        const config = JSON.parse(saved);
        if (config.categoria) document.getElementById('categoria-select').value = config.categoria;
        if (config.antiguedad) document.getElementById('antiguedad-select').value = config.antiguedad;
        if (config.adicional) document.getElementById('adicional-input').value = config.adicional;
        if (config.turno) document.getElementById('turno-select').value = config.turno;
        if (config.extras) document.getElementById('extras-input').value = config.extras;
        if (config.presentismo) document.getElementById('presentismo-select').value = config.presentismo;
        updateSelectedValues();
    }
}

// Configurar event listeners
function setupEventListeners() {
    const fields = ['categoria-select', 'antiguedad-select', 'adicional-input', 'turno-select', 'extras-input', 'presentismo-select'];
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('change', () => {
                updateSelectedValues();
                saveConfiguration();
            });
            field.addEventListener('input', () => {
                updateSelectedValues();
                saveConfiguration();
            });
        }
    });
}

// Cargar opciones de antigüedad
function loadAntiguedadOptions() {
    const select = document.getElementById('antiguedad-select');
    const years = [1, 3, 5, 7, 9, 12, 15, 18, 22, 26, 30, 35, 40];
    
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = `${year} años`;
        select.appendChild(option);
    });
}

// Generar calendario
function generateCalendar() {
    const calendarDays = document.getElementById('calendar-days');
    const monthYear = document.getElementById('current-month-year');
    
    calendarDays.innerHTML = '';
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                       'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    monthYear.textContent = `${monthNames[month]} ${year}`;
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Ajustar primer día para que lunes sea 0
    let startDay = firstDay.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1;
    
    // Días vacíos al inicio
    for (let i = 0; i < startDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.classList.add('calendar-day');
        calendarDays.appendChild(emptyDay);
    }
    
    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day');
        
        const dayNumber = document.createElement('span');
        dayNumber.classList.add('day-number');
        dayNumber.textContent = day;
        dayElement.appendChild(dayNumber);
        
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        dayElement.setAttribute('data-date', dateKey);
        
        // Marcar día actual
        const today = new Date();
        if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
            dayElement.classList.add('today');
        }
        
        // Verificar si está seleccionado
        if (selectedDates.includes(dateKey)) {
            dayElement.classList.add('selected-day');
        }
        
        // Mostrar turno asignado con colores específicos
        if (dayTurnos[dateKey]) {
            const turnoSpan = document.createElement('span');
            turnoSpan.classList.add('day-turno');
            const turno = dayTurnos[dateKey];
            const turnoLetter = turno.charAt(0).toUpperCase();
            
            // Colores específicos por turno
            const turnoColors = {
                'manana': { bg: '#fff3e0', color: '#f57c00', border: '#ffb74d' },
                'tarde': { bg: '#e8f5e9', color: '#388e3c', border: '#81c784' },
                'noche': { bg: '#e3f2fd', color: '#1976d2', border: '#64b5f6' }
            };
            
            const colors = turnoColors[turno] || turnoColors['noche'];
            turnoSpan.textContent = turnoLetter;
            turnoSpan.style.cssText = `display:inline-block;font-size:0.65em;color:${colors.color};font-weight:bold;background:${colors.bg};border:1px solid ${colors.border};border-radius:50%;width:16px;height:16px;text-align:center;line-height:14px;margin-top:2px;box-shadow:0 1px 3px rgba(0,0,0,0.2);`;
            dayElement.appendChild(turnoSpan);
        }
        
        // Mostrar ganancia diaria si está calculada
        const dailyEarnings = getDailyEarnings(dateKey);
        if (dailyEarnings > 0) {
            const earningsSpan = document.createElement('span');
            earningsSpan.classList.add('daily-earnings');
            earningsSpan.textContent = `$${dailyEarnings.toLocaleString('es-AR', {minimumFractionDigits: 0})}`;
            earningsSpan.style.cssText = 'display:block;font-size:0.7em;color:#2e7d32;font-weight:600;margin-top:3px;background:rgba(46,125,50,0.1);padding:1px 3px;border-radius:4px;text-align:center;';
            dayElement.appendChild(earningsSpan);
        }
        
        dayElement.addEventListener('click', () => toggleDateSelection(dateKey, dayElement));
        calendarDays.appendChild(dayElement);
    }
}

// Alternar selección de fecha
function toggleDateSelection(dateKey, element) {
    const index = selectedDates.indexOf(dateKey);
    
    if (index > -1) {
        selectedDates.splice(index, 1);
        element.classList.remove('selected-day');
    } else {
        selectedDates.push(dateKey);
        element.classList.add('selected-day');
    }
    
    updateCalculateButton();
}

// Actualizar botones
function updateCalculateButton() {
    const calculateBtn = document.getElementById('calculate-btn');
    const assignBtn = document.getElementById('assign-turn-btn');
    const diasConTurno = Object.keys(dayTurnos).length;
    
    // Botón asignar turno
    if (assignBtn) {
        assignBtn.disabled = selectedDates.length === 0;
        assignBtn.textContent = `Asignar Turno a Días Seleccionados (${selectedDates.length})`;
    }
    
    // Botón calcular
    calculateBtn.disabled = diasConTurno === 0;
    calculateBtn.textContent = `Calcular Todos los Días con Turno (${diasConTurno})`;
    
    updateSelectedValues();
}

// Mostrar valores seleccionados
function updateSelectedValues() {
    const categoria = document.getElementById('categoria-select').value;
    const antiguedad = document.getElementById('antiguedad-select').value;
    const adicional = document.getElementById('adicional-input').value;
    const turno = document.getElementById('turno-select').value;
    const extras = document.getElementById('extras-input').value;
    const presentismo = document.getElementById('presentismo-select').value;
    
    const valuesDiv = document.getElementById('selected-values');
    const displayDiv = document.getElementById('values-display');
    
    if (categoria || antiguedad || turno || adicional > 0 || extras > 0 || presentismo) {
        let html = '';
        if (categoria) html += `<span style="color:#666;">👤</span> <strong>Categoría:</strong> ${categoria} | `;
        if (antiguedad) html += `<span style="color:#666;">📈</span> <strong>Antigüedad:</strong> ${antiguedad} años | `;
        if (turno) html += `<span style="color:#666;">🕐</span> <strong>Turno:</strong> ${turno.charAt(0).toUpperCase() + turno.slice(1)} | `;
        if (adicional > 0) html += `<span style="color:#666;">➕</span> <strong>Adicional:</strong> ${adicional}% | `;
        if (extras > 0) html += `<span style="color:#666;">⏱️</span> <strong>Horas extras:</strong> ${extras}h | `;
        if (presentismo) html += `<span style="color:#666;">🎁</span> <strong>Presentismo:</strong> ${(parseFloat(presentismo) * 100).toFixed(0)}% | `;
        
        // Mostrar valor hora si está disponible (basado en mes y año del calendario)
        if (categoria && antiguedad) {
            const calendarMonth = currentDate.getMonth() + 1;
            const calendarYear = currentDate.getFullYear();
            const monthKey = getMonthKey(calendarMonth, calendarYear);
            const valorHora = valoresHoraCat[categoria] ? (valoresHoraCat[categoria][monthKey] || 0) : 0;
            const valorAntiguedad = valoresAntiguedad[parseInt(antiguedad)] ? (valoresAntiguedad[parseInt(antiguedad)][monthKey] || 0) : 0;
            if (valorHora > 0) {
                const prettyMonth = getMonthPrettyName(calendarMonth).charAt(0).toUpperCase() + getMonthPrettyName(calendarMonth).slice(1);
                html += `<br><span style="color:#666;">📅</span> <strong>Mes:</strong> ${prettyMonth} | <span style="color:#666;">💰</span> <strong>Valor hora:</strong> $${valorHora.toLocaleString('es-AR')} | <span style="color:#666;">⏰</span> <strong>Antigüedad/hora:</strong> $${valorAntiguedad.toLocaleString('es-AR')}`;
            }
        }
        
        displayDiv.innerHTML = html.replace(/ \| $/, '');
        valuesDiv.style.display = 'block';
    } else {
        valuesDiv.style.display = 'none';
    }
}

// Cambiar mes
function changeMonth(delta) {
    currentDate.setMonth(currentDate.getMonth() + delta);
    generateCalendar();
}

// Limpiar selección
function clearSelection() {
    const diasConTurno = Object.keys(dayTurnos).length;
    const hayCalculos = Object.keys(calculatedDays).length > 0;
    
    if (diasConTurno > 0 || hayCalculos) {
        if (confirm(`¿Estás seguro de limpiar todo?\n\n• ${diasConTurno} días con turno asignado\n• ${hayCalculos ? 'Cálculos realizados' : 'Sin cálculos'}\n\nEsta acción no se puede deshacer.`)) {
            selectedDates = [];
            calculatedDays = {};
            dayTurnos = {};
            generateCalendar();
            updateCalculateButton();
            document.getElementById('results-section').style.display = 'none';
            showNotification('🧹 Todo limpiado correctamente', 'success');
        }
    } else {
        showNotification('No hay nada que limpiar', 'info');
    }
}

// Obtener ganancia diaria calculada
function getDailyEarnings(dateKey) {
    return calculatedDays[dateKey] || 0;
}

// Obtener horas según turno y día
function getHoursForShiftAndDay(turno, dayOfWeek) {
    const shiftConfig = SHIFT_HOURS[turno];
    if (!shiftConfig) return null;
    
    if (turno === 'manana') {
        return dayOfWeek === 6 ? shiftConfig.saturday : shiftConfig.weekday;
    } else if (turno === 'tarde') {
        return dayOfWeek === 6 ? shiftConfig.saturday : shiftConfig.weekday;
    } else if (turno === 'noche') {
        return dayOfWeek === 0 ? shiftConfig.sunday : shiftConfig.weekday;
    }
    
    return shiftConfig.weekday;
}

// Obtener nombre del mes para mostrar (Ej: 'Enero')
function getMonthPrettyName(monthNumber) {
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                   'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return months[monthNumber - 1];
}

// Obtener clave de mes con año corto para lookup en tablas (Ej: 'enero25' o 'enero26')
function getMonthKey(monthNumber, year) {
    const shortMonth = getMonthPrettyName(monthNumber);
    const yy = String(year).slice(-2);
    return `${shortMonth}${yy}`;
} 

// Función de cálculo específica para calendario
function calcularSalarioCalendario(datos) {
    let total = 0;
    // Permitir pasar monthKey desde el llamador; si no se pasa, usar el mes actual
    const monthKey = datos.monthKey || getMonthKey(new Date().getMonth() + 1, new Date().getFullYear());
    const valorAntiguedad = datos.antiguedadAnios ? (valoresAntiguedad[datos.antiguedadAnios] ? (valoresAntiguedad[datos.antiguedadAnios][monthKey] || 0) : 0) : 0;
    
    // Calcular horas normales
    let montoNormales = 0;
    if (datos.horasNormales > 0) {
        montoNormales = datos.horasNormales * datos.valorHora;
        total += montoNormales;
    }
    
    // Calcular horas nocturnas
    let montoNocturnas = 0;
    if (datos.horasNocturnas > 0) {
        montoNocturnas = datos.horasNocturnas * (datos.valorHora * 1.3);
        total += montoNocturnas;
    }
    
    // Calcular antigüedad sobre horas normales y nocturnas
    const totalHorasBasicas = datos.horasNormales + datos.horasNocturnas;
    let montoAntiguedad = 0;
    if (totalHorasBasicas > 0 && valorAntiguedad > 0) {
        montoAntiguedad = totalHorasBasicas * valorAntiguedad;
        total += montoAntiguedad;
    }
    
    // Calcular adicional sobre básico
    const sumaBase = montoNormales + montoNocturnas;
    let montoAdicional = 0;
    if (datos.adicionalPorcentaje > 0 && sumaBase > 0) {
        montoAdicional = sumaBase * (datos.adicionalPorcentaje / 100);
        total += montoAdicional;
    }
    
    // Calcular horas 100% (sábado)
    if (datos.horasSabado > 0) {
        const base = datos.valorHora + valorAntiguedad;
        const monto = datos.horasSabado * base * 1.2 * 2;
        total += monto;
    }
    
    // Calcular horas nocturnas 50%
    if (datos.horasNocturnas50 > 0) {
        const nocturnidad = datos.valorHora * 0.3;
        const subtotal = datos.valorHora + valorAntiguedad + nocturnidad;
        const baseFinal = subtotal * 1.2045;
        const monto = datos.horasNocturnas50 * baseFinal * 1.5;
        total += monto;
    }
    
    // Calcular horas nocturnas 100%
    if (datos.horasNocturnas100 > 0) {
        const nocturnidad = datos.valorHora * 0.3;
        const subtotal = datos.valorHora + valorAntiguedad + nocturnidad;
        const baseFinal = subtotal * 1.2045;
        const monto = datos.horasNocturnas100 * baseFinal * 2;
        total += monto;
    }
    
    // Calcular horas de feriado
    if (datos.horasFeriado > 0) {
        const valorHoraFeriado = (datos.valorHora + valorAntiguedad) * 1.2;
        const montoFeriado = datos.horasFeriado * valorHoraFeriado;
        total += montoFeriado;
    }
    
    // Calcular horas al 50% (extras)
    if (datos.horas50 > 0) {
        const monto = datos.horas50 * datos.valorHora * 1.5;
        total += monto;
    }
    
    // Calcular presentismo (monto separado para desglose)
    let montoPresentismo = 0;
    if (datos.presentismo > 0) {
        montoPresentismo = total * datos.presentismo;
        total += montoPresentismo;
    }
    
    const totalSinRetenciones = total;
    const totalACobrar = total * 0.8;
    
    return {
        totalSinRetenciones: totalSinRetenciones,
        totalACobrar: totalACobrar,
        desglose: {
            normales: montoNormales,
            nocturnas: montoNocturnas,
            antiguedad: montoAntiguedad,
            adicional: montoAdicional,
            presentismo: montoPresentismo
        }
    };
} 

// Asignar turno actual a días seleccionados
function assignTurnToSelectedDays() {
    const turno = document.getElementById('turno-select').value;
    if (!turno) {
        showNotification('Selecciona un turno primero', 'warning');
        return;
    }
    
    const cantidadDias = selectedDates.length;
    selectedDates.forEach(dateKey => {
        dayTurnos[dateKey] = turno;
    });
    
    // Limpiar selección después de asignar turno
    selectedDates = [];
    generateCalendar();
    updateCalculateButton();
    
    const turnoNombre = turno.charAt(0).toUpperCase() + turno.slice(1);
    showNotification(`✓ Turno "${turnoNombre}" asignado a ${cantidadDias} día${cantidadDias > 1 ? 's' : ''}`, 'success');
}

// Variable para rastrear posición del cursor
let cursorPosition = { x: 0, y: 0 };
document.addEventListener('mousemove', (e) => {
    cursorPosition.x = e.clientX;
    cursorPosition.y = e.clientY;
});

// Mostrar notificación elegante
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const colors = {
        success: { bg: '#4caf50', icon: '✓' },
        warning: { bg: '#ff9800', icon: '⚠' },
        info: { bg: '#2196f3', icon: 'i' }
    };
    
    const color = colors[type] || colors.info;
    
    // Posicionar cerca del cursor
    let left = cursorPosition.x + 15;
    let top = cursorPosition.y - 10;
    
    if (left + 300 > window.innerWidth) left = cursorPosition.x - 315;
    if (top < 0) top = cursorPosition.y + 20;
    
    notification.style.cssText = `
        position: fixed; left: ${left}px; top: ${top}px; z-index: 10000;
        background: ${color.bg}; color: white; padding: 12px 20px;
        border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        font-weight: 500; max-width: 300px; pointer-events: none;
        opacity: 0; transform: scale(0.8); transition: all 0.3s ease;
    `;
    notification.innerHTML = `${color.icon} ${message}`;
    
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'scale(1)';
    }, 10);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'scale(0.8)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Calcular todos los días con turnos asignados
function calculateSelected() {
    const categoria = document.getElementById('categoria-select').value;
    const antiguedad = parseInt(document.getElementById('antiguedad-select').value);
    const adicional = parseFloat(document.getElementById('adicional-input').value) || 0;
    const horasExtras = parseInt(document.getElementById('extras-input').value) || 0;
    const presentismo = parseFloat(document.getElementById('presentismo-select').value) || 0.20;
    
    if (!categoria || !antiguedad) {
        showNotification('Por favor completa categoría y antigüedad', 'warning');
        return;
    }
    
    const diasConTurno = Object.keys(dayTurnos);
    if (diasConTurno.length === 0) {
        showNotification('Primero selecciona días y asigna turnos', 'warning');
        return;
    }
    
    // Mostrar indicador de cálculo
    showNotification(`📊 Calculando ${diasConTurno.length} días...`, 'info');
    
    let detallesPorDia = [];
    
    // Calcular cada día con su turno asignado
    diasConTurno.forEach(dateKey => {
        const turno = dayTurnos[dateKey];
        const [year, month, day] = dateKey.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        const dayOfWeek = date.getDay();
        
        const hours = getHoursForShiftAndDay(turno, dayOfWeek);
        if (!hours) return;
        
        const monthKey = getMonthKey(month, year);
        const valorHora = valoresHoraCat[categoria] ? (valoresHoraCat[categoria][monthKey] || 0) : 0;
        const valorAntiguedad = valoresAntiguedad[antiguedad] ? (valoresAntiguedad[antiguedad][monthKey] || 0) : 0;
        
        if (valorHora === 0) return;
        
        const resultado = calcularSalarioCalendario({
            valorHora: valorHora,
            horasNormales: hours.normales,
            horasNocturnas: hours.nocturnas,
            horasSabado: hours.sabado,
            horasNocturnas50: hours.nocturnas50,
            horasNocturnas100: hours.nocturnas100,
            horasFeriado: hours.feriado,
            horas50: horasExtras,
            presentismo: presentismo,
            adicionalPorcentaje: adicional,
            antiguedadAnios: antiguedad,
            monthKey: monthKey
        });
        
        const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        detallesPorDia.push({
            fecha: `${dayNames[dayOfWeek]} ${day}/${month}/${year}`,
            dateKey: dateKey,
            horas: hours,
            horasExtras: horasExtras,
            totalDia: resultado.totalACobrar,
            desglose: resultado.desglose,
            turno: turno,
            quincena: day <= 15 ? 'primera' : 'segunda',
            mes: month,
            año: year
        });
        
        calculatedDays[dateKey] = resultado.totalACobrar;
    });
    
    mostrarResultados(detallesPorDia);
    generateCalendar();
    
    // Notificación de éxito
    setTimeout(() => {
        showNotification(`✓ Cálculo completado: ${detallesPorDia.length} días procesados`, 'success');
    }, 500);
}

// Mostrar resultados
function mostrarResultados(detallesPorDia) {
    const summaryDiv = document.getElementById('calculation-summary');
    const detailsDiv = document.getElementById('calculation-details');
    
    // Agrupar por quincenas y desglose detallado
    const primeraQuincena = { dias: 0, total: 0, desglose: {} };
    const segundaQuincena = { dias: 0, total: 0, desglose: {} };
    let totalGeneral = 0;
    
    detallesPorDia.forEach(dia => {
        totalGeneral += dia.totalDia;
        const [year, month, day] = dia.dateKey.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        const dayOfWeek = date.getDay();
        
        // Determinar tipo de día
        let tipoDia = '';
        if (dayOfWeek === 6) { // Sábado
            tipoDia = `${dia.turno}_sabado`;
        } else if (dayOfWeek === 0) { // Domingo
            tipoDia = `${dia.turno}_domingo`;
        } else { // Lunes a Viernes
            tipoDia = `${dia.turno}_semana`;
        }
        
        // Clasificar por quincena
        const quincena = dia.quincena === 'primera' ? primeraQuincena : segundaQuincena;
        quincena.dias++;
        quincena.total += dia.totalDia;
        
        // Inicializar desglose si no existe
        if (!quincena.desglose[tipoDia]) {
            quincena.desglose[tipoDia] = {
                dias: 0,
                total: 0,
                horas: { normales: 0, nocturnas: 0, sabado: 0, nocturnas50: 0, nocturnas100: 0, extras: 0 }
            };
        }
        
        // Acumular datos
        quincena.desglose[tipoDia].dias++;
        quincena.desglose[tipoDia].total += dia.totalDia;
        
        Object.keys(dia.horas).forEach(tipo => {
            if (quincena.desglose[tipoDia].horas[tipo] !== undefined) {
                quincena.desglose[tipoDia].horas[tipo] += dia.horas[tipo];
            }
        });
        if (dia.horasExtras > 0) {
            quincena.desglose[tipoDia].horas.extras += dia.horasExtras;
        }
    });
    
    // Obtener mes para suma no remunerativa
    const primerDia = detallesPorDia[0];
    let sumaNoRemun = 0;
    if (segundaQuincena.dias > 0 && primerDia) {
        const monthKey = getMonthKey(primerDia.mes, primerDia.año);
        sumaNoRemun = SUMA_NO_REMUN[monthKey] || 0;
    }
    
    // Función para generar desglose HTML
    function generarDesgloseHTML(desglose) {
        let html = '';
        const tiposOrdenados = {
            'manana_semana': 'Mañana (Lun-Vie)',
            'manana_sabado': 'Mañana (Sábado)',
            'tarde_semana': 'Tarde (Lun-Vie)',
            'tarde_sabado': 'Tarde (Sábado)',
            'noche_semana': 'Noche (Lun-Vie)',
            'noche_domingo': 'Noche (Domingo)'
        };
        
        Object.keys(tiposOrdenados).forEach(tipo => {
            if (desglose[tipo] && desglose[tipo].dias > 0) {
                const data = desglose[tipo];
                html += `
                    <div style="margin:5px 0; padding:8px; background:white; border-radius:4px; font-size:0.9em;">
                        <strong>${tiposOrdenados[tipo]}:</strong> ${data.dias} días - $${data.total.toLocaleString('es-AR', {minimumFractionDigits: 2})}<br>
                        <small style="color:#666;">
                `;
                Object.keys(data.horas).forEach(tipoHora => {
                    if (data.horas[tipoHora] > 0) {
                        const nombreHora = tipoHora === 'normales' ? 'Normales' : 
                                         tipoHora === 'nocturnas' ? 'Nocturnas' :
                                         tipoHora === 'sabado' ? 'Sábado 100%' :
                                         tipoHora === 'nocturnas50' ? 'Nocturnas 50%' :
                                         tipoHora === 'nocturnas100' ? 'Nocturnas 100%' :
                                         tipoHora === 'extras' ? 'Extras' : tipoHora;
                        html += `${nombreHora}: ${data.horas[tipoHora]}h | `;
                    }
                });
                html = html.replace(/ \| $/, '') + '</small></div>';
            }
        });
        return html;
    }
    
    let resumenHTML = '';
    
    // Primera quincena
    if (primeraQuincena.dias > 0) {
        resumenHTML += `
            <div style="border:2px solid #1976d2; border-radius:8px; margin-bottom:18px; background:linear-gradient(90deg,#e3f0ff 60%,#fafdff 100%); box-shadow:0 2px 8px #1976d222; padding:12px 16px;">
                <h3 style="margin:0 0 8px 0; color:#1976d2;">Primera Quincena (1 al 15)</h3>
                <p>Total: <strong>$${primeraQuincena.total.toLocaleString('es-AR', {minimumFractionDigits: 2})}</strong></p>
                <p>Días trabajados: <strong>${primeraQuincena.dias}</strong></p>
                <div style="margin-top:10px;">
                    <strong>Desglose detallado:</strong><br>
                    ${generarDesgloseHTML(primeraQuincena.desglose)}
                </div>
            </div>
        `;
    }
    
    // Segunda quincena
    if (segundaQuincena.dias > 0) {
        resumenHTML += `
            <div style="border:2px solid #388e3c; border-radius:8px; margin-bottom:18px; background:linear-gradient(90deg,#e8f5e9 60%,#fafdff 100%); box-shadow:0 2px 8px #388e3c22; padding:12px 16px;">
                <h3 style="margin:0 0 8px 0; color:#388e3c;">Segunda Quincena (16 al fin de mes)</h3>
                <p>Total (sin suma no remunerativa): <strong>$${segundaQuincena.total.toLocaleString('es-AR', {minimumFractionDigits: 2})}</strong></p>
                <p>Suma No Remunerativa: <strong>$${sumaNoRemun.toLocaleString('es-AR')}</strong></p>
                <p>Total con suma no remunerativa: <strong>$${(segundaQuincena.total + sumaNoRemun).toLocaleString('es-AR', {minimumFractionDigits: 2})}</strong></p>
                <p>Días trabajados: <strong>${segundaQuincena.dias}</strong></p>
                <div style="margin-top:10px;">
                    <strong>Desglose detallado:</strong><br>
                    ${generarDesgloseHTML(segundaQuincena.desglose)}
                </div>
            </div>
        `;
    }
    
    // Total general
    resumenHTML += `
        <div style="border:2px solid #f9a825; border-radius:8px; background:linear-gradient(90deg,#fffde7 60%,#fffbe7 100%); box-shadow:0 2px 8px #f9a82522; padding:12px 16px;">
            <h3 style="margin:0 0 8px 0; color:#f9a825;">Total General</h3>
            <p>Total de Salario: <strong>$${totalGeneral.toLocaleString('es-AR', {minimumFractionDigits: 2})}</strong></p>
            <p>Total con suma no remunerativa: <strong>$${(totalGeneral + sumaNoRemun).toLocaleString('es-AR', {minimumFractionDigits: 2})}</strong></p>
            <p>Días trabajados: <strong>${detallesPorDia.length}</strong></p>
        </div>
    `;
    
    summaryDiv.innerHTML = resumenHTML;
    
    // Detalles por día con desglose completo
    let detallesHTML = '<h4>Detalle por día:</h4>';
    detallesPorDia.forEach(dia => {
        const desglose = dia.desglose;
        detallesHTML += `
            <div style="border: 1px solid #ddd; padding: 12px; margin: 8px 0; border-radius: 8px; background: #fafafa;">
                <div style="background: #1976d2; color: white; padding: 8px; margin: -12px -12px 10px -12px; border-radius: 8px 8px 0 0;">
                    <strong>${dia.fecha}</strong>
                </div>
                <div style="margin-bottom: 8px;">
                    <strong>Total a cobrar: $${dia.totalDia.toLocaleString('es-AR', {minimumFractionDigits: 2})}</strong>
                </div>
                <div style="font-size: 0.9em; line-height: 1.4;">
                    ${dia.horas.normales > 0 ? `• Normales: ${dia.horas.normales}h<br>` : ''}
                    ${dia.horas.nocturnas > 0 ? `• Nocturnas: ${dia.horas.nocturnas}h<br>` : ''}
                    ${dia.horas.sabado > 0 ? `• Sábado 100%: ${dia.horas.sabado}h<br>` : ''}
                    ${dia.horas.nocturnas50 > 0 ? `• Nocturnas 50%: ${dia.horas.nocturnas50}h<br>` : ''}
                    ${dia.horas.nocturnas100 > 0 ? `• Nocturnas 100%: ${dia.horas.nocturnas100}h<br>` : ''}
                    ${dia.horas.feriado > 0 ? `• Feriado: ${dia.horas.feriado}h<br>` : ''}
                    ${dia.horasExtras > 0 ? `• Extras: ${dia.horasExtras}h<br>` : ''}
                </div>
                <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #ddd; font-size: 0.85em; color: #666;">
                    ${desglose.normales > 0 ? `Normales: $${desglose.normales.toLocaleString('es-AR', {minimumFractionDigits: 2})} | ` : ''}
                    ${desglose.nocturnas > 0 ? `Nocturnas: $${desglose.nocturnas.toLocaleString('es-AR', {minimumFractionDigits: 2})} | ` : ''}
                    ${desglose.antiguedad > 0 ? `Antigüedad: $${desglose.antiguedad.toLocaleString('es-AR', {minimumFractionDigits: 2})} | ` : ''}
                    ${desglose.adicional > 0 ? `Adicional: $${desglose.adicional.toLocaleString('es-AR', {minimumFractionDigits: 2})} | ` : ''}
                    Presentismo: $${desglose.presentismo.toLocaleString('es-AR', {minimumFractionDigits: 2})}
                </div>
            </div>
        `;
    });
    
    detailsDiv.innerHTML = detallesHTML;
    document.getElementById('results-section').style.display = 'block';
}

// Alternar detalles
function toggleDetails() {
    const details = document.getElementById('calculation-details');
    const btn = document.getElementById('toggle-details-btn');
    
    if (details.style.display === 'none') {
        details.style.display = 'block';
        btn.textContent = 'Ocultar Detalles';
    } else {
        details.style.display = 'none';
        btn.textContent = 'Mostrar Detalles';
    }
}
