// config.js
// Almacena todas las constantes de configuración, como tablas salariales y de antigüedad.
// Facilita la actualización de valores y la adaptación a cambios en las normativas.

const JORNADA_HORAS = 8;
const MINUTOS_TOLERANCIA_TARDE = 15;

const TABLA_SALARIAL = {
    'A': { 
        'Junio': 2750, 'Julio': 2804, 'Agosto': 2858, 'Septiembre': 2912, 'Octubre': 2966, 'Noviembre': 3020,
        'Marzo 2025': 2546, 'Abril 2025': 2583, 'Mayo 2025': 2621, 'Junio 2025': 2658, 'Julio 2025': 2696 
    },
    'B': { 
        'Junio': 2800, 'Julio': 2855, 'Agosto': 2910, 'Septiembre': 2965, 'Octubre': 3020, 'Noviembre': 3074,
        'Marzo 2025': 2593, 'Abril 2025': 2631, 'Mayo 2025': 2669, 'Junio 2025': 2707, 'Julio 2025': 2745 
    },
    'C': { 
        'Junio': 2854, 'Julio': 2910, 'Agosto': 2966, 'Septiembre': 3022, 'Octubre': 3078, 'Noviembre': 3134,
        'Marzo 2025': 2643, 'Abril 2025': 2682, 'Mayo 2025': 2721, 'Junio 2025': 2759, 'Julio 2025': 2798 
    },
    'D': { 
        'Junio': 2905, 'Julio': 2962, 'Agosto': 3019, 'Septiembre': 3076, 'Octubre': 3133, 'Noviembre': 3190,
        'Marzo 2025': 2690, 'Abril 2025': 2729, 'Mayo 2025': 2769, 'Junio 2025': 2808, 'Julio 2025': 2848 
    },
    'E': { 
        'Junio': 2964, 'Julio': 3022, 'Agosto': 3080, 'Septiembre': 3138, 'Octubre': 3197, 'Noviembre': 3255,
        'Marzo 2025': 2745, 'Abril 2025': 2785, 'Mayo 2025': 2826, 'Junio 2025': 2866, 'Julio 2025': 2906 
    },
    'F': { 
        'Junio': 3021, 'Julio': 3080, 'Agosto': 3140, 'Septiembre': 3199, 'Octubre': 3258, 'Noviembre': 3317,
        'Marzo 2025': 2798, 'Abril 2025': 2839, 'Mayo 2025': 2880, 'Junio 2025': 2921, 'Julio 2025': 2962 
    },
    'G': { 
        'Junio': 3115, 'Julio': 3176, 'Agosto': 3237, 'Septiembre': 3298, 'Octubre': 3359, 'Noviembre': 3420,
        'Marzo 2025': 2885, 'Abril 2025': 2927, 'Mayo 2025': 2969, 'Junio 2025': 3012, 'Julio 2025': 3054 
    },
    'H': { 
        'Junio': 3182, 'Julio': 3245, 'Agosto': 3307, 'Septiembre': 3370, 'Octubre': 3432, 'Noviembre': 3494,
        'Marzo 2025': 2947, 'Abril 2025': 2990, 'Mayo 2025': 3033, 'Junio 2025': 3077, 'Julio 2025': 3120 
    }
};

const SUMA_NO_REMUN = {
    'Junio': 210000 + 105000,
    'Julio': 210000,
    'Agosto': 210000,
    'Septiembre': 210000,
    'Octubre': 210000,
    'Noviembre': 210000,
    'Diciembre': 210000,
    'Marzo 2025': 210000,
    'Abril 2025': 210000,
    'Mayo 2025': 210000,
    'Junio 2025': 210000,
    'Julio 2025': 210000
};

