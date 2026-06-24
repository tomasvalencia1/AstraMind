// ============================================================
// INSTRUCCIONES DE INTEGRACIÓN
// ============================================================
// 1. Reemplaza src/data/levels.ts (o levels.ts en raíz) con este archivo.
// 2. Asegúrate de que tu tipo Level e interfaces admitan:
//    - option.description: string  (descripción educativa de cada opción)
//    - question.explanation: string (por qué la respuesta correcta es correcta)
//    - question.wrongExplanation: string (por qué las otras opciones son incorrectas)
// 3. En tu ModulePage.tsx actualizado se usan todos estos campos.
// ============================================================

export interface QuizOption {
  label: string;
  text: string;
  description: string; // NUEVO: explica qué es esta técnica/opción
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
  correctOption: string; // label de la opción correcta ("A", "B", "C")
  explanation: string;      // NUEVO: por qué la respuesta correcta es la mejor
  wrongExplanation: string; // NUEVO: qué tienen de malo las demás opciones
}

export interface Module {
  id: string;
  title: string;
  description: string;
  xp: number;
  type: 'Práctica' | 'Teoría';
  locked: boolean;
  completed: boolean;
  levelId: string;
  quiz?: QuizQuestion[];
}

export interface Level {
  id: string;
  name: string;
  description: string;
  modules: Module[];
}

