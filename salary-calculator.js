function calcularSalarioCalendario(datos) {
    let total = 0;
    const monthKey = datos.monthKey || (() => {
        const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        const date = new Date();
        return `${months[date.getMonth()]}${String(date.getFullYear()).slice(-2)}`;
    })();
    const valorAntiguedad = datos.antiguedadAnios
        ? (SALARY_TABLES.seniority[datos.antiguedadAnios]?.[monthKey] || 0)
        : 0;
    const montoNormales = datos.horasNormales * datos.valorHora;
    const montoNocturnas = datos.horasNocturnas * datos.valorHora * 1.3;
    total += montoNormales + montoNocturnas;

    const horasBasicas = datos.horasNormales + datos.horasNocturnas;
    const montoAntiguedad = horasBasicas * valorAntiguedad;
    total += montoAntiguedad;

    const sumaBase = montoNormales + montoNocturnas;
    const montoAdicional = sumaBase * (datos.adicionalPorcentaje / 100);
    total += montoAdicional;

    total += datos.horasSabado * (datos.valorHora + valorAntiguedad) * 1.2 * 2;

    const baseNocturnaExtra = (datos.valorHora + valorAntiguedad + datos.valorHora * 0.3) * 1.2045;
    total += datos.horasNocturnas50 * baseNocturnaExtra * 1.5;
    total += datos.horasNocturnas100 * baseNocturnaExtra * 2;
    total += datos.horasFeriado * (datos.valorHora + valorAntiguedad) * 1.2;
    total += datos.horas50 * datos.valorHora * 1.5;

    const montoPresentismo = total * datos.presentismo;
    total += montoPresentismo;

    const detailsContainer = document.getElementById('calculation-details');
    if (detailsContainer) {
        detailsContainer.innerHTML = `
            <strong>Total sin retenciones:</strong> $${formatCurrency(total)}<br>
            <strong>Total a cobrar:</strong> $${formatCurrency(total * 0.8)}
        `;
    }

    const toggleBtn = document.getElementById('toggle-details-btn');
    if (toggleBtn) toggleBtn.style.display = 'block';

    return {
        totalSinRetenciones: total,
        totalACobrar: total * 0.8,
        desglose: {
            normales: montoNormales,
            nocturnas: montoNocturnas,
            antiguedad: montoAntiguedad,
            adicional: montoAdicional,
            presentismo: montoPresentismo
        }
    };
}
