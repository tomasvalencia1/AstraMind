import { useNavigate } from 'react-router-dom';
import { Lock, CheckCircle, Trophy, Zap } from 'lucide-react';
import { levels } from '../data/levels';
import { useProgressStore } from '../stores/progressStore';

export default function HomePage() {
  const navigate = useNavigate();
  const { totalXP, completedModules } = useProgressStore();

  const getModuleStatus = (module: (typeof levels)[0]['modules'][0]) => {
    if (completedModules.includes(module.id)) return 'completed';
    if (module.locked) return 'locked';
    return 'available';
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-1">AstraMind</h1>
            <p className="text-gray-400">Domina la inteligencia artificial</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#13131a] border border-white/5 rounded-xl px-4 py-2.5">
              <Trophy size={18} className="text-amber-400" />
              <span className="font-semibold">{completedModules.length} módulos</span>
            </div>
            <div className="flex items-center gap-2 bg-[#13131a] border border-white/5 rounded-xl px-4 py-2.5">
              <Zap size={18} className="text-amber-400" />
              <span className="font-semibold">{totalXP} XP</span>
            </div>
          </div>
        </div>

        {/* Levels */}
        <div className="space-y-12">
          {levels.map((level, levelIndex) => (
            <div key={level.id}>
              {/* Level Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="relative">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      levelIndex === 0 ? 'bg-[#6366f1]' : 'bg-gray-700'
                    }`}
                  />
                  {levelIndex < levels.length - 1 && (
                    <div className="absolute top-4 left-1.5 w-0.5 h-full bg-gray-800" />
                  )}
                </div>
                <div className="pb-8">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${
                      levelIndex === 0
                        ? 'bg-[#6366f1]/20 text-[#818cf8]'
                        : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {level.id.toUpperCase().replace('-', ' ')}
                  </span>
                  <h2 className="text-2xl font-bold mb-1">{level.name}</h2>
                  <p className="text-gray-400">{level.description}</p>
                </div>
              </div>

              {/* Modules Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-8">
                {level.modules.map((module) => {
                  const status = getModuleStatus(module);

                  return (
                    <button
                      key={module.id}
                      onClick={() => {
                        if (!module.locked) {
                          navigate(`/module/${module.id}`);
                        }
                      }}
                      disabled={module.locked}
                      className={`relative text-left p-6 rounded-2xl border transition-all duration-200 ${
                        status === 'locked'
                          ? 'bg-[#13131a]/50 border-white/5 opacity-60 cursor-not-allowed'
                          : status === 'completed'
                          ? 'bg-[#13131a] border-emerald-500/30 hover:border-emerald-500/50'
                          : 'bg-[#13131a] border-white/10 hover:border-[#6366f1]/50 hover:bg-[#1a1a25]'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                            status === 'locked'
                              ? 'bg-gray-800'
                              : status === 'completed'
                              ? 'bg-emerald-500/20'
                              : 'bg-[#6366f1]/20'
                          }`}
                        >
                          {status === 'locked' ? (
                            <Lock size={20} className="text-gray-500" />
                          ) : status === 'completed' ? (
                            <CheckCircle size={20} className="text-emerald-400" />
                          ) : (
                            <Zap size={20} className="text-[#818cf8]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold mb-1 text-sm leading-tight">
                            {module.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs font-medium">
                              +{module.xp} XP
                            </span>
                            <span className="px-2 py-0.5 bg-gray-800 text-gray-400 rounded text-xs">
                              {module.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
