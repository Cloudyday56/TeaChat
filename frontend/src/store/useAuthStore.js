import axios from 'axios';
import {create} from 'zustand';
import {axiosInstance} from '../lib/axios.js';
import toast from 'react-hot-toast';

// Zustand store for managing authentication state 
// can be used in other components easily
export const useAuthStore = create((set) => ({
  authUser: null, //initially no user is authenticated
  //loading states for different actions
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true, //always check auth upon refresh
  onlineUsers: [], //to keep track of online users

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
  },

  //handle signup
  signup: async (data) => {
    set({isSigningUp: true}); //set loading state
    try {
      const response = await axiosInstance.post('/auth/signup', data);
      set({authUser: response.data}); //authenticate the user after signup
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({isSigningUp: false}); //reset loading state
    }
  },

  login: async (data) => {
    set({isLoggingIn: true}); //set loading state
    try {
      const response = await axiosInstance.post('/auth/login', data);
      set({authUser: response.data}); //authenticate the user after login
      toast.success('Logged in successfully!');
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({isLoggingIn: false}); //reset loading state
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
      set({authUser: null}); //reset auth user state
      toast.success('Logged out successfully!');
    } catch (error) {
      toast.error('Error logging out. Please try again.');
    }
  },

  updateProfile: async(data) => {
    set({isUpdatingProfile: true}); //set loading state
    try {
      const response = await axiosInstance.put('/auth/update-profile', data); //send the profile update request
      set({authUser: response.data}); //update the auth user state with the new profile data
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.log('Error updating profile:', error);
      toast.error(error.response.data.message);
    } finally {
      set({isUpdatingProfile: false}); //reset loading state
    }
  }

}));