export const levels: Level[] = [
  {
    id: 'nivel-1',
    name: 'Principiante',
    description: 'Fundamentos de los modelos de lenguaje y prompt engineering básico.',
    modules: [
      {
        id: 'mod-1',
        title: 'Módulo 1: Práctica: Resolución de Bugs',
        description: 'Aprende a identificar y corregir errores en código utilizando modelos de lenguaje.',
        xp: 120,
        type: 'Práctica',
        locked: false,
        completed: false,
        levelId: 'nivel-1',
        quiz: [
          {
            question:
              'Estás trabajando en una tarea de Resolución de Bugs en nivel Principiante. ¿Cuál es la mejor estrategia de Prompt Engineering a utilizar?',
            options: [
              {
                label: 'A',
                text: 'Chain of Thought (Paso a paso)',
                description:
                  'Le pides al modelo que razone el problema en pasos secuenciales: primero identifica el bug, luego analiza la causa, y finalmente propone la solución. Esto imita cómo un programador experimentado piensa en voz alta.',
              },
              {
                label: 'B',
                text: 'Zero-Shot prompting',
                description:
                  'Le das una instrucción directa al modelo sin ejemplos ni contexto adicional, esperando que resuelva el problema solo con su conocimiento previo. Simple, pero puede generar respuestas vagas o incorrectas para problemas complejos.',
              },
              {
                label: 'C',
                text: 'Ignorar las restricciones del sistema',
                description:
                  'Intentar "romper" o saltarse las reglas de seguridad del modelo. Esto no es una técnica de prompting válida y generalmente produce errores, bloqueos o resultados inútiles.',
              },
            ],
            correctOption: 'A',
            explanation:
              'Chain of Thought es ideal para depurar código porque descompone el problema en pasos lógicos. Al pedirle al modelo que "piense paso a paso", se reduce la probabilidad de alucinaciones y se obtiene un razonamiento trazable: el modelo identifica la línea del error → entiende qué debería hacer el código → detecta la discrepancia → sugiere la corrección.',
            wrongExplanation:
              'Zero-Shot puede funcionar para bugs simples, pero falla ante errores de lógica complejos porque el modelo no estructura su razonamiento. Ignorar restricciones del sistema nunca es una estrategia válida: las restricciones existen para garantizar respuestas útiles y seguras.',
          },
          {
            question:
              'Al pedirle a un LLM que corrija un bug, ¿qué información es MÁS importante incluir en tu prompt?',
            options: [
              {
                label: 'A',
                text: 'Solo el mensaje de error',
                description:
                  'Únicamente pegas el error que ves en la consola (ej: "TypeError: Cannot read property of undefined"). El modelo no sabe qué hace tu código ni el contexto del error.',
              },
              {
                label: 'B',
                text: 'El código completo, el error exacto y qué se esperaba que hiciera',
                description:
                  'Proporcionas el fragmento de código relevante, el mensaje de error exacto, y explicas cuál era el comportamiento esperado vs. el comportamiento actual. Esto le da al modelo todo el contexto que necesita.',
              },
              {
                label: 'C',
                text: 'Una descripción general del proyecto',
                description:
                  'Explicas a grandes rasgos para qué sirve tu aplicación (ej: "es una app de e-commerce en React"). Sin el código ni el error, el modelo solo puede dar consejos genéricos.',
              },
            ],
            correctOption: 'B',
            explanation:
              'Los LLMs necesitan contexto específico para depurar. Con el código + error + comportamiento esperado, el modelo puede: (1) ver exactamente dónde está el problema, (2) entender qué debería ocurrir, (3) proponer una solución precisa y justificada. Es el equivalente a mostrarle el paciente al médico en lugar de solo describirlo.',
            wrongExplanation:
              'Solo el mensaje de error obliga al modelo a adivinar el contexto, produciendo soluciones genéricas. Solo la descripción del proyecto es aún más vaga: el modelo ni siquiera sabe en qué lenguaje está el código ni dónde falla.',
          },
          {
            question:
              'Tu código tiene un bug difícil de encontrar. ¿Qué técnica de prompting te ayudaría a localizarlo más fácilmente?',
            options: [
              {
                label: 'A',
                text: 'Pedir al modelo que adivine el bug sin ver el código',
                description:
                  'Le preguntas al modelo "¿cuáles son los bugs más comunes en Python?" sin compartir tu código. Obtendrás una lista genérica que quizás no tenga nada que ver con tu problema real.',
              },
              {
                label: 'B',
                text: 'Few-Shot con ejemplos de bugs similares',
                description:
                  'Le muestras al modelo 2-3 ejemplos de bugs parecidos que YA tienen solución, y luego le presentas tu caso nuevo. El modelo aprende el patrón de razonamiento de los ejemplos y lo aplica al tuyo.',
              },
              {
                label: 'C',
                text: 'Pedirle que reescriba todo el código desde cero',
                description:
                  'Le pides al modelo que ignore tu código existente y escriba uno nuevo. Puede funcionar para código muy simple, pero pierdes el contexto de tu lógica de negocio y probablemente introduces nuevos bugs.',
              },
            ],
            correctOption: 'B',
            explanation:
              'Few-Shot prompting es muy efectivo para bugs porque "calibra" al modelo con tu tipo de problema. Por ejemplo: "Bug 1: [código con null pointer] → Solución: verificar si el objeto existe antes de acceder. Bug 2: [código con índice fuera de rango] → Solución: validar límites del array. Ahora analiza este bug: [tu código]". El modelo reconoce el patrón y aplica el mismo proceso analítico.',
            wrongExplanation:
              'Pedir que adivine sin código es inútil para bugs específicos. Reescribir desde cero es la última opción cuando el código es irrecuperable, pero genera deuda técnica y puede romper funcionalidades que sí estaban bien.',
          },
        ],
      },
      {
        id: 'mod-2',
        title: 'Módulo 2: Práctica: Diseño de APIs',
        description: 'Diseña APIs RESTful eficientes con la ayuda de la IA.',
        xp: 120,
        type: 'Práctica',
        locked: true,
        completed: false,
        levelId: 'nivel-1',
        quiz: [
          {
            question:
              'Necesitas que un LLM te ayude a diseñar los endpoints de una API REST. ¿Cómo deberías formular tu prompt?',
            options: [
              {
                label: 'A',
                text: 'Pedir "diseña una API para mi app" sin más detalles',
                description:
                  'Una instrucción mínima que deja al modelo adivinar el dominio, el tipo de datos, los usuarios, y el propósito. El resultado será genérico y probablemente no sirva para tu caso específico.',
              },
              {
                label: 'B',
                text: 'Especificar recursos, operaciones CRUD, reglas de negocio y formato de respuesta esperado',
                description:
                  'Un prompt detallado que incluye: qué entidades maneja tu sistema (usuarios, productos, órdenes), qué operaciones se necesitan, reglas especiales (ej: "un usuario solo puede tener 3 pedidos activos"), y el formato JSON de respuesta esperado.',
              },
              {
                label: 'C',
                text: 'Pedirle que copie la API de otro servicio famoso',
                description:
                  'Solicitar que imite la estructura de, por ejemplo, la API de Twitter. Puede inspirar buenas prácticas de diseño, pero la estructura de otra app rara vez se adapta exactamente a tus necesidades y podría violar buenas prácticas REST para tu dominio.',
              },
            ],
            correctOption: 'B',
            explanation:
              'Un buen diseño de API requiere contexto completo. Con recursos + operaciones + reglas de negocio + formato esperado, el modelo puede proponer endpoints coherentes, consistentes con REST, y adaptados a tu dominio. Por ejemplo: "Tengo usuarios y pedidos. Un usuario puede crear/ver/cancelar sus pedidos. Un pedido tiene estado: pendiente/enviado/entregado. Responde en formato JSON. Diseña los endpoints REST."',
            wrongExplanation:
              'Sin detalles, el modelo inventará una API genérica que probablemente no cubra tus casos de uso. Copiar otra API puede funcionar como punto de partida, pero mezclará convenciones ajenas con tu dominio y creará confusión.',
          },
          {
            question:
              '¿Qué significa que una API sea "RESTful" y por qué le importa a un LLM cuando la diseña?',
            options: [
              {
                label: 'A',
                text: 'Que la API descansa (no consume muchos recursos del servidor)',
                description:
                  'Una confusión frecuente de quienes empiezan. "REST" no tiene nada que ver con el consumo de recursos del servidor; es un estilo arquitectónico para servicios web.',
              },
              {
                label: 'B',
                text: 'Que sigue los principios de Representational State Transfer: recursos con URLs claras, uso correcto de verbos HTTP y comunicación sin estado',
                description:
                  'REST (Representational State Transfer) es un conjunto de convenciones: URLs que representan recursos (/users/123), verbos HTTP que expresan la acción (GET para leer, POST para crear, PUT/PATCH para actualizar, DELETE para eliminar), y cada request contiene toda la info necesaria (sin sesiones del servidor).',
              },
              {
                label: 'C',
                text: 'Que usa el lenguaje de programación Python',
                description:
                  'REST es un estilo arquitectónico independiente del lenguaje. Una API RESTful puede implementarse en Python, JavaScript, Java, Go, o cualquier otro lenguaje.',
              },
            ],
            correctOption: 'B',
            explanation:
              'Saber que REST implica URLs semánticas + verbos HTTP correctos + sin estado permite prompts más efectivos. Cuando le dices al modelo "diseña una API RESTful para gestionar productos", el modelo sabe que debe usar GET /products, POST /products, PUT /products/:id, DELETE /products/:id, y no inventar convenciones propias.',
            wrongExplanation:
              '"Que descansa" es un malentendido del nombre. "Que usa Python" confunde el lenguaje de implementación con la arquitectura. Estos errores conceptuales llevarían a diseños de API inconsistentes y difíciles de mantener.',
          },
        ],
      },
      {
        id: 'mod-3',
        title: 'Módulo 3: Teoría: Redacción de Correos (Principiante)',
        description: 'Fundamentos de comunicación profesional asistida por IA.',
        xp: 60,
        type: 'Teoría',
        locked: true,
        completed: false,
        levelId: 'nivel-1',
        quiz: [
          {
            question:
              '¿Qué elemento es ESENCIAL incluir en un prompt para que un LLM redacte un correo profesional efectivo?',
            options: [
              {
                label: 'A',
                text: 'Solo el tema del correo',
                description:
                  'Indicar únicamente el asunto (ej: "escribe un correo sobre la reunión"). El modelo no sabe a quién va dirigido, cuál es el tono apropiado, ni qué acción se espera del destinatario.',
              },
              {
                label: 'B',
                text: 'El destinatario, el propósito, el tono deseado y la acción esperada',
                description:
                  'Un contexto completo: ¿a quién escribes? (jefe, cliente, colega), ¿para qué? (solicitar algo, informar, agendar), ¿qué tono? (formal, amigable, urgente), ¿qué debe hacer quien lo lea? (responder, aprobar, asistir). Con esto, el modelo genera un correo directamente utilizable.',
              },
              {
                label: 'C',
                text: 'El número de palabras exacto que debe tener',
                description:
                  'Especificar la extensión sin dar contexto de contenido. Un correo de 200 palabras puede ser igual de inútil si no comunica el mensaje correcto al destinatario correcto.',
              },
            ],
            correctOption: 'B',
            explanation:
              'La comunicación profesional eficaz depende del contexto. Con "destinatario + propósito + tono + acción esperada", el modelo puede calibrar el nivel de formalidad, estructurar el mensaje correctamente (saludo → contexto → solicitud → cierre) y asegurarse de que el correo logre su objetivo.',
            wrongExplanation:
              'Solo el tema produce correos genéricos que probablemente necesitarán mucha edición. Solo la extensión no dice nada sobre el contenido: un correo puede ser largo e inútil, o corto y perfectamente claro.',
          },
        ],
      },
      {
        id: 'mod-4',
        title: 'Módulo 4: Práctica: Análisis de Datos',
        description: 'Utiliza la IA para analizar conjuntos de datos y extraer insights.',
        xp: 120,
        type: 'Práctica',
        locked: true,
        completed: false,
        levelId: 'nivel-1',
        quiz: [
          {
            question:
              'Tienes un CSV con ventas mensuales y quieres que un LLM te ayude a encontrar tendencias. ¿Cuál es el mejor enfoque?',
            options: [
              {
                label: 'A',
                text: 'Pegar todos los datos crudos sin contexto y preguntar "¿qué ves?"',
                description:
                  'Copiar y pegar el contenido completo del CSV sin explicar qué representa cada columna, qué período de tiempo abarca, ni qué tipo de análisis buscas. El modelo tendrá que adivinar el contexto.',
              },
              {
                label: 'B',
                text: 'Describir la estructura de los datos, su contexto de negocio, y hacer preguntas específicas',
                description:
                  'Primero explicas: "Tengo datos de ventas de una tienda de ropa, columnas: fecha, categoría, unidades, ingresos_USD, región. Son 12 meses de 2024." Luego haces preguntas concretas: "¿Qué categoría creció más? ¿Qué región tiene mayor caída en Q4?" Esto guía el análisis.',
              },
              {
                label: 'C',
                text: 'Pedirle que genere datos de ejemplo y los analice',
                description:
                  'En lugar de usar tus datos reales, pides al modelo que invente datos de ventas y los analice él mismo. Esto puede servir para aprender a escribir prompts, pero no te ayuda a entender tus datos reales.',
              },
            ],
            correctOption: 'B',
            explanation:
              'El análisis de datos requiere contexto de negocio. Al describir la estructura + el contexto + hacer preguntas específicas, el modelo puede identificar patrones relevantes, hacer cálculos con las columnas correctas, y presentar hallazgos accionables. Sin contexto, el modelo analiza números sin saber si un aumento es bueno o malo para tu negocio.',
            wrongExplanation:
              'Datos crudos sin contexto producen análisis genérico ("las ventas subieron en marzo") sin interpretación de negocio. Generar datos de ejemplo es útil para practicar prompts, pero no resuelve el problema original de analizar tus propios datos.',
          },
        ],
      },
    ],
  },
  {
    id: 'nivel-2',
    name: 'Intermedio',
    description: 'Técnicas avanzadas de prompting y casos de uso complejos.',
    modules: [
      {
        id: 'mod-5',
        title: 'Módulo 5: Práctica: Optimización de Código',
        description: 'Mejora el rendimiento de tu código con sugerencias de IA.',
        xp: 150,
        type: 'Práctica',
        locked: true,
        completed: false,
        levelId: 'nivel-2',
        quiz: [
          {
            question:
              'Tienes una función Python que procesa un millón de registros y tarda 30 segundos. ¿Cómo usas un LLM para optimizarla?',
            options: [
              {
                label: 'A',
                text: 'Pedir "optimiza este código" sin indicar el cuello de botella',
                description:
                  'Una instrucción vaga que deja al modelo hacer suposiciones. Puede hacer micro-optimizaciones cosméticas (renombrar variables, simplificar condiciones) sin atacar el problema de rendimiento real.',
              },
              {
                label: 'B',
                text: 'Compartir el código, las métricas actuales de rendimiento, el contexto de uso, y pedir optimizaciones con justificación',
                description:
                  'Dices: "Esta función tarda 30s procesando 1M de registros. El cuello de botella según el profiler está en el loop de la línea 15. Los datos son inmutables y el orden no importa. Sugiere optimizaciones con estimación de mejora y explica el trade-off de cada una."',
              },
              {
                label: 'C',
                text: 'Pedir que reescriba la función en otro lenguaje más rápido',
                description:
                  'Solicitar una reescritura en C++ o Rust para ganar velocidad. Puede ser una solución válida en casos extremos, pero introduce complejidad de integración y mantenimiento, y no siempre es necesario si el algoritmo en sí es ineficiente.',
              },
            ],
            correctOption: 'B',
            explanation:
              'La optimización efectiva requiere datos reales de rendimiento. Con código + métricas + contexto de uso + solicitud de justificación, el modelo puede proponer optimizaciones específicas (usar NumPy en lugar de loops, paralelismo, caching, algoritmos más eficientes) y explicar el trade-off de cada una (velocidad vs. memoria, legibilidad vs. rendimiento).',
            wrongExplanation:
              '"Optimiza este código" sin contexto produce mejoras superficiales. Cambiar de lenguaje es el último recurso y puede no resolver el problema si el algoritmo subyacente sigue siendo O(n²).',
          },
        ],
      },
      {
        id: 'mod-6',
        title: 'Módulo 6: Teoría: Prompt Engineering Avanzado',
        description: 'Patrones avanzados para obtener mejores resultados de los LLMs.',
        xp: 80,
        type: 'Teoría',
        locked: true,
        completed: false,
        levelId: 'nivel-2',
        quiz: [
          {
            question:
              '¿Qué es el "hallucination" (alucinación) en un LLM y cómo puedes reducirlo con Prompt Engineering?',
            options: [
              {
                label: 'A',
                text: 'Cuando el modelo escribe código que no compila',
                description:
                  'Un error de código es un fallo técnico, no una alucinación. El código puede estar sintácticamente correcto pero lógicamente incorrecto, o puede compilar pero hacer algo diferente a lo pedido.',
              },
              {
                label: 'B',
                text: 'Cuando el modelo genera información falsa pero presentada con confianza, reducible pidiendo fuentes, razonamiento paso a paso y admisión de incertidumbre',
                description:
                  'Alucinación = el modelo inventa hechos, citas, nombres o estadísticas que suenan convincentes pero son incorrectos. Se reduce con prompts como: "Si no estás seguro, dilo", "Cita tus fuentes", "Razona paso a paso antes de concluir", o "¿Qué probabilidad das a que esta información sea correcta?"',
              },
              {
                label: 'C',
                text: 'Cuando el modelo responde demasiado lento',
                description:
                  'La latencia de respuesta es un problema de infraestructura, no de calidad del contenido generado. Una respuesta lenta puede ser perfectamente correcta; una rápida puede estar llena de alucinaciones.',
              },
            ],
            correctOption: 'B',
            explanation:
              'Las alucinaciones ocurren porque los LLMs optimizan para generar texto plausible, no necesariamente verdadero. Las técnicas para reducirlas incluyen: (1) pedir al modelo que admita incertidumbre ("di \'no sé\' si no tienes información suficiente"), (2) Chain of Thought para que el razonamiento sea verificable, (3) Retrieval Augmented Generation (RAG) que ancla las respuestas en documentos reales, (4) pedir citas específicas que luego puedes verificar.',
            wrongExplanation:
              'Confundir alucinación con errores de código o con latencia refleja una comprensión incorrecta del problema. El mayor riesgo de las alucinaciones es que el modelo suena seguro aunque esté equivocado, lo que hace difícil detectarlas sin verificación externa.',
          },
          {
            question:
              'En Prompt Engineering avanzado, ¿qué es el "System Prompt" y para qué se usa?',
            options: [
              {
                label: 'A',
                text: 'El primer mensaje que escribe el usuario en la conversación',
                description:
                  'El primer mensaje del usuario forma parte de la conversación pero NO es el System Prompt. Son cosas distintas con propósitos distintos.',
              },
              {
                label: 'B',
                text: 'Instrucciones fijas que definen el rol, comportamiento y restricciones del modelo antes de que el usuario interactúe',
                description:
                  'El System Prompt es una capa de configuración previa que el desarrollador o diseñador establece. Ejemplos: "Eres un asistente de soporte técnico de una empresa de software. Solo responde preguntas técnicas. Siempre responde en español. Nunca reveles información confidencial de la empresa." Esto "programa" el comportamiento del modelo para toda la conversación.',
              },
              {
                label: 'C',
                text: 'Un prompt que solo puede escribir el sistema operativo de la computadora',
                description:
                  'No tiene relación con el sistema operativo. El "system" en "System Prompt" se refiere al rol de configuración del sistema de IA, no al OS de tu computadora.',
              },
            ],
            correctOption: 'B',
            explanation:
              'El System Prompt es fundamental para aplicaciones de producción porque establece el comportamiento base del modelo de forma consistente para todos los usuarios. Es donde defines: el rol del asistente, el tono, las restricciones, el formato de respuesta, y el contexto de la aplicación. Separar estas instrucciones del mensaje del usuario permite reutilizarlas y modificarlas sin que el usuario final lo sepa.',
            wrongExplanation:
              'Confundir el System Prompt con el primer mensaje del usuario es un error común que lleva a perder el control sobre el comportamiento del modelo. La confusión con el sistema operativo refleja una interpretación literal incorrecta del término.',
          },
        ],
      },
    ],
  },
];
