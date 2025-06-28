import {create} from 'zustand';
import toast from 'react-hot-toast';
import {axiosInstance} from '../lib/axios.js';

export const useChatStore = create((set) => ({
  messages: [],
  users: [],
  selectedUser: null, //no user selected by default
  isUsersLoading: false, //loading state
  isMessagesLoading: false, //loading state

  getUsers: async () => {
    set({isUsersLoading: true}); // Set loading state to true before fetching users
    try {
      const response = await axiosInstance.get('/messages/users'); //the route set in backend
      set({users: response.data});
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({isUsersLoading: false}); // Set loading state to false after fetching users
    }
  },

  getMessages: async (userId) => { //depend on userId to fetch messages for that user
    set({isMessagesLoading: true}); // Set loading state to true before fetching messages
    try {
      const response = await axiosInstance.get(`/messages/${userId}`); //endpoint set in backend
      set({messages: response.data});
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({isMessagesLoading: false}); // Set loading state to false after fetching messages
    }
  },

  // todo: optimize later

  //setter functions to update the state
  setSelectedUser: (selectedUser) => set({selectedUser}), //set the selected user for chat

}));



