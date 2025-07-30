/**
 * =================================================================
 * SCRIPT PARA CÁLCULO POR HORAS
 * =================================================================
 * 
 * Este archivo maneja toda la lógica específica para el cálculo
 * de salarios por horas trabajadas.
 * 
 * Funcionalidades principales:
 * - Selección de categoría y mes
 * - Cálculo automático de valor hora
 * - Entrada manual de valor hora
 * - Cálculo de antigüedad
 * - Cálculo de diferentes tipos de horas (normales, nocturnas, extras, etc.)
 * - Cálculo de presentismo
 * - Actualización automática de resultados
 */

// =================================================================
// VARIABLES GLOBALES
// =================================================================

// Control de modo manual de valor hora
let usandoValorManual = false;

// Elementos del DOM
const valorHoraManualInput = document.getElementById('valor-hora-manual');
const usarValorManualBtn = document.getElementById('usar-valor-manual');
const valorHoraMostrar = document.getElementById('valor-hora-mostrar');
const msgValorManual = document.getElementById('msg-valor-manual');

// =================================================================
// TABLA DE VALORES SALARIALES
// =================================================================

/**
 * Tabla de valores hora por categoría y mes
 * Actualizada según convenio vigente
 */
const valoresHoraCat = {
    "A": {"junio":2750, "julio":2804, "agosto":2858, "septiembre":2912, "octubre":2966, "noviembre":3020},
    "B": {"junio":2800, "julio":2855, "agosto":2910, "septiembre":2965, "octubre":3020, "noviembre":3074},
    "C": {"junio":2854, "julio":2910, "agosto":2966, "septiembre":3022, "octubre":3078, "noviembre":3134},
    "D": {"junio":2905, "julio":2962, "agosto":3019, "septiembre":3076, "octubre":3133, "noviembre":3190},
    "E": {"junio":2964, "julio":3022, "agosto":3080, "septiembre":3138, "octubre":3197, "noviembre":3255},
    "F": {"junio":3021, "julio":3080, "agosto":3140, "septiembre":3199, "octubre":3258, "noviembre":3317},
    "G": {"junio":3115, "julio":3176, "agosto":3237, "septiembre":3298, "octubre":3359, "noviembre":3420},
    "H": {"junio":3182, "julio":3245, "agosto":3307, "septiembre":3370, "octubre":3432, "noviembre":3494}
};

/**
 * Tabla de valores de antigüedad por años y mes
 */
const valoresAntiguedad = {
    "junio":   {1:25, 3:37, 5:50, 7:68, 9:81, 12:108, 15:130, 18:152, 22:175, 26:198, 30:217, 35:238, 40:261},
    "julio":   {1:27, 3:39, 5:53, 7:72, 9:86, 12:114, 15:138, 18:161, 22:186, 26:210, 30:230, 35:252, 40:277},
    "agosto":  {1:27, 3:40, 5:54, 7:74, 9:88, 12:117, 15:142, 18:165, 22:190, 26:215, 30:235, 35:258, 40:283},
    "septiembre": {1:28, 3:41, 5:56, 7:76, 9:91, 12:121, 15:146, 18:170, 22:196, 26:222, 30:243, 35:267, 40:292},
    "octubre":  {1:28, 3:42, 5:57, 7:78, 9:93, 12:124, 15:150, 18:174, 22:200, 26:227, 30:248, 35:273, 40:298},
    "noviembre": {1:29, 3:43, 5:58, 7:79, 9:95, 12:127, 15:153, 18:178, 22:204, 26:232, 30:253, 35:278, 40:304}
};

// =================================================================
// FUNCIONES DE VALOR HORA
// =================================================================

/**
 * Obtiene el valor hora según el modo (automático o manual)
 * @returns {number} Valor hora calculado
 */
function obtenerValorHora() {
    if (usandoValorManual && valorHoraManualInput.value && parseFloat(valorHoraManualInput.value) > 0) {
        return parseFloat(valorHoraManualInput.value);
    }
    
    // Modo automático
    const mes = document.getElementById('mes').value;
    const categoria = document.getElementById('categoria').value;
    
    if (!mes || !categoria) return 0;
    
    if (valoresHoraCat[categoria] && valoresHoraCat[categoria][mes]) {
        return valoresHoraCat[categoria][mes];
    }
    
    return 0;
}

/**
 * Actualiza la visualización del valor hora
 */
function actualizarValorHoraMostrar() {
    const valor = obtenerValorHora();
    valorHoraMostrar.textContent = valor > 0 ? 
        `$${valor.toLocaleString('es-AR', {minimumFractionDigits:2, maximumFractionDigits:2})}` : 
        '$0';
    valorHoraMostrar.dataset.valor = valor;
    
    // Agregar animación visual
    valorHoraMostrar.classList.remove('animated-flash');
    void valorHoraMostrar.offsetWidth; // Forzar reflow
    valorHoraMostrar.classList.add('animated-flash');
}

