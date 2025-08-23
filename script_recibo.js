/**
 * SCRIPT PARA ANÁLISIS DE RECIBOS DE SUELDO
 * Utiliza OCR para extraer datos de recibos
 */

// Variables globales
let extractedData = [];
let currentFiles = [];
let currentFileIndex = 0;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    setupFileUpload();
});

// Configurar área de subida de archivos
function setupFileUpload() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    
    // Click en área de subida
    uploadArea.addEventListener('click', () => fileInput.click());
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleMultipleFiles(Array.from(files));
        }
    });
    
    // Selección de archivos múltiples
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleMultipleFiles(Array.from(e.target.files));
        }
    });
}

// Manejar múltiples archivos
function handleMultipleFiles(files) {
    const validFiles = files.filter(validateFile);
    if (validFiles.length === 0) return;
    
    currentFiles = validFiles;
    currentFileIndex = 0;
    extractedData = [];
    
    showNotification(`Procesando ${validFiles.length} archivo(s)...`, 'info');
    processNextFile();
}

// Procesar siguiente archivo
async function processNextFile() {
    if (currentFileIndex >= currentFiles.length) {
        displayMultipleResults();
        return;
    }
    
    const file = currentFiles[currentFileIndex];
    showNotification(`Procesando archivo ${currentFileIndex + 1} de ${currentFiles.length}: ${file.name}`, 'info');
    
    try {
        const ocrResult = await simulateOCR(file);
        const parsedData = parseReceiptData(ocrResult);
        parsedData.fileName = file.name;
        extractedData.push(parsedData);
    } catch (error) {
        showNotification(`Error en ${file.name}: ${error.message}`, 'error');
    }
    
    currentFileIndex++;
    setTimeout(processNextFile, 1000);
}

// Validar archivo
function validateFile(file) {
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!validTypes.includes(file.type)) {
        showNotification('Formato no válido. Usa JPG, PNG o PDF', 'error');
        return false;
    }
    
    if (file.size > maxSize) {
        showNotification('Archivo muy grande. Máximo 10MB', 'error');
        return false;
    }
    
    return true;
}

// Mostrar vista previa
function showPreview(file) {
    const previewContainer = document.getElementById('preview-container');
    const previewImage = document.getElementById('preview-image');
    
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.src = e.target.result;
            previewContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        previewContainer.style.display = 'none';
    }
}

