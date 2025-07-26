// script exclusivo para calculo_hora.html
// Aquí puedes agregar toda la lógica y funciones específicas para la página de cálculo por hora

// Ejemplo de función exclusiva:
function mostrarMensajeHora() {
    const contenedor = document.getElementById('hora-mensaje');
    if (contenedor) {
        contenedor.textContent = 'Funcionalidad exclusiva para cálculo por hora.';
    }
}

function calcularSueldoHora() {
    // Obtener valores
    const normales = parseFloat(document.getElementById('horas-normales').value) || 0;
    const sabado = parseFloat(document.getElementById('horas-sabado').value) || 0;
    const sabado50 = parseFloat(document.getElementById('horas-sabado-50').value) || 0;
    const nocturnas = parseFloat(document.getElementById('horas-nocturnas').value) || 0;
    const nocturnas50 = parseFloat(document.getElementById('horas-nocturnas-50').value) || 0;
    const feriado = parseFloat(document.getElementById('horas-feriado').value) || 0;
    const valorHora = parseFloat(document.getElementById('valor-hora').value) || 0;
    const antiguedad = parseInt(document.getElementById('antiguedad').value) || 0;

    // Cálculos básicos
    let total = 0;
    total += normales * valorHora;
    total += sabado * valorHora;
    total += sabado50 * valorHora * 1.5;
    total += nocturnas * valorHora;
    total += nocturnas50 * valorHora * 1.5;
    total += feriado * valorHora * 2;
    // Antigüedad: 1% por año
    let extraAntiguedad = total * (antiguedad * 0.01);
    total += extraAntiguedad;

    // Mostrar resultado
    const mensaje = `Total calculado: <b>$${total.toFixed(2)}</b><br>Antigüedad: ${antiguedad} años (+$${extraAntiguedad.toFixed(2)})`;
    document.getElementById('hora-mensaje').innerHTML = mensaje;
}

function calcularTotal() {
    // Obtener valores
    const valorHora = parseFloat(document.getElementById('valor-hora-mostrar').dataset.valor) || 0;
    const horasNormales = parseFloat(document.getElementById('horas-normales').value) || 0;
    const horasSabado = parseFloat(document.getElementById('horas-sabado').value) || 0;
    const horasSabado50 = parseFloat(document.getElementById('horas-sabado-50').value) || 0;
    const horasNocturnas = parseFloat(document.getElementById('horas-nocturnas').value) || 0;
    const horasNocturnas50 = parseFloat(document.getElementById('horas-nocturnas-50').value) || 0;
    const horasFeriado = parseFloat(document.getElementById('horas-feriado').value) || 0;
    const presentismo = parseFloat(document.getElementById('presentismo').value) || 0;

    // Cálculos
    let total = 0;
    let desglose = [];
    if (horasNormales > 0) {
        const monto = horasNormales * valorHora;
        desglose.push(`Normales: ${horasNormales} x $${valorHora} = <b>$${monto.toFixed(2)}</b>`);
        total += monto;
    }
    if (horasSabado > 0) {
        const monto = horasSabado * (valorHora * 1.5);
        desglose.push(`Sábado: ${horasSabado} x $${(valorHora * 1.5).toFixed(2)} = <b>$${monto.toFixed(2)}</b>`);
        total += monto;
    }
    if (horasSabado50 > 0) {
        const monto = horasSabado50 * (valorHora * 1.5);
        desglose.push(`Sábado (%50): ${horasSabado50} x $${(valorHora * 1.5).toFixed(2)} = <b>$${monto.toFixed(2)}</b>`);
        total += monto;
    }
    if (horasNocturnas > 0) {
        const monto = horasNocturnas * (valorHora * 1.3);
        desglose.push(`Nocturnas: ${horasNocturnas} x $${(valorHora * 1.3).toFixed(2)} = <b>$${monto.toFixed(2)}</b>`);
        total += monto;
    }
    if (horasNocturnas50 > 0) {
        const monto = horasNocturnas50 * (valorHora * 1.3);
        desglose.push(`Nocturnas (%50): ${horasNocturnas50} x $${(valorHora * 1.3).toFixed(2)} = <b>$${monto.toFixed(2)}</b>`);
        total += monto;
    }
    if (horasFeriado > 0) {
        const monto = horasFeriado * valorHora;
        desglose.push(`Feriado: ${horasFeriado} x $${valorHora} = <b>$${monto.toFixed(2)}</b>`);
        total += monto;
    }
    // Presentismo
    let montoPresentismo = total * presentismo;
    if (presentismo > 0) {
        desglose.push(`Presentismo (${(presentismo*100).toFixed(0)}%): <b>$${montoPresentismo.toFixed(2)}</b>`);
    }
    total += montoPresentismo;
    document.getElementById('desglose-hora').innerHTML = desglose.length ? desglose.join('<br>') : '';
    document.getElementById('resultado-hora').innerHTML = `Total a cobrar: <b>$${total.toFixed(2)}</b>`;
}