/**
 * Activa o desactiva el modo manual de valor hora
 * @param {boolean} activar - True para activar modo manual
 */
function setModoManual(activar) {
    usandoValorManual = activar;
    
    // Habilitar/deshabilitar selectores automáticos
    document.querySelectorAll('.categoria-btn, .mes-btn').forEach(btn => {
        btn.disabled = activar;
        if (activar) {
            btn.classList.add('disabled');
        } else {
            btn.classList.remove('disabled');
        }
    });
    
    // Los botones de antigüedad siempre están habilitados
    document.querySelectorAll('.antiguedad-btn').forEach(btn => btn.disabled = false);
    
    // Configurar input manual y botón
    valorHoraManualInput.disabled = false;
    usarValorManualBtn.disabled = !(valorHoraManualInput.value && parseFloat(valorHoraManualInput.value) > 0);
    
    if (!activar) {
        valorHoraManualInput.value = '';
    }
    
    actualizarValorHoraMostrar();
    calcularTotal();
}

/**
 * Muestra mensaje visual cuando se activa el valor hora manual
 */
function mostrarMensajeValorManual() {
    if (!msgValorManual) return;
    
    msgValorManual.textContent = 'Usando valor hora manual';
    msgValorManual.style.display = 'block';
    msgValorManual.style.background = '#1976d2';
    msgValorManual.style.color = '#fff';
    msgValorManual.style.padding = '4px 16px';
    msgValorManual.style.borderRadius = '8px';
    msgValorManual.style.fontSize = '0.98em';
    msgValorManual.style.margin = '8px auto 0 auto';
    msgValorManual.style.maxWidth = '220px';
    msgValorManual.style.boxShadow = '0 2px 12px #1976d288';
    msgValorManual.style.opacity = '1';
    
    // Animación del input
    valorHoraManualInput.style.background = '#e3f2fd';
    valorHoraManualInput.style.transition = 'background 0.5s';
    
    // Ocultar mensaje después de 2 segundos
    setTimeout(() => {
        msgValorManual.style.opacity = '0';
        setTimeout(() => {
            msgValorManual.style.display = 'none';
        }, 300);
        valorHoraManualInput.style.background = '';
    }, 2000);
}

// =================================================================
// FUNCIONES DE CÁLCULO
// =================================================================

/**
 * Obtiene el valor de antigüedad desde la tabla según años y mes
 * @param {number} anos - Años de antigüedad
 * @param {string} mes - Mes seleccionado
 * @returns {number} Valor fijo de antigüedad
 */
function obtenerValorAntiguedad(anos, mes) {
    if (!mes || !valoresAntiguedad[mes]) return 0;
    return valoresAntiguedad[mes][anos] || 0;
}

/**
 * Función principal de cálculo de total
 * Calcula el salario total basado en todos los parámetros ingresados
 */
