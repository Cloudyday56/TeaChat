import axios from 'axios';
import {create} from 'zustand';
import {axiosInstance} from '../lib/axios.js';

// Zustand store for managing authentication state 
// can be used in other components easily
export const useAuthStore = create((set) => ({
  authUser: null, //initially no user is authenticated
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  isCheckingAuth: true, //alwys check auth upon refresh

  //check authentication status
  checkAuth: async () => {
    try {
      //send a request to the backend to check auth status
      const response = await axiosInstance.get('/auth/check');
      set({authUser:response.data})
    } catch (error) {
      console.log('Error checking auth status:', error);
      set({authUser: null});
    } finally {
      set({isCheckingAuth: false});
    }
  }
})
);

