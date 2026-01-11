// Test harness for calcularSalarioCalendario

const valoresAntiguedad = {
    1:  { "enero25": 25 }
};

function getMonthPrettyName(monthNumber) {
    const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    return months[monthNumber - 1];
}
function getMonthKey(monthNumber, year) {
    const shortMonth = getMonthPrettyName(monthNumber);
    const yy = String(year).slice(-2);
    return `${shortMonth}${yy}`;
}

function calcularSalarioCalendario(datos) {
    let total = 0;
    const monthKey = datos.monthKey || getMonthKey(new Date().getMonth() + 1, new Date().getFullYear());
    const valorAntiguedad = datos.antiguedadAnios ? (valoresAntiguedad[datos.antiguedadAnios] ? (valoresAntiguedad[datos.antiguedadAnios][monthKey] || 0) : 0) : 0;

    let montoNormales = 0;
    if (datos.horasNormales > 0) {
        montoNormales = datos.horasNormales * datos.valorHora;
        total += montoNormales;
    }

    let montoNocturnas = 0;
    if (datos.horasNocturnas > 0) {
        montoNocturnas = datos.horasNocturnas * (datos.valorHora * 1.3);
        total += montoNocturnas;
    }

    const totalHorasBasicas = datos.horasNormales + datos.horasNocturnas;
    let montoAntiguedad = 0;
    if (totalHorasBasicas > 0 && valorAntiguedad > 0) {
        montoAntiguedad = totalHorasBasicas * valorAntiguedad;
        total += montoAntiguedad;
    }

    const sumaBase = montoNormales + montoNocturnas;
    let montoAdicional = 0;
    if (datos.adicionalPorcentaje > 0 && sumaBase > 0) {
        montoAdicional = sumaBase * (datos.adicionalPorcentaje / 100);
        total += montoAdicional;
    }

    if (datos.horasSabado > 0) {
        const base = datos.valorHora + valorAntiguedad;
        const monto = datos.horasSabado * base * 1.2 * 2;
        total += monto;
    }

    if (datos.horasNocturnas50 > 0) {
        const nocturnidad = datos.valorHora * 0.3;
        const subtotal = datos.valorHora + valorAntiguedad + nocturnidad;
        const baseFinal = subtotal * 1.2045;
        const monto = datos.horasNocturnas50 * baseFinal * 1.5;
        total += monto;
    }

    if (datos.horasNocturnas100 > 0) {
        const nocturnidad = datos.valorHora * 0.3;
        const subtotal = datos.valorHora + valorAntiguedad + nocturnidad;
        const baseFinal = subtotal * 1.2045;
        const monto = datos.horasNocturnas100 * baseFinal * 2;
        total += monto;
    }

    if (datos.horasFeriado > 0) {
        const valorHoraFeriado = (datos.valorHora + valorAntiguedad) * 1.2;
        const montoFeriado = datos.horasFeriado * valorHoraFeriado;
        total += montoFeriado;
    }

    if (datos.horas50 > 0) {
        const monto = datos.horas50 * datos.valorHora * 1.5;
        total += monto;
    }

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

// Test scenario
const datosTest = {
    valorHora: 1000,
    horasNormales: 8,
    horasNocturnas: 0,
    horasSabado: 0,
    horasNocturnas50: 0,
    horasNocturnas100: 0,
    horasFeriado: 0,
    horas50: 0,
    presentismo: 0.20,
    adicionalPorcentaje: 10,
    antiguedadAnios: 1,
    monthKey: 'enero25'
};

const res = calcularSalarioCalendario(datosTest);
console.log('Resultado test:', res);

// Expected totalACobrar: 8640
if (Math.abs(res.totalACobrar - 8640) < 0.01) {
    console.log('✅ Test pasado');
    process.exit(0);
} else {
    console.error('❌ Test falló. totalACobrar esperado 8640, obtenido', res.totalACobrar);
    process.exit(1);
}