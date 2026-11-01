# Sistema de Cálculo de Sueldos

Un sistema web completo para calcular salarios basado en diferentes modalidades de trabajo, categorías laborales y antigüedad.

## 🚀 Características

### Cálculo por Horas
- Selección de categoría laboral (A-H)
- Cálculo automático según mes y convenio vigente
- Opción de ingreso manual de valor hora
- Cálculo de antigüedad automático
- Diferentes tipos de horas:
  - Horas normales
  - Horas nocturnas
  - Horas de sábado (100% y 50%)
  - Horas de feriado
  - Adicional sobre básico
- Cálculo de presentismo configurable

### Cálculo por Día
- Carga de días trabajados por turno para estimar automáticamente horas y salario
- Distribución automática de horas normales, nocturnas y extras de sábado/domingo
- Configuración de categoría, mes, antigüedad y presentismo

### Control de Asistencia
- Registro de asistencia diaria
- Control de horarios por turno (mañana, tarde, noche)
- Cálculo automático de tardanzas
- Gestión de horas extras
- Calendario interactivo
- Cálculo de quincenas
- Manejo de feriados

### Calculadora de Adicional sobre Básico
- Cálculo de porcentajes de adicional sobre el sueldo básico
- Comparación entre dos valores básicos (opcional)
- Fórmula transparente de cálculo

## 📁 Estructura del Proyecto

```
Calcular sueldo/
├── index.html              # Página principal
├── calculo_hora.html        # Cálculo por horas
├── calcular_por_dia.html    # Estimación ingresando días por turno
├── calcular_dia.html        # Control de asistencia
├── calculadora_adicional.html # Calculadora de adicional
├── calcular_calendario.html  # Cálculo por calendario
├── style.css               # Estilos principales
├── script.js               # Script principal (cálculo por día)
├── script_hora.js          # Script para cálculo por horas
├── script_calendario.js    # Script para cálculo por calendario
├── calcular_por_dia.js     # Conversión de días trabajados a horas
├── salary-data.js          # Tablas salariales y adicionales compartidas
├── salary-calculator.js    # Fórmula salarial compartida
├── utils.js                # Utilidades comunes
└── README.md               # Este archivo
```

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Estilos modernos con Flexbox y Grid
- **JavaScript ES6+**: Lógica de aplicación
- **LocalStorage**: Persistencia de datos local

## 📋 Funcionalidades Técnicas

### Almacenamiento Local
- Los datos se guardan automáticamente en el navegador
- No se requiere servidor ni base de datos
- Persistencia entre sesiones

### Responsive Design
- Adaptable a dispositivos móviles
- Interfaz optimizada para tablets
- Experiencia consistente en desktop

### Validaciones
- Validación de entrada de datos
- Prevención de errores de cálculo
- Mensajes informativos para el usuario

## 🎯 Cómo Usar

### Cálculo por Horas
1. Selecciona tu categoría laboral
2. Elige el mes correspondiente
3. (Opcional) Ingresa un valor hora manual
4. Selecciona tus años de antigüedad
5. Ingresa las horas trabajadas por tipo
6. Configura el presentismo
7. El sistema calculará automáticamente tu salario

### Cálculo por Día
1. Selecciona categoría, mes, antigüedad y presentismo
2. Ingresa la cantidad de días de lunes a viernes por cada turno
3. Completa los días de sábado por mañana/tarde y domingos por noche
4. El cálculo de horas y salario se actualiza automáticamente

### Control de Asistencia
1. Selecciona el turno trabajado
2. Indica si fichaste temprano o tarde
3. Ingresa categoría, antigüedad y horas extras
4. El sistema registra el día y calcula las quincenas

### Calculadora de Adicional
1. Ingresa el sueldo básico y el porcentaje adicional
2. (Opcional) Agrega otro valor básico para comparar
3. El sistema calculará el monto del adicional automáticamente

## 🔧 Configuración

### Valores Salariales
Los valores salariales se mantienen centralizados en `salary-data.js` y son compartidos por las calculadoras:
- Valor hora por categoría, de enero de 2025 a diciembre de 2026
- Bonificación por antigüedad y suma no remunerativa por mes
- En diciembre de 2026, los $132.000 diferidos se muestran aparte porque pueden abonarse durante los primeros cinco días hábiles de enero de 2027

### Personalización
Para modificar valores:
1. Edita las tablas en `salary-data.js`
2. Actualiza las tablas según el convenio vigente
3. Los cambios se aplicarán automáticamente

Las pruebas de tabla y cálculo del calendario se ejecutan con `node test_calendario.js`.

## 📱 Compatibilidad

- ✅ Chrome 70+
- ✅ Firefox 65+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Dispositivos móviles iOS/Android

## 🐛 Solución de Problemas

### Los datos no se guardan
- Verifica que el navegador permita LocalStorage
- Comprueba que no estés en modo incógnito

### Cálculos incorrectos
- Revisa que los valores de entrada sean correctos
- Verifica que la categoría y mes estén seleccionados

### Problemas de visualización
- Actualiza el navegador
- Limpia la caché del navegador
- Verifica que JavaScript esté habilitado

## 🔄 Actualizaciones

### Versión Actual: 2.0
- ✅ Refactorización completa del código
- ✅ Mejora de la interfaz de usuario
- ✅ Documentación completa
- ✅ Optimización de rendimiento
- ✅ Responsive design mejorado

### Próximas Funcionalidades
- 🔄 Exportación a PDF
- 🔄 Backup en la nube
- 🔄 Calculadora de aguinaldo
- 🔄 Historial de cálculos
- 🔄 Modo oscuro

## 📞 Soporte

Para reportar errores o sugerir mejoras:
1. Documenta el problema detalladamente
2. Incluye pasos para reproducir el error
3. Especifica navegador y versión utilizada

## 📄 Licencia

Este proyecto es de uso libre para fines educativos y personales.

## 👨‍💻 Desarrollo

Desarrollado con ❤️ por tu asistente IA.

### Contribuir
1. Mantén la estructura de archivos existente
2. Documenta cualquier cambio importante
3. Prueba en múltiples navegadores
4. Sigue las convenciones de código establecidas

---

**Nota**: Este sistema está diseñado para ser utilizado como herramienta de cálculo personal. Los valores y fórmulas deben ser verificados con la normativa laboral vigente.