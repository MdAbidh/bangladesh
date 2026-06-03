import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { THEME } from '@/lib/constants';

interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  setSidebarOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'light',
      sidebarOpen: true,
      mobileMenuOpen: false,
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', newTheme === 'dark');
          }
          return { theme: newTheme };
        }),
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      toggleMobileMenu: () =>
        set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
    }),
    {
      name: THEME.STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme }),
      onRehydrateStorage: () => (state) => {
        if (state && typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', state.theme === 'dark');
        }
      },
    },
  ),
);
