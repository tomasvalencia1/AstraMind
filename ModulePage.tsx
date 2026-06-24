// ============================================================
// INSTRUCCIONES DE INTEGRACIÓN
// ============================================================
// 1. Este archivo reemplaza ModulePage.tsx en la raíz del proyecto
//    (o src/pages/ModulePage.tsx según tu estructura).
// 2. Asegúrate de que el import de levels apunte al archivo correcto.
// 3. Dependencias requeridas: canvas-confetti, react-router-dom, lucide-react.
//    Todas ya están en tu proyecto original.
// 4. El tipo QuizQuestion ahora incluye:
//    - options[].description (descripción educativa de cada opción)
//    - explanation (por qué la respuesta correcta es la correcta)
//    - wrongExplanation (por qué las otras opciones son incorrectas)
// ============================================================

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Lock,
  CheckCircle,
  Play,
  ChevronRight,
  RotateCcw,
  BookOpen,
  XCircle,
  Lightbulb,
  Trophy,
  AlertCircle,
} from 'lucide-react';
import { levels } from '../data/levels';
import { useProgressStore } from '../stores/progressStore';
import confetti from 'canvas-confetti';

// ─────────────────────────────────────────────────────────────
// Tipos locales (en tu proyecto pueden venir de un types.ts)
// ─────────────────────────────────────────────────────────────
interface QuizOption {
  label: string;
  text: string;
  description: string;
}

interface QuizQuestion {
  question: string;
  options: QuizOption[];
  correctOption: string;
  explanation: string;
  wrongExplanation: string;
}

// ─────────────────────────────────────────────────────────────
// Subcomponente: tarjeta de resultado por pregunta
// ─────────────────────────────────────────────────────────────
interface QuestionFeedbackProps {
  question: QuizQuestion;
  selectedLabel: string;
  questionIndex: number;
}

