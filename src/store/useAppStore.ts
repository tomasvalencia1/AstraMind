import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserProfile {
  xp: number;
  level: number;
  streak: number;
  lastLogin: string | null;
  unlockedModules: string[];
}

interface AppState {
  user: UserProfile;
  addXp: (amount: number) => void;
  updateStreak: () => void;
  unlockModule: (moduleId: string) => void;
  // TODO: Supabase Auth integration function here later
}

const calculateLevel = (xp: number) => Math.floor(xp / 1000) + 1;

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: {
        xp: 0,
        level: 1,
        streak: 0,
        lastLogin: null,
        unlockedModules: ['module-1-beginner'],
      },
      addXp: (amount) =>
        set((state) => {
          const newXp = state.user.xp + amount;
          return {
            user: {
              ...state.user,
              xp: newXp,
              level: calculateLevel(newXp),
            },
          };
        }),
      updateStreak: () =>
        set((state) => {
          const today = new Date().toDateString();
          if (state.user.lastLogin === today) return state; // Already logged in today

          // Simple logic for streak (for MVP)
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          
          const isConsecutive = state.user.lastLogin === yesterday.toDateString();
          
          return {
            user: {
              ...state.user,
              streak: isConsecutive ? state.user.streak + 1 : 1,
              lastLogin: today,
            },
          };
        }),
      unlockModule: (moduleId) =>
        set((state) => ({
          user: {
            ...state.user,
            unlockedModules: [...new Set([...state.user.unlockedModules, moduleId])],
          },
        })),
    }),
    {
      name: 'ai-master-storage', // name of the item in the storage (must be unique)
      // By default, it uses localStorage.
      // Ready to swap to a custom storage that syncs with Supabase DB later.
    }
  )
)
