const fs = require('fs');
const path = require('path');

const levels = [
  { id: 'beginner', title: 'Principiante', description: 'Fundamentos de los modelos de lenguaje y prompt engineering básico.', requiredLevel: 1, maxModules: 40 },
  { id: 'intermediate', title: 'Intermedio', description: 'Técnicas avanzadas: Chain of Thought, Few-shot prompting y Control de Formato.', requiredLevel: 5, maxModules: 40 },
  { id: 'advanced', title: 'Avanzado', description: 'Casos de uso profesionales: Programación, Análisis de Datos y RAG básico.', requiredLevel: 10, maxModules: 40 },
  { id: 'professional', title: 'Profesional', description: 'Ingeniería de Contexto, Agentes Simples y Automatización con LLMs.', requiredLevel: 15, maxModules: 40 },
  { id: 'expert', title: 'Experto', description: 'MCP, Function Calling, Fine-Tuning, Multi-Agentes y Evaluación de Modelos.', requiredLevel: 20, maxModules: 40 }
];

const topics = [
  "Redacción de Correos", "Análisis de Datos", "Creación de Contenido", 
  "Programación en Python", "Generación de Ideas", "Resumen de PDFs",
  "Traducción Técnica", "Atención al Cliente", "Estrategia de Marketing",
  "Resolución de Bugs", "Diseño de APIs", "Planificación de Proyectos"
];

const optionsSet = [
  ["Usa un prompt genérico sin contexto", "Añade rol, contexto y formato", "Pídele a la IA que adivine el objetivo"],
  ["Chain of Thought (Paso a paso)", "Zero-Shot prompting", "Ignorar las restricciones del sistema"],
  ["Usar GPT-4o", "Usar Claude 3.5 Sonnet", "Usar un modelo pequeño local"],
  ["Dividir la tarea en prompts más pequeños (Chaining)", "Pedirle todo en un solo prompt enorme", "Usar solo palabras clave"]
];

const data = { levels: [] };

let globalIdCounter = 1;

for (const level of levels) {
  const levelData = {
    id: level.id,
    title: level.title,
    description: level.description,
    requiredLevel: level.requiredLevel,
    modules: []
  };

  for (let i = 0; i < level.maxModules; i++) {
    const isTheory = Math.random() > 0.6; // 40% theory, 60% interactive
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const options = optionsSet[Math.floor(Math.random() * optionsSet.length)];
    
    if (isTheory) {
      levelData.modules.push({
        id: `module-${globalIdCounter}`,
        title: `Teoría: ${topic} (${level.title})`,
        xpReward: 50 + (level.requiredLevel * 10),
        type: 'theory',
        content: `En este módulo aprenderás las bases fundamentales sobre ${topic} usando IA Generativa. La clave en nivel ${level.title} es entender cómo el contexto influye en la calidad del resultado final. Nunca asumas que el modelo sabe lo que estás pensando.`
      });
    } else {
      levelData.modules.push({
        id: `module-${globalIdCounter}`,
        title: `Práctica: ${topic}`,
        xpReward: 100 + (level.requiredLevel * 20),
        type: 'interactive',
        question: `Estás trabajando en una tarea de ${topic} en nivel ${level.title}. ¿Cuál es la mejor estrategia de Prompt Engineering a utilizar?`,
        options: options,
        correctAnswerIndex: 0, // Mocked correct answer is usually index 0 in optionsSet structure (simplified for generation)
        explanation: `Excelente. En nivel ${level.title}, aplicar esta estrategia maximiza la precisión del LLM y minimiza las alucinaciones en tareas de ${topic}.`
      });
    }
    globalIdCounter++;
  }
  
  data.levels.push(levelData);
}

const outputPath = path.join(__dirname, '..', 'src', 'data', 'lessons.json');
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

console.log(`¡Éxito! Se han generado ${globalIdCounter - 1} ejercicios y se han guardado en ${outputPath}`);