function calcularTotal() {
    // Obtener valores de entrada
    const valorHora = obtenerValorHora();
    const horasNormales = parseFloat(document.getElementById('horas-normales').value) || 0;
    const horasSabado = parseFloat(document.getElementById('horas-sabado').value) || 0;
    const horasSabado50 = parseFloat(document.getElementById('horas-sabado-50').value) || 0;
    const horasNocturnas = parseFloat(document.getElementById('horas-nocturnas').value) || 0;
    const horasNocturnas50 = parseFloat(document.getElementById('horas-nocturnas-50').value) || 0;
    const horasFeriado = parseFloat(document.getElementById('horas-feriado').value) || 0;
    const presentismo = parseFloat(document.getElementById('presentismo').value) || 0;
    const adicionalPorcentaje = parseFloat(document.getElementById('adicional-basico').value) || 0;

    // Validar que hay valor hora
    if (valorHora <= 0) {
        document.getElementById('resultado-hora').innerHTML = 'Selecciona categoría y mes, o ingresa un valor hora manual';
        document.getElementById('desglose-hora').innerHTML = '';
        return;
    }

    // Obtener valor fijo de antigüedad desde la tabla
    const antiguedadAnios = parseFloat(document.getElementById('antiguedad').value) || 0;
    const mes = document.getElementById('mes').value;
    const valorAntiguedad = obtenerValorAntiguedad(antiguedadAnios, mes);
    const valorHoraConAntiguedad = valorHora + valorAntiguedad;

    // Variables para el cálculo
    let total = 0;
    let desglose = [];
    let montoNormales = 0;
    let montoNocturnas = 0;

    // Calcular horas normales
    if (horasNormales > 0) {
        montoNormales = horasNormales * valorHoraConAntiguedad;
        if (valorAntiguedad > 0) {
            desglose.push(`Normales: ${horasNormales}h × ($${valorHora.toFixed(2)} + $${valorAntiguedad.toFixed(2)} antig.) = <b>$${montoNormales.toFixed(2)}</b>`);
        } else {
            desglose.push(`Normales: ${horasNormales}h × $${valorHoraConAntiguedad.toFixed(2)} = <b>$${montoNormales.toFixed(2)}</b>`);
        }
        total += montoNormales;
    }

    // Calcular horas sábado 100%
    if (horasSabado > 0) {
        const base = valorHoraConAntiguedad;
        const veintePorc = base * 0.2;
        const baseConVeinte = base + veintePorc;
        const valorHoraSabado100 = baseConVeinte * 2;
        const monto = horasSabado * valorHoraSabado100;
        desglose.push(`Sábado 100%: ${horasSabado}h × [(${base.toFixed(2)} + 20%) × 2] = <b>$${monto.toFixed(2)}</b>`);
        total += monto;
    }

    // Calcular horas sábado 50%
    if (horasSabado50 > 0) {
        const monto = horasSabado50 * (valorHora * 1.5);
        desglose.push(`Sábado 50%: ${horasSabado50}h × $${(valorHora * 1.5).toFixed(2)} = <b>$${monto.toFixed(2)}</b>`);
        total += monto;
    }

    // Calcular horas nocturnas
    if (horasNocturnas > 0) {
        montoNocturnas = horasNocturnas * (valorHora * 1.3);
        desglose.push(`Nocturnas: ${horasNocturnas}h × $${(valorHora * 1.3).toFixed(2)} = <b>$${montoNocturnas.toFixed(2)}</b>`);
        total += montoNocturnas;
    }

    // Calcular adicional sobre básico
    const sumaBase = montoNormales + montoNocturnas;
    if (adicionalPorcentaje > 0 && sumaBase > 0) {
        const adicionalBasico = sumaBase * (adicionalPorcentaje / 100);
        desglose.push(`Adicional sobre básico (${adicionalPorcentaje}%): <b>$${adicionalBasico.toFixed(2)}</b>`);
        total += adicionalBasico;
    }

    // Calcular horas nocturnas 50%
    if (horasNocturnas50 > 0) {
        const monto = horasNocturnas50 * (valorHora * 1.3);
        desglose.push(`Nocturnas 50%: ${horasNocturnas50}h × $${(valorHora * 1.3).toFixed(2)} = <b>$${monto.toFixed(2)}</b>`);
        total += monto;
    }

    // Calcular horas feriado
    if (horasFeriado > 0) {
        const monto = horasFeriado * valorHora;
        desglose.push(`Feriado: ${horasFeriado}h × $${valorHora.toFixed(2)} = <b>$${monto.toFixed(2)}</b>`);
        total += monto;
    }

    // Calcular presentismo
    let montoPresentismo = total * presentismo;
    if (presentismo > 0) {
        desglose.push(`Presentismo (${(presentismo*100).toFixed(0)}%): <b>$${montoPresentismo.toFixed(2)}</b>`);
        total += montoPresentismo;
    }

    // Mostrar resultados
    document.getElementById('desglose-hora').innerHTML = desglose.length ? desglose.join('<br>') : '';
    document.getElementById('resultado-hora').innerHTML = `Total a cobrar: <b>$${total.toLocaleString('es-AR', {minimumFractionDigits:2, maximumFractionDigits:2})}</b>`;
}

// =================================================================
// FUNCIONES DE INTERFAZ
// =================================================================

/**
 * Configura los event listeners para los botones de selección
 */
