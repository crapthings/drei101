import { create } from 'zustand'

// Shared camera parameters keep the scene and control panel synchronized.
export const useDemoStore = create((set) => ({
  fov: 50,
  distance: 8,
  near: 0.1,
  far: 60,
  setParameter: (name, value) => set({ [name]: value }),
  reset: () => set({ fov: 50, distance: 8, near: 0.1, far: 60 })
}))
