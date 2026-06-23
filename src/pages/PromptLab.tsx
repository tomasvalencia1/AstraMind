import { useState } from 'react';
import { Play, AlertCircle, CheckCircle2, SplitSquareHorizontal } from 'lucide-react';
import './PromptLab.css';

const MOCK_MODELS = ['GPT-4o', 'Claude 3.5 Sonnet', 'Gemini 1.5 Pro'];

const PromptLab = () => {
  const [promptInput, setPromptInput] = useState('Escribe un correo para vender zapatos.');
  const [selectedModel, setSelectedModel] = useState(MOCK_MODELS[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const analyzePrompt = () => {
    setIsAnalyzing(true);
    // Simulated analysis logic
    setTimeout(() => {
      const hasContext = promptInput.toLowerCase().includes('actúa como') || promptInput.toLowerCase().includes('eres');
      const hasFormat = promptInput.toLowerCase().includes('formato') || promptInput.toLowerCase().includes('párrafos') || promptInput.toLowerCase().includes('lista');
      
      const score = (hasContext ? 40 : 0) + (hasFormat ? 30 : 0) + (promptInput.length > 20 ? 30 : 10);
      
      setAnalysisResult({
        score,
        hasContext,
        hasFormat,
        output: hasContext && hasFormat 
          ? "¡Excelente! Has dado contexto y formato. El modelo responderá exactamente como esperas, con el tono adecuado y la estructura solicitada." 
          : "Respuesta genérica generada. Como el prompt es muy ambiguo, el modelo tuvo que adivinar el tono, la longitud y el formato del correo, lo que resulta en un texto aburrido y poco efectivo.",
        tips: [
          !hasContext && "Añade un rol (Ej: 'Actúa como un experto en marketing...').",
          !hasFormat && "Especifica la salida (Ej: 'En 3 párrafos usando viñetas...').",
          promptInput.length <= 20 && "Sé más específico sobre el producto y el cliente."
        ].filter(Boolean)
      });
      setIsAnalyzing(false);
    }, 1200);
  };

  return (
    <div className="lab-container fade-in">
      <header className="lab-header">
        <h1>Laboratorio de Prompting</h1>
        <p className="subtitle">Experimenta y descubre por qué unos prompts funcionan mejor que otros.</p>
      </header>

      <div className="lab-workspace">
        <div className="lab-editor glass-panel">
          <div className="editor-toolbar">
            <span className="toolbar-title">Tu Prompt</span>
            <select 
              className="model-selector" 
              value={selectedModel} 
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              {MOCK_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          
          <textarea 
            className="prompt-textarea"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="Escribe tu prompt aquí..."
          />
          
          <div className="editor-footer">
            <button 
              className="btn btn-primary btn-run" 
              onClick={analyzePrompt}
              disabled={isAnalyzing || promptInput.trim().length === 0}
            >
              {isAnalyzing ? 'Analizando...' : <><Play size={18} /> Ejecutar Análisis</>}
            </button>
          </div>
        </div>

        <div className="lab-results glass-panel">
          <div className="results-header">
            <SplitSquareHorizontal size={20} />
            <span>Análisis y Resultado Simulado</span>
          </div>
          
          {!analysisResult && !isAnalyzing && (
            <div className="empty-state">
              <AlertCircle size={48} opacity={0.5} />
              <p>Ejecuta tu prompt para ver el análisis en tiempo real.</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Procesando con {selectedModel}...</p>
            </div>
          )}

          {analysisResult && !isAnalyzing && (
            <div className="analysis-content fade-in">
              <div className="score-ring">
                <div className={`score-circle ${analysisResult.score > 70 ? 'high' : 'low'}`}>
                  <span>{analysisResult.score}</span>
                  <small>Score</small>
                </div>
              </div>

              <div className="analysis-breakdown">
                <div className={`breakdown-item ${analysisResult.hasContext ? 'success' : 'error'}`}>
                  {analysisResult.hasContext ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  <span>Contexto y Rol</span>
                </div>
                <div className={`breakdown-item ${analysisResult.hasFormat ? 'success' : 'error'}`}>
                  {analysisResult.hasFormat ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  <span>Formato y Restricciones</span>
                </div>
              </div>

              <div className="simulated-output">
                <h4>Simulación de Salida:</h4>
                <p>{analysisResult.output}</p>
              </div>

              {analysisResult.tips.length > 0 && (
                <div className="improvement-tips">
                  <h4>💡 Cómo mejorar este prompt:</h4>
                  <ul>
                    {analysisResult.tips.map((tip: string, i: number) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptLab;
