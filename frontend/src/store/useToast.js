import { create } from 'zustand'

let nextId = 0

export const useToast = create((set) => ({
  toasts: [],

  showToast: ({ type = 'info', message, duration = 3500 }) => {
    const id = ++nextId
    set((s) => ({ toasts: [...s.toasts, { id, type, message }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, duration)
  },

  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))
