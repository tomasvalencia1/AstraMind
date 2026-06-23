import { create } from 'zustand';
import type { UserProgress } from '../types';

interface ProgressState extends UserProgress {
  completeModule: (moduleId: string, xp: number) => void;
  isModuleCompleted: (moduleId: string) => boolean;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  totalXP: 0,
  completedModules: [],

  completeModule: (moduleId: string, xp: number) => {
    set((state) => ({
      totalXP: state.totalXP + xp,
      completedModules: [...state.completedModules, moduleId],
    }));
  },

  isModuleCompleted: (moduleId: string) => {
    return get().completedModules.includes(moduleId);
  },
}));
