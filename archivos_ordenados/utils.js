// utils.js
// Contiene funciones de utilidad generales que pueden ser usadas en cualquier parte de la aplicación.

// Helper para formatear moneda sin decimales y con separador de miles
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
// Depende de TABLA_ANTIGUEDAD (de constants.js)
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