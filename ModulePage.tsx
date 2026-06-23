import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, CheckCircle, Play } from 'lucide-react';
import { levels } from '../data/levels';
import { useProgressStore } from '../stores/progressStore';
import confetti from 'canvas-confetti';

export default function ModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { completeModule, isModuleCompleted, totalXP } = useProgressStore();

  const module = levels.flatMap((l) => l.modules).find((m) => m.id === moduleId);

  if (!module) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Módulo no encontrado</h1>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-[#6366f1] rounded-xl font-semibold hover:bg-[#5558e0] transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const completed = isModuleCompleted(module.id);

  const handleComplete = () => {
    if (!completed) {
      completeModule(module.id, module.xp);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#ec4899', '#f59e0b'],
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>Volver</span>
        </button>

        {/* Module Info */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-[#6366f1]/20 text-[#818cf8] rounded-full text-sm font-medium">
              {module.type}
            </span>
            <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium">
              +{module.xp} XP
            </span>
            {completed && (
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium flex items-center gap-1">
                <CheckCircle size={14} />
                Completado
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold mb-3">{module.title}</h1>
          <p className="text-gray-400 text-lg">{module.description}</p>
        </div>

        {/* Exercise Area */}
        <div className="bg-[#13131a] border border-white/5 rounded-2xl p-8 mb-8">
          {module.locked ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Lock size={28} className="text-gray-500" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Módulo Bloqueado</h2>
              <p className="text-gray-400 max-w-md">
                Completa los módulos anteriores para desbloquear este contenido.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#6366f1] rounded-lg flex items-center justify-center">
                  <Play size={20} className="text-white ml-0.5" />
                </div>
                <h2 className="text-xl font-semibold">Contenido del Ejercicio</h2>
              </div>

              <div className="bg-[#0a0a0f] rounded-xl p-6 mb-6 border border-white/5">
                <p className="text-gray-300 mb-4">
                  Aquí se mostraría el contenido interactivo del ejercicio. Este es un placeholder
                  para demostrar la navegación entre módulos.
                </p>
                <div className="bg-[#1a1a25] rounded-lg p-4 font-mono text-sm text-gray-400">
                  {`// Ejemplo de ejercicio
function solve() {
  // Tu código aquí
}`}
                </div>
              </div>

              {!completed && (
                <button
                  onClick={handleComplete}
                  className="w-full py-4 bg-[#6366f1] hover:bg-[#5558e0] rounded-xl font-semibold text-lg transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  Completar Módulo (+{module.xp} XP)
                </button>
              )}

              {completed && (
                <div className="w-full py-4 bg-emerald-500/20 text-emerald-400 rounded-xl font-semibold text-lg text-center flex items-center justify-center gap-2">
                  <CheckCircle size={20} />
                  Módulo Completado
                </div>
              )}
            </div>
          )}
        </div>

        {/* XP Display */}
        <div className="flex items-center justify-between bg-[#13131a] border border-white/5 rounded-xl px-6 py-4">
          <span className="text-gray-400">XP Total</span>
          <span className="text-xl font-bold text-amber-400">{totalXP} XP</span>
        </div>
      </div>
    </div>
  );
}
