import {create} from 'zustand';

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem('chat-theme') || 'luxury',
  //setTheme function to update the theme in localStorage
  setTheme: (theme) => {
    localStorage.setItem('chat-theme', theme);
    set({theme});
  }
  
})
);