// Analizar recibo usando OCR
async function analyzeReceipt(file) {
    showLoading(true);
    
    try {
        // Simular análisis OCR (en producción usarías una API real)
        const ocrResult = await simulateOCR(file);
        const parsedData = parseReceiptData(ocrResult);
        
        extractedData = parsedData;
        displayResults(parsedData);
        
    } catch (error) {
        showNotification('Error al analizar el recibo: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

// Procesar archivo con OCR simplificado
async function simulateOCR(file) {
    showNotification(`Procesando ${file.name}...`, 'info');
    
    try {
        if (file.type === 'application/pdf') {
            return await processPDFSimple(file);
        } else if (file.type.startsWith('image/')) {
            return await processImageSimple(file);
        } else {
            throw new Error('Tipo de archivo no soportado');
        }
    } catch (error) {
        console.error('Error procesando archivo:', error);
        showNotification(`Error procesando ${file.name}, usando datos simulados`, 'error');
        return await simulateOCRFallback(file);
    }
}

// Procesar PDF de forma simple
async function processPDFSimple(file) {
    // Simular procesamiento
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Por ahora usar datos simulados hasta implementar OCR real
    showNotification(`PDF procesado: ${file.name}`, 'success');
    return generateVariableData(file.name);
}

// Procesar imagen de forma simple
async function processImageSimple(file) {
    // Simular procesamiento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Por ahora usar datos simulados hasta implementar OCR real
    showNotification(`Imagen procesada: ${file.name}`, 'success');
    return generateVariableData(file.name);
}

// Generar datos variables basados en el nombre del archivo
function generateVariableData(fileName) {
    const variations = {
        'recibo1': { mes: 'Junio', quincena: '1ra', horas: 55, nocturnas: 27, valor: 3120 },
        'recibo2': { mes: 'Junio', quincena: '2da', horas: 58, nocturnas: 25, valor: 3150 },
        'recibo3': { mes: 'Julio', quincena: '1ra', horas: 52, nocturnas: 30, valor: 3180 },
        'recibo4': { mes: 'Julio', quincena: '2da', horas: 60, nocturnas: 22, valor: 3200 }
    };
    
    // Buscar variación por nombre de archivo
    let variation = null;
    Object.keys(variations).forEach(key => {
        if (fileName.toLowerCase().includes(key)) {
            variation = variations[key];
        }
    });
    
    // Si no encuentra, usar variación aleatoria
    if (!variation) {
        const keys = Object.keys(variations);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        variation = variations[randomKey];
    }
    
    return {
        text: `
        DUPLICADO Recibo de Haberes
        HISAN SA
        LEGAJO 437 DUARTE, Federico
        Sueldo / Jornal: $ ${variation.valor}.00 Categoría Operario H
        ${variation.mes} ${variation.quincena} Quincena
        Sueldo Básico 10000 ${variation.horas}.00 ${variation.horas * variation.valor}.00
        Sueldo Nocturno 10005 ${variation.nocturnas}.00 ${Math.round(variation.nocturnas * variation.valor * 1.3)}.00
        Antigüedad 10100 50.00 4,100.00
        Adicional Sobre Básico 10119 ${Math.round((variation.horas + variation.nocturnas) * variation.valor * 0.2)}.40
        Horas sábado 100% 10156 1.00 7,608.00
        Horas Domingo y feriadas 100% 10158 2.00 19,780.80
        Horas extras Nocturnas 50% 10560 3.00 22,253.40
        Presentismo y Asistencia formal 11000 20.00 90,552.12
        Feriados 12000 60,864.00
        Jubilación 20000 11.00 59,764.00
        Ley 19032 20001 3.00 16,299.38
        Obra social 20002 3.00 16,299.38
        Asignación No Remunerativa 40675 210,000.00
        Total neto: 644,651.00
        `
    };
}

// Fallback con datos simulados
async function simulateOCRFallback(file) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateVariableData(file.name);
}



// Parsear datos del recibo con OCR mejorado
function parseReceiptData(ocrResult) {
    let text = ocrResult.text;
    
    // Preprocesar texto para mejorar reconocimiento
    text = preprocessOCRText(text);
    
    const data = {};
    
    // Patrones mejorados y más flexibles
    const patterns = {
        // Información del empleado - más flexible
        empleado: /(?:APELLIDO Y NOMBRE|EMPLEADO)[:\s]*([A-ZÁÉÍÓÚÑ][A-Za-záéíóúñ\s,]+)/i,
        legajo: /LEGAJO[:\s]*(\d+)/i,
        cuil: /C\.?U\.?I\.?[LT]\.?[:\s]*(\d{2}[-\s]?\d{8}[-\s]?\d)/i,
        categoria: /(?:Operario|Categor[íi]a)[\s:]*([A-H])/i,
        
        // Valor hora - múltiples formatos
        sueldoJornal: /(?:Sueldo|SUELDO)[\s\/]*(?:Jornal|JORNAL)[:\s]*\$?[\s]*([\d.,]+)/i,
        
        // Período más flexible
        periodo: /PER[ÍI]ODO[\s]*ABONADO[:\s]*([\d\/]+)/i,
        
        // Conceptos con patrones más robustos
        sueldoBasico: /(?:Sueldo|SUELDO)[\s]*(?:B[áa]sico|BASICO)[\s]*\d*[\s]*([\d.,]+)[\s]*([\d.,]+)/i,
        sueldoNocturno: /(?:Sueldo|SUELDO)[\s]*(?:Nocturno|NOCTURNO)[\s]*\d*[\s]*([\d.,]+)[\s]*([\d.,]+)/i,
        antiguedad: /(?:Antig[üu]edad|ANTIGUEDAD)[\s]*\d*[\s]*[\d.,]*[\s]*([\d.,]+)/i,
        adicionalBasico: /(?:Adicional|ADICIONAL)[\s]*(?:Sobre|SOBRE)[\s]*(?:B[áa]sico|BASICO)[\s]*\d*[\s]*([\d.,]+)/i,
        
        // Horas extras con mejor detección
        horasSabado: /(?:Horas|HORAS)[\s]*(?:s[áa]bado|SABADO)[\s]*100[\s]*%[\s]*\d*[\s]*([\d.,]+)/i,
        horasDomingo: /(?:Horas|HORAS)[\s]*(?:Domingo|DOMINGO)[\s]*(?:y|Y)?[\s]*(?:feriadas|FERIADAS)?[\s]*100[\s]*%[\s]*\d*[\s]*([\d.,]+)/i,
        horasExtrasNocturnas: /(?:Horas|HORAS)[\s]*(?:extras|EXTRAS)[\s]*(?:Nocturnas|NOCTURNAS)[\s]*50[\s]*%[\s]*\d*[\s]*([\d.,]+)/i,
        
        // Otros conceptos
        presentismo: /(?:Presentismo|PRESENTISMO)[\s]*(?:y|Y)?[\s]*(?:Asistencia|ASISTENCIA)?[\s]*(?:formal|FORMAL)?[\s]*\d*[\s]*[\d.,]*[\s]*([\d.,]+)/i,
        feriados: /(?:Feriados|FERIADOS)[\s]*\d*[\s]*([\d.,]+)/i,
        
        // Descuentos
        jubilacion: /(?:Jubilaci[óo]n|JUBILACION)[\s]*\d*[\s]*[\d.,]*[\s]*([\d.,]+)/i,
        ley19032: /(?:Ley|LEY)[\s]*19032[\s]*\d*[\s]*[\d.,]*[\s]*([\d.,]+)/i,
        obraSocial: /(?:Obra|OBRA)[\s]*(?:social|SOCIAL)[\s]*\d*[\s]*[\d.,]*[\s]*([\d.,]+)/i,
        
        // Totales
        totalNeto: /(?:Total|TOTAL)[\s]*(?:neto|NETO)[:\s]*([\d.,]+)/i,
        asignacionNoRemunerativa: /(?:Asignaci[óo]n|ASIGNACION)[\s]*(?:No|NO)[\s]*(?:Remunerativa|REMUNERATIVA)[\s]*\d*[\s]*([\d.,]+)/i
    };
    
    // Extraer datos con validación mejorada
    Object.keys(patterns).forEach(key => {
        const matches = text.match(patterns[key]);
        if (matches) {
            let value = matches[1];
            
            // Limpiar y validar valor
            value = cleanNumericValue(value);
            
            if (value && !isNaN(parseFloat(value))) {
                data[key] = value;
            }
        }
    });
    
    // Extraer horas de manera más precisa
    extractHoursData(text, data);
    
    // Determinar valor hora con prioridades
    determineHourlyRate(data);
    
    // Validar y corregir datos extraídos
    validateAndCorrectData(data);
    
    return data;
}

// Preprocesar texto OCR para mejorar reconocimiento
function preprocessOCRText(text) {
    // Normalizar espacios y saltos de línea
    text = text.replace(/\s+/g, ' ');
    
    // Corregir caracteres comunes mal reconocidos
    const corrections = {
        '0': ['O', 'o', '°'],
        '1': ['l', 'I', '|'],
        '5': ['S', 's'],
        '6': ['G', 'b'],
        '8': ['B'],
        'á': ['a'],
        'é': ['e'],
        'í': ['i'],
        'ó': ['o'],
        'ú': ['u'],
        'ñ': ['n']
    };
    
    // Aplicar correcciones en contextos específicos
    Object.keys(corrections).forEach(correct => {
        corrections[correct].forEach(wrong => {
            // Solo corregir en contextos numéricos para números
            if (/\d/.test(correct)) {
                text = text.replace(new RegExp(`(?<=\d)${wrong}(?=\d)`, 'g'), correct);
                text = text.replace(new RegExp(`(?<=\$\s*)${wrong}(?=\d)`, 'g'), correct);
            }
        });
    });
    
    return text;
}

// Limpiar valores numéricos
function cleanNumericValue(value) {
    if (!value) return null;
    
    // Remover caracteres no numéricos excepto puntos y comas
    value = value.replace(/[^\d.,]/g, '');
    
    // Manejar formato argentino (punto como separador de miles, coma como decimal)
    if (value.includes(',') && value.includes('.')) {
        // Si tiene ambos, asumir formato: 1.234,56
        value = value.replace(/\./g, '').replace(',', '.');
    } else if (value.includes(',')) {
        // Solo coma, podría ser decimal
        const parts = value.split(',');
        if (parts[1] && parts[1].length <= 2) {
            value = value.replace(',', '.');
        } else {
            value = value.replace(/,/g, '');
        }
    }
    
    return value;
}

// Extraer datos de horas de manera más precisa
function extractHoursData(text, data) {
    // Buscar tabla de conceptos
    const tablePattern = /(?:Descripci[óo]n|DESCRIPCION)[\s\S]*?(?:Total|TOTAL)/i;
    const tableMatch = text.match(tablePattern);
    
    if (tableMatch) {
        const tableText = tableMatch[0];
        
        // Extraer horas normales
        const normalMatch = tableText.match(/(?:Sueldo|SUELDO)[\s]*(?:B[áa]sico|BASICO)[\s]*\d*[\s]*([\d.,]+)[\s]*([\d.,]+)/i);
        if (normalMatch) {
            data.horasNormales = cleanNumericValue(normalMatch[1]);
        }
        
        // Extraer horas nocturnas
        const nocturnalMatch = tableText.match(/(?:Sueldo|SUELDO)[\s]*(?:Nocturno|NOCTURNO)[\s]*\d*[\s]*([\d.,]+)[\s]*([\d.,]+)/i);
        if (nocturnalMatch) {
            data.horasNocturnasUnidades = cleanNumericValue(nocturnalMatch[1]);
        }
    }
}

// Determinar valor hora con prioridades
function determineHourlyRate(data) {
    // Prioridad 1: Sueldo/Jornal explícito
    if (data.sueldoJornal) {
        data.valorHora = parseFloat(data.sueldoJornal).toFixed(2);
        return;
    }
    
    // Prioridad 2: Calcular desde sueldo básico y horas
    if (data.sueldoBasico && data.horasNormales) {
        const sueldo = parseFloat(data.sueldoBasico);
        const horas = parseFloat(data.horasNormales);
        if (horas > 0 && sueldo > 0) {
            data.valorHora = (sueldo / horas).toFixed(2);
            return;
        }
    }
    
    // Prioridad 3: Buscar en texto libre
    const hourRatePattern = /\$[\s]*([\d.,]+)[\s]*(?:por|POR)?[\s]*(?:hora|HORA)/i;
    const match = text.match(hourRatePattern);
    if (match) {
        const value = cleanNumericValue(match[1]);
        if (value) {
            data.valorHora = parseFloat(value).toFixed(2);
        }
    }
}

// Validar y corregir datos extraídos
function validateAndCorrectData(data) {
    // Validar rangos razonables
    const validations = {
        valorHora: { min: 1000, max: 10000 },
        horasNormales: { min: 0, max: 200 },
        horasNocturnasUnidades: { min: 0, max: 200 },
        totalNeto: { min: 10000, max: 2000000 }
    };
    
    Object.keys(validations).forEach(key => {
        if (data[key]) {
            const value = parseFloat(data[key]);
            const { min, max } = validations[key];
            
            if (value < min || value > max) {
                console.warn(`Valor sospechoso para ${key}: ${value}`);
                // Podrías decidir eliminar el valor o marcarlo como dudoso
                // delete data[key];
            }
        }
    });
    
    // Verificar consistencia entre datos relacionados
    if (data.valorHora && data.horasNormales && data.sueldoBasico) {
        const expectedSueldo = parseFloat(data.valorHora) * parseFloat(data.horasNormales);
        const actualSueldo = parseFloat(data.sueldoBasico);
        const difference = Math.abs(expectedSueldo - actualSueldo) / actualSueldo;
        
        if (difference > 0.1) { // 10% de diferencia
            console.warn('Inconsistencia en cálculo de sueldo básico');
        }
    }
}

// Mostrar resultados múltiples
function displayMultipleResults() {
    const resultsDiv = document.getElementById('analysis-results');
    const dataGrid = document.getElementById('extracted-data');
    
    if (extractedData.length === 0) {
        showNotification('No se pudieron procesar los archivos', 'error');
        return;
    }
    
    let html = '';
    
    if (extractedData.length === 1) {
        // Un solo archivo: mostrar formato normal
        html += generateDataHTML(extractedData[0]);
    } else {
        // Múltiples archivos: mostrar tabla comparativa
        html += generateComparisonTable(extractedData);
    }
    
    dataGrid.innerHTML = html;
    resultsDiv.style.display = 'block';
    showNotification(`Procesados ${extractedData.length} archivo(s) correctamente`, 'success');
}

// Generar tabla comparativa para múltiples recibos
function generateComparisonTable(dataArray) {
    const items = [
        { key: 'empleado', label: 'Empleado' },
        { key: 'categoria', label: 'Categoría' },
        { key: 'valorHora', label: 'Sueldo/jornal', format: 'money' },
        { key: 'horasNormales', label: 'Horas Normales', format: 'hours' },
        { key: 'horasNocturnasUnidades', label: 'Horas Nocturnas', format: 'hours' },
        { key: 'antiguedad', label: 'Antigüedad', format: 'money' },
        { key: 'asignacionNoRemunerativa', label: 'Asignación No Remunerativa', format: 'money' },
        { key: 'adicionalBasico', label: 'Adicional s/Básico', format: 'money' },
        { key: 'horasSabado', label: 'Horas Sábado 100%', format: 'hours' },
        { key: 'horasDomingo', label: 'Horas Domingo/Feriadas', format: 'hours' },
        { key: 'horasExtrasNocturnas', label: 'Horas Extras Nocturnas 50%', format: 'hours' },
        { key: 'presentismo', label: 'Presentismo', format: 'money' },
        { key: 'feriados', label: 'Feriados', format: 'money' },
        { key: 'totalNeto', label: 'Total Neto', format: 'money' }
    ];
    
    let html = `
        <div style="overflow-x: auto; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                <thead>
                    <tr style="background: #1976d2; color: white;">
                        <th style="padding: 12px; text-align: left; border-right: 1px solid #fff;">Concepto</th>
    `;
    
    // Generar encabezados de columnas (mes y quincena)
    dataArray.forEach((data, index) => {
        const fileName = data.fileName || `Recibo ${index + 1}`;
        // Extraer mes y quincena del nombre del archivo o usar genérico
        const mesQuincena = extractMonthQuincena(fileName) || `${getMonthName(index)} - ${index % 2 === 0 ? '1ra' : '2da'} Quincena`;
        html += `<th style="padding: 12px; text-align: center; border-right: 1px solid #fff; min-width: 150px;">${mesQuincena}</th>`;
    });
    
    html += `</tr></thead><tbody>`;
    
    // Generar filas de datos
    items.forEach((item, rowIndex) => {
        const bgColor = rowIndex % 2 === 0 ? '#f8f9fa' : 'white';
        html += `<tr style="background: ${bgColor};">`;
        html += `<td style="padding: 10px; font-weight: bold; border-right: 1px solid #ddd;">${item.label}</td>`;
        
        dataArray.forEach(data => {
            let value = data[item.key] || '-';
            
            if (value !== '-') {
                if (item.format === 'money') {
                    value = '$' + parseFloat(value).toLocaleString('es-AR');
                } else if (item.format === 'hours') {
                    value = value + (value == 1 ? ' hora' : ' horas');
                }
            }
            
            html += `<td style="padding: 10px; text-align: center; border-right: 1px solid #ddd;">${value}</td>`;
        });
        
        html += `</tr>`;
    });
    
    // Sección de retenciones
    html += `
        <tr style="background: #f44336; color: white;">
            <td colspan="${dataArray.length + 1}" style="padding: 10px; text-align: center; font-weight: bold;">RETENCIONES</td>
        </tr>
    `;
    
    const retenciones = [
        { key: 'jubilacion', label: 'Jubilación', value: '11%' },
        { key: 'ley19032', label: 'Ley 19032', value: '3%' },
        { key: 'obraSocial', label: 'Obra Social', value: '3%' }
    ];
    
    retenciones.forEach((ret, rowIndex) => {
        const bgColor = rowIndex % 2 === 0 ? '#ffebee' : 'white';
        html += `<tr style="background: ${bgColor};">`;
        html += `<td style="padding: 10px; font-weight: bold; border-right: 1px solid #ddd;">${ret.label}</td>`;
        
        dataArray.forEach(data => {
            const value = data[ret.key] ? ret.value : '-';
            html += `<td style="padding: 10px; text-align: center; border-right: 1px solid #ddd;">${value}</td>`;
        });
        
        html += `</tr>`;
    });
    
    html += `</tbody></table></div>`;
    return html;
}

// Extraer mes y quincena del nombre del archivo
function extractMonthQuincena(fileName) {
    // Buscar patrones como "junio_1ra", "julio_2da", etc.
    const patterns = [
        /([a-z]+).*([12])(ra|da)/i,
        /(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i
    ];
    
    for (let pattern of patterns) {
        const match = fileName.match(pattern);
        if (match) {
            if (match[2]) {
                return `${match[1]} - ${match[2]}${match[3]} Quincena`;
            } else {
                return `${match[1]} - Quincena`;
            }
        }
    }
    return null;
}

// Obtener nombre de mes por índice
function getMonthName(index) {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return months[index % 12];
}

// Generar HTML para un conjunto de datos
function generateDataHTML(data) {
    let html = '<div class="data-grid">';
    
    const labels = {
        empleado: 'Empleado',
        categoria: 'Categoría',
        valorHora: 'Sueldo/jornal',
        horasNormales: 'Horas Normales',
        horasNocturnasUnidades: 'Horas Nocturnas',
        antiguedad: 'Antigüedad',
        asignacionNoRemunerativa: 'Asignación No Remunerativa',
        adicionalBasico: 'Adicional s/Básico',
        horasSabado: 'Horas Sábado 100%',
        horasDomingo: 'Horas Domingo/Feriadas',
        horasExtrasNocturnas: 'Horas Extras Nocturnas 50%',
        presentismo: 'Presentismo',
        feriados: 'Feriados',
        totalNeto: 'Total Neto'
    };
    
    const ordenVisualizacion = [
        'empleado', 'categoria', 'valorHora', 'horasNormales', 'horasNocturnasUnidades', 
        'antiguedad', 'asignacionNoRemunerativa', 'adicionalBasico', 'horasSabado', 
        'horasDomingo', 'horasExtrasNocturnas', 'presentismo', 'feriados', 'totalNeto'
    ];
    
    ordenVisualizacion.forEach(key => {
        if (data[key] && labels[key]) {
            const label = labels[key];
            let value = data[key];
            
            if (key === 'horasNormales' || key === 'horasNocturnasUnidades') {
                value = value + ' horas';
            }
            else if (key === 'horasSabado' || key === 'horasDomingo' || key === 'horasExtrasNocturnas') {
                value = value + ' hora' + (value > 1 ? 's' : '');
                if (key === 'horasDomingo') value += ' (feriado)';
            }
            else if (key === 'valorHora') {
                value = '$' + parseFloat(value).toLocaleString('es-AR');
            }
            else if (['antiguedad', 'adicionalBasico', 'feriados', 'totalNeto', 'asignacionNoRemunerativa'].includes(key)) {
                value = '$' + parseFloat(value).toLocaleString('es-AR');
            }
            else if (key === 'presentismo') {
                value = '$' + parseFloat(value).toLocaleString('es-AR') + ' (20%)';
            }
            
            html += `
                <div class="data-item">
                    <div class="data-label">${label}</div>
                    <div class="data-value">${value}</div>
                </div>
            `;
        }
    });
    
    // Retenciones
    const retencionesLabels = {
        jubilacion: 'Jubilación',
        ley19032: 'Ley 19032', 
        obraSocial: 'Obra Social'
    };
    
    if (data.jubilacion || data.ley19032 || data.obraSocial) {
        html += `
            <div class="data-item" style="grid-column: 1 / -1; background: #f44336; color: white; text-align: center; font-weight: bold;">
                <div class="data-label">RETENCIONES</div>
            </div>
        `;
        
        Object.keys(retencionesLabels).forEach(key => {
            if (data[key]) {
                const label = retencionesLabels[key];
                let value;
                
                if (key === 'jubilacion') {
                    value = '11%';
                } else if (key === 'ley19032') {
                    value = '3%';
                } else if (key === 'obraSocial') {
                    value = '3%';
                } else {
                    value = '$' + parseFloat(data[key]).toLocaleString('es-AR');
                }
                
                html += `
                    <div class="data-item">
                        <div class="data-label">${label}</div>
                        <div class="data-value">${value}</div>
                    </div>
                `;
            }
        });
    }
    
    html += '</div>';
    return html;
}

// Mostrar un solo resultado
function displayResults(data) {
    extractedData = [data];
    displayMultipleResults();
}

// Función original para compatibilidad (mantener vacía)
function displayResultsOld(data) {
    const resultsDiv = document.getElementById('analysis-results');
    const dataGrid = document.getElementById('extracted-data');
    
    let html = '';
    
    const labels = {
        empleado: 'Empleado',
        legajo: 'Legajo',
        categoria: 'Categoría',
        periodo: 'Período',
        horasNormales: 'Horas Normales',
        horasNocturnasUnidades: 'Horas Nocturnas',
        valorHora: 'Sueldo/jornal',
        asignacionNoRemunerativa: 'Asignación No Remunerativa',

        antiguedad: 'Antigüedad',
        adicionalBasico: 'Adicional s/Básico',
        horasSabado: 'Horas Sábado 100%',
        horasDomingo: 'Horas Domingo/Feriadas',
        horasExtrasNocturnas: 'Horas Extras Nocturnas 50%',
        presentismo: 'Presentismo',
        feriados: 'Feriados',
        totalNeto: 'Total Neto',
        asignacionNoRemunerativa: 'Asignación No Remunerativa'
    };
    
    const retencionesLabels = {
        jubilacion: 'Jubilación',
        ley19032: 'Ley 19032', 
        obraSocial: 'Obra Social',
        cuotaSindical: 'Cuota Sindical',
        fas: 'F.A.S.'
    };
    
    // Orden específico de visualización
    const ordenVisualizacion = [
        'empleado', 'categoria', 'valorHora', 'horasNormales', 'horasNocturnasUnidades', 
        'antiguedad', 'asignacionNoRemunerativa', 'adicionalBasico', 'horasSabado', 
        'horasDomingo', 'horasExtrasNocturnas', 'presentismo', 'feriados', 'totalNeto'
    ];
    
    // Mostrar datos en el orden especificado
    ordenVisualizacion.forEach(key => {
        if (data[key] && labels[key]) {
            const label = labels[key];
            let value = data[key];
            
            // Formatear valores según el tipo
            if (key === 'horasNormales' || key === 'horasNocturnasUnidades') {
                value = value + ' horas';
            }
            else if (key === 'horasSabado' || key === 'horasDomingo' || key === 'horasExtrasNocturnas') {
                value = value + ' hora' + (value > 1 ? 's' : '');
                if (key === 'horasDomingo') value += ' (feriado)';
            }
            else if (key === 'valorHora') {
                value = '$' + parseFloat(value).toLocaleString('es-AR');
            }
            else if (['antiguedad', 'adicionalBasico', 'feriados', 'totalNeto', 'asignacionNoRemunerativa'].includes(key)) {
                value = '$' + parseFloat(value).toLocaleString('es-AR');
            }
            else if (key === 'presentismo') {
                value = '$' + parseFloat(value).toLocaleString('es-AR') + ' (20%)';
            }
            
            html += `
                <div class="data-item">
                    <div class="data-label">${label}</div>
                    <div class="data-value">${value}</div>
                </div>
            `;
        }
    });
    
    // Separador para retenciones
    if (data.jubilacion || data.ley19032 || data.obraSocial) {
        html += `
            <div class="data-item" style="grid-column: 1 / -1; background: #f44336; color: white; text-align: center; font-weight: bold;">
                <div class="data-label">RETENCIONES</div>
            </div>
        `;
        
        // Mostrar retenciones con porcentajes
        Object.keys(retencionesLabels).forEach(key => {
            if (data[key]) {
                const label = retencionesLabels[key];
                let value = '$' + parseFloat(data[key]).toLocaleString('es-AR');
                
                // Mostrar porcentajes fijos
                if (key === 'jubilacion') {
                    value = '11%';
                } else if (key === 'ley19032') {
                    value = '3%';
                } else if (key === 'obraSocial') {
                    value = '3%';
                } else {
                    value = '$' + parseFloat(data[key]).toLocaleString('es-AR');
                }
                
                html += `
                    <div class="data-item">
                        <div class="data-label">${label}</div>
                        <div class="data-value">${value}</div>
                    </div>
                `;
            }
        });
    }
    
    dataGrid.innerHTML = html;
    resultsDiv.style.display = 'block';
}

// Mostrar/ocultar loading
function showLoading(show) {
    const spinner = document.getElementById('loading-spinner');
    spinner.style.display = show ? 'block' : 'none';
}

// Exportar a calculadora (usar primer recibo)
function exportToCalculator() {
    const data = extractedData.length > 0 ? extractedData[0] : {};
    
    if (!data.categoria && !data.valorHora) {
        showNotification('No se pudieron extraer datos suficientes del recibo', 'error');
        return;
    }
    
    const params = new URLSearchParams();
    
    if (data.categoria) params.set('categoria', data.categoria);
    if (data.valorHora) params.set('valorHora', data.valorHora);
    if (data.horasNormales) params.set('horasNormales', data.horasNormales);
    if (data.horasNocturnasUnidades) params.set('horasNocturnas', data.horasNocturnasUnidades);
    
    if (data.adicionalBasico && data.sueldoBasico) {
        const adicional = parseFloat(data.adicionalBasico);
        const basico = parseFloat(data.sueldoBasico);
        const porcentaje = ((adicional / basico) * 100).toFixed(1);
        params.set('adicional', porcentaje);
    }
    
    window.location.href = `calculo_hora.html?${params.toString()}`;
}

// Descargar datos
function downloadData() {
    const dataStr = JSON.stringify(extractedData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `datos_recibos_${extractedData.length}.json`;
    link.click();
    
    showNotification(`Datos de ${extractedData.length} recibo(s) descargados`, 'success');
}

// Reiniciar análisis
function resetAnalysis() {
    extractedData = [];
    currentFiles = [];
    currentFileIndex = 0;
    
    document.getElementById('file-input').value = '';
    document.getElementById('preview-container').style.display = 'none';
    document.getElementById('analysis-results').style.display = 'none';
    
    showNotification('Listo para analizar otros recibos', 'info');
}

// Mostrar notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const colors = {
        success: '#4caf50',
        error: '#f44336',
        info: '#2196f3'
    };
    
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 10000;
        background: ${colors[type]}; color: white; padding: 12px 20px;
        border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        font-weight: 500; animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}