const TABLA_ANTIGUEDAD = {
    '1 años': {
        'Junio': 25, 'Julio': 27, 'Agosto': 27, 'Septiembre': 28, 'Octubre': 28, 'Noviembre': 29,
        'Marzo 2025': 25, 'Abril 2025': 25, 'Mayo 2025': 25, 'Junio 2025': 25, 'Julio 2025': 25
    },
    '3 años': {
        'Junio': 37, 'Julio': 39, 'Agosto': 40, 'Septiembre': 41, 'Octubre': 42, 'Noviembre': 43,
        'Marzo 2025': 37, 'Abril 2025': 37, 'Mayo 2025': 37, 'Junio 2025': 37, 'Julio 2025': 37
    },
    '5 años': {
        'Junio': 50, 'Julio': 53, 'Agosto': 54, 'Septiembre': 56, 'Octubre': 57, 'Noviembre': 58,
        'Marzo 2025': 50, 'Abril 2025': 50, 'Mayo 2025': 50, 'Junio 2025': 50, 'Julio 2025': 50
    },
    '7 años': {
        'Junio': 68, 'Julio': 72, 'Agosto': 74, 'Septiembre': 76, 'Octubre': 78, 'Noviembre': 79,
        'Marzo 2025': 68, 'Abril 2025': 68, 'Mayo 2025': 68, 'Junio 2025': 68, 'Julio 2025': 68
    },
    '9 años': {
        'Junio': 81, 'Julio': 86, 'Agosto': 88, 'Septiembre': 91, 'Octubre': 93, 'Noviembre': 95,
        'Marzo 2025': 81, 'Abril 2025': 81, 'Mayo 2025': 81, 'Junio 2025': 81, 'Julio 2025': 81
    },
    '12 años': {
        'Junio': 108, 'Julio': 114, 'Agosto': 117, 'Septiembre': 121, 'Octubre': 124, 'Noviembre': 127,
        'Marzo 2025': 108, 'Abril 2025': 108, 'Mayo 2025': 108, 'Junio 2025': 108, 'Julio 2025': 108
    },
    '15 años': {
        'Junio': 130, 'Julio': 138, 'Agosto': 142, 'Septiembre': 146, 'Octubre': 150, 'Noviembre': 153,
        'Marzo 2025': 130, 'Abril 2025': 130, 'Mayo 2025': 130, 'Junio 2025': 130, 'Julio 2025': 130
    },
    '18 años': {
        'Junio': 152, 'Julio': 161, 'Agosto': 165, 'Septiembre': 170, 'Octubre': 174, 'Noviembre': 178,
        'Marzo 2025': 152, 'Abril 2025': 152, 'Mayo 2025': 152, 'Junio 2025': 152, 'Julio 2025': 152
    },
    '22 años': {
        'Junio': 175, 'Julio': 186, 'Agosto': 190, 'Septiembre': 196, 'Octubre': 200, 'Noviembre': 204,
        'Marzo 2025': 175, 'Abril 2025': 175, 'Mayo 2025': 175, 'Junio 2025': 175, 'Julio 2025': 175
    },
    '26 años': {
        'Junio': 198, 'Julio': 210, 'Agosto': 215, 'Septiembre': 222, 'Octubre': 227, 'Noviembre': 232,
        'Marzo 2025': 198, 'Abril 2025': 198, 'Mayo 2025': 198, 'Junio 2025': 198, 'Julio 2025': 198
    },
    '30 años': {
        'Junio': 217, 'Julio': 230, 'Agosto': 235, 'Septiembre': 243, 'Octubre': 248, 'Noviembre': 253,
        'Marzo 2025': 217, 'Abril 2025': 217, 'Mayo 2025': 217, 'Junio 2025': 217, 'Julio 2025': 217
    },
    '35 años': {
        'Junio': 238, 'Julio': 252, 'Agosto': 258, 'Septiembre': 267, 'Octubre': 273, 'Noviembre': 278,
        'Marzo 2025': 238, 'Abril 2025': 238, 'Mayo 2025': 238, 'Junio 2025': 238, 'Julio 2025': 238
    },
    '40 años': {
        'Junio': 261, 'Julio': 277, 'Agosto': 283, 'Septiembre': 292, 'Octubre': 298, 'Noviembre': 304,
        'Marzo 2025': 261, 'Abril 2025': 261, 'Mayo 2025': 261, 'Junio 2025': 261, 'Julio 2025': 261
    }
};

const HORAS_ESTANDAR_INGRESO = {
    'manana': '06:00',
    'tarde': '14:00',
    'noche': '22:00'
};

const MONTH_NAMES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];