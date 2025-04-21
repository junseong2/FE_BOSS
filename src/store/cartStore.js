import { create } from 'zustand';

// 장바구니 카운트 상태 관리
export const useCartStore = create((set) => ({
    trigger: false,
    setTrigger: () => set((state) => ({ trigger:!state.trigger })),

}));
