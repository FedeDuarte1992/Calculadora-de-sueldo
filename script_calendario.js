/**
 * SCRIPT PARA CALCULADORA DE CALENDARIO
 * Automatiza el cálculo de horas según turno y día de la semana
 */

// 
const valoresHoraCat = SALARY_TABLES.hourly;
const valoresAntiguedad = SALARY_TABLES.seniority;
const SUMA_NO_REMUN = SALARY_TABLES.nonRemunerative;


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
        presentismo: document.getElementById('presentismo-select').value,
        bono: document.getElementById('bono') ? document.getElementById('bono').value : 0
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
        if (config.bono) {
            const bonoInput = document.getElementById('bono');
            if (bonoInput) {
                bonoInput.value = '1';
                document.querySelector('#bono-group [data-value="1"]')?.classList.add('active');
            }
        }
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

    // Configurar botones tipo toggle (ej: Bono)
    const configurarBotones = (selector, inputId) => {
        const botones = document.querySelectorAll(selector);
        if (!botones || botones.length === 0) return;
        botones.forEach(btn => {
            btn.addEventListener('click', function() {
                const input = document.getElementById(inputId);
                if (btn.classList.contains('active')) {
                    btn.classList.remove('active');
                    if (input) input.value = 0;
                } else {
                    botones.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    if (input) input.value = btn.getAttribute('data-value');
                }
                updateSelectedValues();
                saveConfiguration();
            });
        });
        // Activar primer botón por defecto si no hay valor guardado
        const input = document.getElementById(inputId);
        if (input && !input.value) {
            const firstBtn = document.querySelector(selector);
            if (firstBtn) {
                firstBtn.classList.add('active');
                input.value = firstBtn.getAttribute('data-value');
            }
        }
    };
    configurarBotones('.bono-btn', 'bono');
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
        if (categoria) html += `<strong>Categoría:</strong> ${categoria} | `;
        if (antiguedad) html += `<strong>Antigüedad:</strong> ${antiguedad} años | `;
        if (turno) html += `<strong>Turno:</strong> ${turno.charAt(0).toUpperCase() + turno.slice(1)} | `;
        if (adicional > 0) html += `<strong>Adicional:</strong> ${adicional}% | `;
        if (extras > 0) html += `<strong>Horas extras:</strong> ${extras}h | `;
        if (presentismo) html += `<strong>Presentismo:</strong> ${(parseFloat(presentismo) * 100).toFixed(0)}% | `;
        const bono = document.getElementById('bono') ? document.getElementById('bono').value : 0;
        if (bono && parseFloat(bono) > 0) {
            html += `<strong>Bono:</strong> $${parseFloat(bono).toLocaleString('es-AR')} | `;
        }
        
        // Mostrar valor hora si está disponible (basado en mes y año del calendario) 
        if (categoria && antiguedad) {
            const calendarMonth = currentDate.getMonth() + 1;
            const calendarYear = currentDate.getFullYear();
            const monthKey = getMonthKey(calendarMonth, calendarYear);
            const valorHora = valoresHoraCat[categoria] ? (valoresHoraCat[categoria][monthKey] || 0) : 0;
            const valorAntiguedad = valoresAntiguedad[parseInt(antiguedad)] ? (valoresAntiguedad[parseInt(antiguedad)][monthKey] || 0) : 0;
            if (valorHora > 0) {
                const prettyMonth = getMonthPrettyName(calendarMonth).charAt(0).toUpperCase() + getMonthPrettyName(calendarMonth).slice(1);
                html += `<br><strong>Mes:</strong> ${prettyMonth} | <strong>Valor hora:</strong> $${valorHora.toLocaleString('es-AR')} | <strong>Antigüedad/hora:</strong> $${valorAntiguedad.toLocaleString('es-AR')}`;
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
            showNotification('Todo limpiado correctamente', 'success');
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
    showNotification(`Turno "${turnoNombre}" asignado a ${cantidadDias} día${cantidadDias > 1 ? 's' : ''}`, 'success');
}

// Variable para rastrear posición del cursor
let cursorPosition = { x: 0, y: 0 };
document.addEventListener('mousemove', (e) => {
    cursorPosition.x = e.clientX;
    cursorPosition.y = e.clientY;
});

// Mostrar notificación elegante
function showNotification(message, type = 'info') {
    // Reuse the global util if available
    if (typeof window.showNotification === 'function' && window.showNotification !== showNotification) {
        window.showNotification(message, type);
        return;
    }
    // Fallback: simple notification
    const notification = document.createElement('div');
    notification.style.cssText = `position: fixed; left: 20px; bottom: 20px; z-index: 10000; background: #333; color: white; padding: 12px 20px; border-radius: 8px; font-weight: 500; opacity: 0; transform: scale(0.95); transition: all 0.2s ease;`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => { notification.style.opacity = '1'; notification.style.transform = 'scale(1)'; }, 10);
    setTimeout(() => { notification.style.opacity = '0'; notification.style.transform = 'scale(0.95)'; setTimeout(() => notification.remove(), 300); }, 3000);
}

// Calcular todos los días con turnos asignados
function calculateSelected() {
    const categoria = document.getElementById('categoria-select').value;
    const antiguedad = parseInt(document.getElementById('antiguedad-select').value);
    const adicional = parseFloat(document.getElementById('adicional-input').value) || 0;
    const horasExtras = parseInt(document.getElementById('extras-input').value) || 0;
    const presentismo = parseFloat(document.getElementById('presentismo-select').value || '0.20');
    
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
    showNotification(`Calculando ${diasConTurno.length} días...`, 'info');
    
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
        showNotification(`Cálculo completado: ${detallesPorDia.length} días procesados`, 'success');
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
    let sumaNoRemunDiferida = 0;
    const bonoSelected = parseFloat(document.getElementById('bono') ? document.getElementById('bono').value : 0) || 0;
    if (segundaQuincena.dias > 0 && primerDia && bonoSelected > 0) {
        const monthKey = getMonthKey(primerDia.mes, primerDia.año);
        sumaNoRemun = SUMA_NO_REMUN[monthKey] || 0;
        sumaNoRemunDiferida = SALARY_TABLES.deferredNonRemunerative[monthKey] || 0;
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
                ${sumaNoRemunDiferida > 0 ? `<p>Suma no remunerativa diferida a enero 2027: <strong>$${sumaNoRemunDiferida.toLocaleString('es-AR')}</strong></p>` : ''}
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
            ${sumaNoRemunDiferida > 0 ? `<p>Suma no remunerativa diferida a enero 2027: <strong>$${sumaNoRemunDiferida.toLocaleString('es-AR')}</strong></p>` : ''}
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
