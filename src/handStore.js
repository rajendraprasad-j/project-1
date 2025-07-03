// src/handStore.js
import { create } from 'zustand'

export const useHandStore = create(set => ({
  landmarks: null,
  setLandmarks: (landmarks) => set({ landmarks }),
  showAO: true,
  toggleAO: () => set(state => ({ showAO: !state.showAO }))
}))