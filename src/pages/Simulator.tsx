import { useState } from 'react';
import { Target, Zap, Search, Code, Cpu, MessageSquare, Briefcase, FileText } from 'lucide-react';
import './Simulator.css';

const SCENARIOS = [
  {
    id: 1,
    task: "Necesito analizar un PDF legal de 300 páginas y extraer todas las cláusulas de rescisión.",
    tags: ["Análisis de Documentos", "Contexto Largo", "Precisión"],
    options: [
      { id: 'gpt4', name: 'GPT-4o', icon: <MessageSquare size={20} /> },
      { id: 'claude3', name: 'Claude 3.5 Sonnet', icon: <Briefcase size={20} /> },
      { id: 'gemini15', name: 'Gemini 1.5 Pro', icon: <FileText size={20} /> }
    ],
    bestId: 'gemini15',
    explanation: "Gemini 1.5 Pro (o Claude 3.5 Sonnet) son ideales aquí por su inmensa ventana de contexto (hasta 2M tokens en Gemini). Para 300 páginas (aprox. 150k tokens), Gemini es excepcional procesando documentos largos completos sin perder precisión."
  },
  {
    id: 2,
    task: "Necesito programar un script complejo en Python para automatizar mi servidor.",
    tags: ["Programación", "Lógica", "Automatización"],
    options: [
      { id: 'gpt4', name: 'GPT-4o', icon: <MessageSquare size={20} /> },
      { id: 'claude3', name: 'Claude 3.5 Sonnet', icon: <Code size={20} /> },
      { id: 'llama3', name: 'Llama 3 70B', icon: <Cpu size={20} /> }
    ],
    bestId: 'claude3',
    explanation: "Claude 3.5 Sonnet es considerado actualmente el rey indiscutible de la programación. Escribe código más robusto, requiere menos iteraciones para corregir errores y entiende arquitecturas complejas mejor que GPT-4o."
  }
];

const Simulator = () => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (id: string) => {
    if (showResult) return;
    setSelectedModel(id);
    setShowResult(true);
  };

  const nextScenario = () => {
    if (currentScenario < SCENARIOS.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedModel(null);
      setShowResult(false);
    } else {
      // End of simulator
      setCurrentScenario(0);
      setSelectedModel(null);
      setShowResult(false);
    }
  };

  const scenario = SCENARIOS[currentScenario];

  return (
    <div className="simulator-container fade-in">
      <header className="simulator-header">
        <h1>Simulador de Selección de IA</h1>
        <p className="subtitle">Elige el mejor modelo para cada caso real de uso profesional.</p>
      </header>

      <div className="scenario-board glass-panel">
        <div className="scenario-badge">
          <Target size={16} /> Caso {currentScenario + 1} de {SCENARIOS.length}
        </div>
        
        <h2 className="scenario-task">"{scenario.task}"</h2>
        
        <div className="scenario-tags">
          {scenario.tags.map(t => <span key={t} className="tag">{t}</span>)}
        </div>

        <div className="models-grid">
          {scenario.options.map(opt => {
            let btnClass = 'model-btn';
            if (showResult) {
              if (opt.id === scenario.bestId) btnClass += ' best';
              else if (opt.id === selectedModel) btnClass += ' wrong';
              else btnClass += ' disabled';
            } else if (opt.id === selectedModel) {
              btnClass += ' selected';
            }

            return (
              <button 
                key={opt.id} 
                className={btnClass}
                onClick={() => handleSelect(opt.id)}
                disabled={showResult}
              >
                {opt.icon}
                <span>{opt.name}</span>
                {showResult && opt.id === scenario.bestId && <Zap className="best-icon" size={16} />}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className={`result-explanation fade-in ${selectedModel === scenario.bestId ? 'success' : 'warning'}`}>
            <h3>{selectedModel === scenario.bestId ? '¡Elección Óptima!' : 'Elección Subóptima'}</h3>
            <p>{scenario.explanation}</p>
            <button className="btn btn-primary mt-4" onClick={nextScenario}>
              Siguiente Caso
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Simulator;