function configurarEventListeners() {
    // Botones de categoría
    const categoriaBtns = document.querySelectorAll('.categoria-btn');
    categoriaBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (usandoValorManual) {
                setModoManual(false);
            }
            
            const input = document.getElementById('categoria');
            if (btn.classList.contains('active')) {
                btn.classList.remove('active');
                input.value = '';
            } else {
                categoriaBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                input.value = btn.getAttribute('data-value');
            }
            actualizarValorHoraMostrar();
            calcularTotal();
        });
    });

    // Botones de mes
    const mesBtns = document.querySelectorAll('.mes-btn');
    mesBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (usandoValorManual) {
                setModoManual(false);
            }
            
            const input = document.getElementById('mes');
            if (btn.classList.contains('active')) {
                btn.classList.remove('active');
                input.value = '';
            } else {
                mesBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                input.value = btn.getAttribute('data-value');
            }
            actualizarValorHoraMostrar();
            mostrarTablaAntiguedad();
            calcularTotal();
        });
    });

    // Botones de antigüedad
    const antigBtns = document.querySelectorAll('.antiguedad-btn');
    antigBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            antigBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('antiguedad').value = btn.getAttribute('data-value');
            actualizarValorHoraMostrar();
            mostrarMontoAntiguedad();
            calcularTotal();
        });
    });

    // Botones de presentismo
    const presentismoBtns = document.querySelectorAll('.presentismo-btn');
    presentismoBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            presentismoBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            let valor = btn.getAttribute('data-value');
            if (isNaN(valor) || valor === null) valor = '0';
            document.getElementById('presentismo').value = valor;
            calcularTotal();
        });
    });

    // Valor hora manual
    if (usarValorManualBtn && valorHoraManualInput) {
        usarValorManualBtn.addEventListener('click', () => {
            if (valorHoraManualInput.value && parseFloat(valorHoraManualInput.value) > 0) {
                setModoManual(true);
                mostrarMensajeValorManual();
            } else {
                valorHoraManualInput.focus();
                valorHoraManualInput.style.background = '#ffe0e0';
                setTimeout(() => valorHoraManualInput.style.background = '#fff', 800);
            }
        });

        valorHoraManualInput.addEventListener('input', () => {
            usarValorManualBtn.disabled = !(valorHoraManualInput.value && parseFloat(valorHoraManualInput.value) > 0);
            if (usandoValorManual) {
                actualizarValorHoraMostrar();
                calcularTotal();
            }
        });
    }

    // Inputs numéricos - recalcular automáticamente
    const inputsNumericos = [
        'horas-normales', 'horas-sabado', 'horas-sabado-50',
        'horas-nocturnas', 'horas-nocturnas-50', 'horas-feriado',
        'adicional-basico'
    ];
    
    inputsNumericos.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', calcularTotal);
        }
    });
}

/**
 * Muestra la tabla de valores de antigüedad según el mes seleccionado
 */
function mostrarTablaAntiguedad() {
    const mes = document.getElementById('mes').value;
    const tabla = valoresAntiguedad[mes];
    const container = document.getElementById('tabla-antiguedad');
    
    if (!tabla || !container) return;
    
    let html = '<table style="width:100%;border-collapse:collapse;background:#fff;border-radius:8px;box-shadow:0 1px 6px #1976d222;margin-top:8px;">';
    html += '<tr style="background:#e3eaf3;color:#1976d2;font-weight:bold;"><td style="padding:6px 8px;">Años</td><td style="padding:6px 8px;">Valor Hora Antigüedad</td></tr>';
    
    Object.keys(tabla).forEach(anos => {
        html += `<tr><td style='padding:4px 8px;text-align:center;'>${anos}</td><td style='padding:4px 8px;text-align:center;'>$${tabla[anos]}</td></tr>`;
    });
    
    html += '</table>';
    container.innerHTML = html;
}

/**
 * Muestra el monto de antigüedad calculado
 */
function mostrarMontoAntiguedad() {
    const antig = parseFloat(document.getElementById('antiguedad').value) || 0;
    const mes = document.getElementById('mes').value;
    const monto = obtenerValorAntiguedad(antig, mes);
    
    const container = document.getElementById('tabla-antiguedad');
    if (container) {
        container.innerHTML = `<div style='font-size:1.15em;color:#1976d2;font-weight:500;text-align:center;padding:8px;background:#f8f9fa;border-radius:8px;margin-top:8px;'>Antigüedad: <span style='color:#1976d2;font-weight:bold;'>$${monto.toFixed(2)}</span></div>`;
    }
}

// =================================================================
// INICIALIZACIÓN
// =================================================================

/**
 * Inicializa la aplicación cuando se carga el DOM
 */
function inicializar() {
    // Configurar event listeners
    configurarEventListeners();
    
    // Configurar estado inicial
    document.getElementById('categoria').value = '';
    document.getElementById('mes').value = '';
    
    // Activar primer botón de antigüedad por defecto
    const primerAntiguedadBtn = document.querySelector('.antiguedad-btn');
    if (primerAntiguedadBtn) {
        primerAntiguedadBtn.classList.add('active');
    }
    
    // Activar primer botón de presentismo por defecto
    const primerPresentismoBtn = document.querySelector('.presentismo-btn');
    if (primerPresentismoBtn) {
        primerPresentismoBtn.classList.add('active');
    }
    
    // Configurar modo inicial
    setModoManual(false);
    actualizarValorHoraMostrar();
    calcularTotal();
    
    console.log('Script de cálculo por horas inicializado correctamente');
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializar);

// =================================================================
// FUNCIONES DE UTILIDAD
// =================================================================

/**
 * Formatea un número como moneda argentina
 * @param {number} amount - Cantidad a formatear
 * @returns {string} Cantidad formateada
 */
function formatearMoneda(amount) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

/**
 * Valida que un valor sea un número positivo
 * @param {any} value - Valor a validar
 * @returns {boolean} True si es válido
 */
function esNumeroPositivo(value) {
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0;
}