// Selección de categoría actualiza valor hora y animación
const categoriaBtns = document.querySelectorAll('.categoria-btn');
categoriaBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        categoriaBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('categoria').value = btn.getAttribute('data-value');
        actualizarValorHora();
    });
});
// Selección de mes por botones
const mesBtns = document.querySelectorAll('.mes-btn');
mesBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        mesBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('mes').value = btn.getAttribute('data-value');
        actualizarValorHora();
    });
});
// Selección de antigüedad actualiza valor hora
const antigBtns = document.querySelectorAll('.antiguedad-btn');
antigBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        antigBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('antiguedad').value = btn.getAttribute('data-value');
        actualizarValorHora();
    });
});
// Tabla de valores hora por categoría y mes
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
function actualizarValorHora() {
    const mes = document.getElementById('mes').value;
    const categoria = document.getElementById('categoria').value;
    let valor = 0;
    if (valoresHoraCat[categoria] && valoresHoraCat[categoria][mes]) {
        valor = valoresHoraCat[categoria][mes];
    }
    const valorSpan = document.getElementById('valor-hora-mostrar');
    valorSpan.textContent = `$${valor}`;
    valorSpan.dataset.valor = valor;
    valorSpan.classList.remove('animated-flash');
    void valorSpan.offsetWidth;
    valorSpan.classList.add('animated-flash');
    calcularTotal();
}
// Inicializar botones activos y valor hora
categoriaBtns[0].classList.add('active');
mesBtns[0].classList.add('active');
antigBtns[0].classList.add('active');
actualizarValorHora();

// Selección de valor hora
const valorHoraBtns = document.querySelectorAll('.valor-hora-btn');
valorHoraBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        valorHoraBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('valor-hora').value = btn.getAttribute('data-value');
    });
});

document.addEventListener('DOMContentLoaded', mostrarMensajeHora);

// Nueva funcionalidad: tabla de valores hora por antigüedad y mes
const valoresAntiguedad = {
    "junio":   {1:25, 3:37, 5:50, 7:68, 9:81, 12:108, 15:130, 18:152, 22:175, 26:198, 30:217, 35:238, 40:261},
    "julio":   {1:27, 3:39, 5:53, 7:72, 9:86, 12:114, 15:138, 18:161, 22:186, 26:210, 30:230, 35:252, 40:277},
    "agosto":  {},
    "septiembre": {1:28, 3:41, 5:56, 7:76, 9:91, 12:121, 15:146, 18:170, 22:196, 26:222, 30:243, 35:267, 40:292},
    "octubre":  {},
    "noviembre": {}
};
function mostrarTablaAntiguedad() {
    const mes = document.getElementById('mes').value;
    const tabla = valoresAntiguedad[mes];
    let html = '<table style="width:100%;border-collapse:collapse;background:#fff;border-radius:8px;box-shadow:0 1px 6px #1976d222;">';
    html += '<tr style="background:#e3eaf3;color:#1976d2;font-weight:bold;"><td>Años</td><td>Valor Hora</td></tr>';
    if (tabla) {
        Object.keys(tabla).forEach(a => {
            html += `<tr><td style='padding:4px 8px;'>${a}</td><td style='padding:4px 8px;'>$${tabla[a]}</td></tr>`;
        });
    }
    html += '</table>';
    document.getElementById('tabla-antiguedad').innerHTML = html;
}
// Actualizar tabla al cambiar mes
mesBtns.forEach(btn => {
    btn.addEventListener('click', mostrarTablaAntiguedad);
});
// Inicializar tabla al cargar
mostrarTablaAntiguedad();

function mostrarMontoAntiguedad() {
    const mes = document.getElementById('mes').value;
    const antig = parseInt(document.getElementById('antiguedad').value);
    const tabla = valoresAntiguedad[mes];
    let monto = tabla && tabla[antig] ? tabla[antig] : 0;
    document.getElementById('tabla-antiguedad').innerHTML = `<div style='font-size:1.15em;color:#1976d2;font-weight:500;'>Antigüedad: <span style='color:#1976d2;font-weight:bold;'>$${monto}</span></div>`;
}
// Actualizar monto al cambiar mes o antigüedad
antigBtns.forEach(btn => {
    btn.addEventListener('click', mostrarMontoAntiguedad);
});
mesBtns.forEach(btn => {
    btn.addEventListener('click', mostrarMontoAntiguedad);
});
// Inicializar monto al cargar
mostrarMontoAntiguedad();

// --- Recalcular todo ante cualquier cambio ---
function inicializarRecalculoAutomatico() {
    // Inputs numéricos
    [
        'horas-normales',
        'horas-sabado',
        'horas-sabado-50',
        'horas-nocturnas',
        'horas-nocturnas-50',
        'horas-feriado'
    ].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', calcularTotal);
        }
    });
    // Botones de selección
    document.querySelectorAll('.categoria-btn').forEach(btn => {
        btn.addEventListener('click', calcularTotal);
    });
    document.querySelectorAll('.mes-btn').forEach(btn => {
        btn.addEventListener('click', calcularTotal);
    });
    document.querySelectorAll('.antiguedad-btn').forEach(btn => {
        btn.addEventListener('click', calcularTotal);
    });
    document.querySelectorAll('.presentismo-btn').forEach(btn => {
        btn.addEventListener('click', calcularTotal);
    });
}

window.addEventListener('DOMContentLoaded', inicializarRecalculoAutomatico);

// --- Presentismo: selección de porcentaje ---
const presentismoBtns = document.querySelectorAll('.presentismo-btn');
presentismoBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        presentismoBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        let valor = btn.getAttribute('data-value');
        // Validar valor
        if (isNaN(valor) || valor === null) valor = '0';
        document.getElementById('presentismo').value = valor;
        calcularTotal();
    });
});
presentismoBtns[0].classList.add('active'); // 20% por defecto