function QuestionFeedback({ question, selectedLabel, questionIndex }: QuestionFeedbackProps) {
  const isCorrect = selectedLabel === question.correctOption;
  const selectedOption = question.options.find((o) => o.label === selectedLabel);
  const correctOption = question.options.find((o) => o.label === question.correctOption);

  return (
    <div
      className={`rounded-xl border p-5 mb-4 ${
        isCorrect
          ? 'border-emerald-500/30 bg-emerald-500/5'
          : 'border-red-500/30 bg-red-500/5'
      }`}
    >
      {/* Encabezado */}
      <div className="flex items-start gap-3 mb-3">
        {isCorrect ? (
          <CheckCircle size={20} className="text-emerald-400 mt-0.5 shrink-0" />
        ) : (
          <XCircle size={20} className="text-red-400 mt-0.5 shrink-0" />
        )}
        <p className="text-sm font-medium text-gray-200">
          Pregunta {questionIndex + 1}: {question.question}
        </p>
      </div>

      {/* Tu respuesta */}
      <div className="ml-7 space-y-2 text-sm">
        <div>
          <span className="text-gray-500">Tu respuesta: </span>
          <span
            className={`font-semibold ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}
          >
            {selectedOption?.label}. {selectedOption?.text}
          </span>
        </div>

        {/* Respuesta correcta (solo si falló) */}
        {!isCorrect && (
          <div>
            <span className="text-gray-500">Respuesta correcta: </span>
            <span className="font-semibold text-emerald-400">
              {correctOption?.label}. {correctOption?.text}
            </span>
          </div>
        )}

        {/* Explicación de la respuesta correcta */}
        <div className="mt-3 bg-[#0a0a0f] rounded-lg p-3 border border-white/5">
          <div className="flex items-start gap-2">
            <Lightbulb size={15} className="text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-amber-400 font-semibold text-xs mb-1">¿Por qué es correcta?</p>
              <p className="text-gray-300 text-xs leading-relaxed">{question.explanation}</p>
            </div>
          </div>
        </div>

        {/* Explicación de las incorrectas */}
        <div className="bg-[#0a0a0f] rounded-lg p-3 border border-white/5">
          <div className="flex items-start gap-2">
            <AlertCircle size={15} className="text-red-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-red-400 font-semibold text-xs mb-1">Sobre las otras opciones:</p>
              <p className="text-gray-300 text-xs leading-relaxed">{question.wrongExplanation}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────────────────────
export default function ModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { completeModule, isModuleCompleted, totalXP } = useProgressStore();

  // Estado del quiz
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]); // respuestas del usuario por pregunta
  const [quizFinished, setQuizFinished] = useState(false);

  const module = levels.flatMap((l) => l.modules).find((m) => m.id === moduleId);

  // Módulo no encontrado
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
  const quiz: QuizQuestion[] = (module as any).quiz ?? [];
  const hasQuiz = quiz.length > 0;
  const currentQuestion = hasQuiz ? quiz[currentQuestionIndex] : null;

  // ─────────────────────────────────────────────────────────────
  // Lógica del quiz
  // ─────────────────────────────────────────────────────────────
  const handleOptionSelect = (label: string) => {
    if (hasAnswered) return;
    setSelectedOption(label);
  };

  const handleConfirmAnswer = () => {
    if (!selectedOption || !currentQuestion) return;
    setHasAnswered(true);
    setAnswers((prev) => [...prev, selectedOption]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleCompleteModule = () => {
    if (!completed) {
      completeModule(module.id, module.xp);
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981'],
      });
    }
  };

  const handleRetryQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setHasAnswered(false);
    setAnswers([]);
    setQuizFinished(false);
  };

  // Cálculo de puntaje
  const correctAnswers = answers.filter(
    (answer, index) => answer === quiz[index]?.correctOption
  ).length;
  const scorePercent = quiz.length > 0 ? Math.round((correctAnswers / quiz.length) * 100) : 0;
  const passed = scorePercent >= 70; // umbral de aprobación

  // ─────────────────────────────────────────────────────────────
  // Determinar estado visual de una opción
  // ─────────────────────────────────────────────────────────────
  const getOptionStyle = (label: string) => {
    if (!hasAnswered) {
      // antes de confirmar
      if (label === selectedOption) {
        return 'border-[#6366f1] bg-[#6366f1]/10';
      }
      return 'border-white/10 bg-[#0a0a0f] hover:border-[#6366f1]/50 hover:bg-[#6366f1]/5 cursor-pointer';
    }
    // después de confirmar
    if (label === currentQuestion?.correctOption) {
      return 'border-emerald-500 bg-emerald-500/10';
    }
    if (label === selectedOption && label !== currentQuestion?.correctOption) {
      return 'border-red-500 bg-red-500/10';
    }
    return 'border-white/5 bg-[#0a0a0f] opacity-60';
  };

  const getOptionIconStyle = (label: string) => {
    if (!hasAnswered) {
      return label === selectedOption
        ? 'bg-[#6366f1] text-white'
        : 'bg-[#1a1a25] text-gray-400';
    }
    if (label === currentQuestion?.correctOption) return 'bg-emerald-500 text-white';
    if (label === selectedOption) return 'bg-red-500 text-white';
    return 'bg-[#1a1a25] text-gray-400';
  };

  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* ── Botón volver ── */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>Volver</span>
        </button>

        {/* ── Info del módulo ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
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

        {/* ── Área principal ── */}
        <div className="bg-[#13131a] border border-white/5 rounded-2xl p-8 mb-8">

          {/* ── Módulo bloqueado ── */}
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

          ) : !hasQuiz ? (
            /* ── Sin quiz (placeholder) ── */
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#6366f1] rounded-lg flex items-center justify-center">
                  <Play size={20} className="text-white ml-0.5" />
                </div>
                <h2 className="text-xl font-semibold">Contenido del Ejercicio</h2>
              </div>
              <div className="bg-[#0a0a0f] rounded-xl p-6 mb-6 border border-white/5">
                <p className="text-gray-300 mb-4">
                  Aquí se mostraría el contenido interactivo del ejercicio.
                </p>
                <div className="bg-[#1a1a25] rounded-lg p-4 font-mono text-sm text-gray-400">
                  {`// Ejemplo de ejercicio\nfunction solve() {\n  // Tu código aquí\n}`}
                </div>
              </div>
              {!completed ? (
                <button
                  onClick={handleCompleteModule}
                  className="w-full py-4 bg-[#6366f1] hover:bg-[#5558e0] rounded-xl font-semibold text-lg transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  Completar Módulo (+{module.xp} XP)
                </button>
              ) : (
                <div className="w-full py-4 bg-emerald-500/20 text-emerald-400 rounded-xl font-semibold text-lg text-center flex items-center justify-center gap-2">
                  <CheckCircle size={20} />
                  Módulo Completado
                </div>
              )}
            </div>

          ) : quizFinished ? (
            /* ── PANTALLA DE RESULTADOS FINALES ── */
            <div>
              {/* Encabezado resultado */}
              <div
                className={`rounded-2xl p-8 mb-8 text-center ${
                  passed
                    ? 'bg-gradient-to-br from-emerald-500/15 to-[#6366f1]/10 border border-emerald-500/30'
                    : 'bg-gradient-to-br from-red-500/10 to-orange-500/5 border border-red-500/20'
                }`}
              >
                {passed ? (
                  <>
                    <div className="text-5xl mb-4">🎉</div>
                    <h2 className="text-2xl font-bold text-emerald-400 mb-2">¡Excelente trabajo!</h2>
                    <p className="text-gray-300 text-lg mb-1">
                      Obtuviste{' '}
                      <span className="text-white font-bold">
                        {correctAnswers} de {quiz.length}
                      </span>{' '}
                      respuestas correctas
                    </p>
                    <p className="text-gray-400 text-sm mb-4">
                      Puntaje: {scorePercent}% — Aprobado ✓
                    </p>
                    <p className="text-gray-300 text-sm leading-relaxed max-w-lg mx-auto">
                      Demostraste que entiendes cómo elegir estrategias de Prompt Engineering
                      según el contexto. Esto es clave para usar los LLMs de forma efectiva en
                      tareas reales. Cada decisión correcta que tomaste se traduce en prompts
                      más eficientes y menos tiempo perdido en iteraciones.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-5xl mb-4">📚</div>
                    <h2 className="text-2xl font-bold text-orange-400 mb-2">¡Sigue practicando!</h2>
                    <p className="text-gray-300 text-lg mb-1">
                      Obtuviste{' '}
                      <span className="text-white font-bold">
                        {correctAnswers} de {quiz.length}
                      </span>{' '}
                      respuestas correctas
                    </p>
                    <p className="text-gray-400 text-sm mb-4">
                      Puntaje: {scorePercent}% — Necesitas 70% para aprobar
                    </p>
                    <p className="text-gray-300 text-sm leading-relaxed max-w-lg mx-auto">
                      No te desanimes. Revisa las explicaciones de cada pregunta a continuación
                      para entender el razonamiento detrás de cada respuesta correcta. El Prompt
                      Engineering se aprende con práctica y reflexión. Cuando te sientas listo,
                      intenta el quiz de nuevo.
                    </p>
                  </>
                )}
              </div>

              {/* Resumen pregunta por pregunta */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen size={18} className="text-[#818cf8]" />
                  <h3 className="text-lg font-semibold">Repaso detallado</h3>
                </div>
                {quiz.map((q, index) => (
                  <QuestionFeedback
                    key={index}
                    question={q}
                    selectedLabel={answers[index]}
                    questionIndex={index}
                  />
                ))}
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-3">
                {!completed && passed && (
                  <button
                    onClick={handleCompleteModule}
                    className="flex-1 py-4 bg-[#6366f1] hover:bg-[#5558e0] rounded-xl font-semibold text-lg transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                  >
                    <Trophy size={20} />
                    Completar Módulo (+{module.xp} XP)
                  </button>
                )}
                {completed && (
                  <div className="flex-1 py-4 bg-emerald-500/20 text-emerald-400 rounded-xl font-semibold text-lg text-center flex items-center justify-center gap-2">
                    <CheckCircle size={20} />
                    Módulo Completado
                  </div>
                )}
                <button
                  onClick={handleRetryQuiz}
                  className="flex-1 py-4 bg-[#1a1a25] hover:bg-[#222233] border border-white/10 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 text-gray-300"
                >
                  <RotateCcw size={20} />
                  Reintentar Quiz
                </button>
              </div>
            </div>

          ) : (
            /* ── PANTALLA DE PREGUNTA ACTIVA ── */
            <div>
              {/* Progreso */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#6366f1] rounded-lg flex items-center justify-center">
                    <BookOpen size={16} className="text-white" />
                  </div>
                  <span className="text-sm text-gray-400">
                    Pregunta {currentQuestionIndex + 1} de {quiz.length}
                  </span>
                </div>
                {/* Barra de progreso */}
                <div className="flex-1 mx-4 h-1.5 bg-[#1a1a25] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#6366f1] rounded-full transition-all duration-500"
                    style={{
                      width: `${((currentQuestionIndex + (hasAnswered ? 1 : 0)) / quiz.length) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-sm text-[#818cf8] font-medium">
                  {Math.round(((currentQuestionIndex + (hasAnswered ? 1 : 0)) / quiz.length) * 100)}%
                </span>
              </div>

              {/* Pregunta */}
              <h2 className="text-xl font-semibold mb-6 text-white leading-snug">
                {currentQuestion?.question}
              </h2>

              {/* Opciones */}
              <div className="space-y-3 mb-6">
                {currentQuestion?.options.map((option) => (
                  <div
                    key={option.label}
                    onClick={() => handleOptionSelect(option.label)}
                    className={`rounded-xl border p-4 transition-all duration-150 ${getOptionStyle(option.label)}`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icono de letra */}
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${getOptionIconStyle(option.label)}`}
                      >
                        {/* Mostrar ✓ o ✗ después de responder */}
                        {hasAnswered && option.label === currentQuestion?.correctOption ? (
                          <CheckCircle size={16} />
                        ) : hasAnswered && option.label === selectedOption && option.label !== currentQuestion?.correctOption ? (
                          <XCircle size={16} />
                        ) : (
                          option.label
                        )}
                      </span>

                      {/* Contenido de la opción */}
                      <div className="flex-1">
                        <p className="font-semibold text-white mb-1">{option.text}</p>
                        {/* Descripción educativa — siempre visible */}
                        <p className="text-sm text-gray-400 leading-relaxed">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Feedback inmediato al confirmar */}
              {hasAnswered && currentQuestion && (
                <div
                  className={`rounded-xl border p-4 mb-6 ${
                    selectedOption === currentQuestion.correctOption
                      ? 'border-emerald-500/40 bg-emerald-500/8'
                      : 'border-red-500/40 bg-red-500/8'
                  }`}
                >
                  {selectedOption === currentQuestion.correctOption ? (
                    <div className="flex items-start gap-2">
                      <CheckCircle size={18} className="text-emerald-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-emerald-400 mb-1">¡Correcto!</p>
                        <p className="text-sm text-gray-300 leading-relaxed">
                          {currentQuestion.explanation}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2">
                      <XCircle size={18} className="text-red-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-red-400 mb-1">
                          Incorrecto — La respuesta correcta era{' '}
                          <span className="text-emerald-400">
                            {currentQuestion.correctOption}.{' '}
                            {currentQuestion.options.find(
                              (o) => o.label === currentQuestion.correctOption
                            )?.text}
                          </span>
                        </p>
                        <p className="text-sm text-gray-300 leading-relaxed mb-2">
                          {currentQuestion.explanation}
                        </p>
                        <div className="border-t border-white/5 pt-2 mt-2">
                          <p className="text-xs text-gray-500 font-medium mb-1">Sobre las opciones incorrectas:</p>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            {currentQuestion.wrongExplanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Botones de acción */}
              {!hasAnswered ? (
                <button
                  onClick={handleConfirmAnswer}
                  disabled={!selectedOption}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                    selectedOption
                      ? 'bg-[#6366f1] hover:bg-[#5558e0] hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                      : 'bg-[#1a1a25] text-gray-600 cursor-not-allowed'
                  }`}
                >
                  Confirmar Respuesta
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="w-full py-4 bg-[#6366f1] hover:bg-[#5558e0] rounded-xl font-semibold text-lg transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  {currentQuestionIndex < quiz.length - 1 ? (
                    <>Siguiente Pregunta <ChevronRight size={20} /></>
                  ) : (
                    <>Ver Resultados <Trophy size={20} /></>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── XP Total ── */}
        <div className="flex items-center justify-between bg-[#13131a] border border-white/5 rounded-xl px-6 py-4">
          <span className="text-gray-400">XP Total</span>
          <span className="text-xl font-bold text-amber-400">{totalXP} XP</span>
        </div>

      </div>
    </div>
  );
}
