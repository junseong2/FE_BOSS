import { create } from 'zustand';

export const useMenuToggleStore = create((set) => ({
  open: false,
  setOpen: () => set((state) => ({ open: !state.open })),
}));
