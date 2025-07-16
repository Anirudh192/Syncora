// src/store/authStore.js
import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: true,
      token: null,

      setAuth: (data) => {
        set({
          user: data,
          isAuthenticated: true,
          token: data.token,
        });
      },

      login: async (credentials) => {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(credentials),
        });

        if (!res.ok) throw new Error("Login failed");
        const user = await res.json();
        set({ user, isAuthenticated: true });
      },
      logout: async () => {
        try {
          const res = await axios.post(
            "http://localhost:3000/api/auth/logout",
            {}, // Empty body parameter
            {
              withCredentials: true,
            }
          );

          set({ user: null, isAuthenticated: false, token: null });
          localStorage.removeItem("auth-storage"); // Important because we use persists
        } catch (error) {
          console.error("Logout Failed!: ", error);
          
          set({ user: null, isAuthenticated: false, token: null });
          localStorage.removeItem("auth-storage");
        }
      },
      fetchUser: async () => {
        try {
          const token = useAuthStore.getState().token;

          if (!token) {
            set({ user: null, isAuthenticated: false, loading: false });
            return;
          }
          const res = await axios.get("http://localhost:3000/api/me", {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const user = res.data;
        //   console.log("From authStore.js fetchUser:", user.user);
          set({ user, isAuthenticated: true, loading: false });
        } catch (err) {
          console.log("fetchUser error:", err);
          
          set({
            user: null,
            isAuthenticated: false,
            token: null,
            loading: false,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        // Removed isAuthenticated
      }),
    }
  )
);

export default useAuthStore;
