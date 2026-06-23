export interface Module {
  id: string;
  title: string;
  description: string;
  xp: number;
  type: 'Práctica' | 'Teoría';
  locked: boolean;
  completed: boolean;
  levelId: string;
}

export interface Level {
  id: string;
  name: string;
  description: string;
  modules: Module[];
}

export interface UserProgress {
  totalXP: number;
  completedModules: string[];
}
