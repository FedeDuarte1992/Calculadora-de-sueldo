const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const context = {
    document: { addEventListener() {}, getElementById() { return null; } },
    console
};
vm.createContext(context);
vm.runInContext(fs.readFileSync('salary-data.js', 'utf8'), context);
vm.runInContext(fs.readFileSync('salary-calculator.js', 'utf8'), context);
vm.runInContext(fs.readFileSync('script_calendario.js', 'utf8'), context);

const rates = JSON.parse(JSON.stringify(vm.runInContext(
    `['A','B','C','D','E','F','G','H'].map(category =>
        ['julio26','agosto26','septiembre26','octubre26','noviembre26','diciembre26']
            .map(month => SALARY_TABLES.hourly[category][month]))`,
    context
)));
assert.deepEqual(rates, [
    [3279, 3328, 3376, 3425, 3489, 3554],
    [3338, 3388, 3437, 3486, 3552, 3618],
    [3403, 3454, 3504, 3554, 3621, 3688],
    [3464, 3515, 3567, 3618, 3686, 3754],
    [3535, 3587, 3640, 3692, 3762, 3831],
    [3602, 3655, 3709, 3762, 3833, 3904],
    [3714, 3769, 3824, 3879, 3952, 4025],
    [3795, 3851, 3907, 3963, 4038, 4113]
]);

const newSeniorityRates = JSON.parse(JSON.stringify(vm.runInContext(
    `[1,3,5,7,9,12,15,18,22,26,30,35,40].map(years =>
        [SALARY_TABLES.seniority[years].agosto26, SALARY_TABLES.seniority[years].octubre26])`,
    context
)));
assert.deepEqual(newSeniorityRates, [
    [32, 33], [46, 48], [63, 66], [85, 89], [102, 107], [135, 142], [164, 172],
    [191, 200], [221, 231], [250, 262], [273, 286], [300, 315], [328, 343]
]);
assert.equal(vm.runInContext('SALARY_TABLES.nonRemunerative.diciembre26', context), 264000);
assert.equal(vm.runInContext('SALARY_TABLES.deferredNonRemunerative.diciembre26', context), 132000);

const result = vm.runInContext(`calcularSalarioCalendario({
    valorHora: 3425,
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
    monthKey: 'octubre26'
})`, context);

assert.equal(result.totalSinRetenciones, 36484.8);
assert.ok(Math.abs(result.totalACobrar - 29187.84) < 1e-8);
assert.equal(result.desglose.antiguedad, 264);

const dailyContext = {
    document: {
        addEventListener() {},
        getElementById() { return {}; }
    },
    localStorage: { getItem() { return null; } },
    console
};
vm.createContext(dailyContext);
vm.runInContext(fs.readFileSync('salary-data.js', 'utf8'), dailyContext);
vm.runInContext(fs.readFileSync('script.js', 'utf8'), dailyContext);
assert.equal(vm.runInContext("getValorHoraBase('A', new Date(2026, 9, 15))", dailyContext), 3425);
assert.equal(vm.runInContext("getBonificacionAntiguedad(1, new Date(2026, 9, 15))", dailyContext), 33);
assert.equal(vm.runInContext("getSumaNoRemunerativa(new Date(2026, 11, 15))", dailyContext), 264000);
const noPresentismo = vm.runInContext(`calcularSalarioCalendario({
    valorHora: 1000,
    horasNormales: 8,
    horasNocturnas: 0,
    horasSabado: 0,
    horasNocturnas50: 0,
    horasNocturnas100: 0,
    horasFeriado: 0,
    horas50: 0,
    presentismo: 0,
    adicionalPorcentaje: 0,
    antiguedadAnios: 0,
    monthKey: 'enero25'
})`, context);
assert.equal(noPresentismo.totalSinRetenciones, 8000);

const dayContext = {
    document: { addEventListener() {}, getElementById() { return {}; } },
    console
};
vm.createContext(dayContext);
vm.runInContext(fs.readFileSync('salary-data.js', 'utf8'), dayContext);
vm.runInContext(fs.readFileSync('salary-calculator.js', 'utf8'), dayContext);
vm.runInContext(fs.readFileSync('calcular_por_dia.js', 'utf8'), dayContext);
const dayHours = JSON.parse(JSON.stringify(vm.runInContext(`calculateWorkedHours([
    { day: 'weekday', shift: 'morning', count: 2 },
    { day: 'weekday', shift: 'afternoon', count: 3 },
    { day: 'weekday', shift: 'night', count: 4 },
    { day: 'saturday', shift: 'morning', count: 5 },
    { day: 'saturday', shift: 'afternoon', count: 6 },
    { day: 'sunday', shift: 'night', count: 7 }
])`, dayContext)));
assert.deepEqual(dayHours, {
    normales: 72,
    nocturnas: 73,
    horasSabado: 47,
    nocturnas50: 4,
    nocturnas100: 20,
    feriado: 0,
    horas50: 0
});
console.log('✅ Pruebas salariales y conversión de días a horas aprobadas');
