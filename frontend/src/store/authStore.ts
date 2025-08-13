import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the User type according to your backend response
export interface User {
  id: number;
  name: string;
  email: string;
  role: "uploader" | "signer";
  token: string; // JWT token
}

// Define the store state and actions
interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: User) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: "auth-storage", // localStorage key
      getStorage: () => localStorage,
    }
  )
);
