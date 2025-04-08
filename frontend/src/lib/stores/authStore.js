// src/lib/stores/authStore.js
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function createAuthStore() {
  const { subscribe, set, update } = writable({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: true
  });

  return {
    subscribe,
    login: (token, userData) => {
      if (browser) {
        localStorage.setItem('sessionToken', token);
      }
      set({ isAuthenticated: true, user: userData, token, loading: false });
    },
    logout: () => {
      if (browser) {
        localStorage.removeItem('sessionToken');
      }
      set({ isAuthenticated: false, user: null, token: null, loading: false });
    },
    initialize: () => {
      if (browser) {
        const token = localStorage.getItem('sessionToken');
        
        if (!token) {
          set({ isAuthenticated: false, user: null, token: null, loading: false });
          return;
        }
        
        try {
          // Decode JWT to get user data
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          
          const user = JSON.parse(jsonPayload);
          set({ isAuthenticated: true, user, token, loading: false });
        } catch (error) {
          console.error('Failed to initialize auth state:', error);
          set({ isAuthenticated: false, user: null, token: null, loading: false });
        }
      }
    }
  };
}

export const authStore = createAuthStore();