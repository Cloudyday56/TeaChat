import {create} from 'zustand';
import toast from 'react-hot-toast';
import {axiosInstance} from '../lib/axios.js';
import {useAuthStore} from './useAuthStore.js'; //import auth store to get socket instance

export const useChatStore = create((set, get) => ({
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

  //send message
  sendMessage: async(messageData) => {
    const {selectedUser, messages} = get(); //getter function from zustand
    try {
      const response = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData); //endpoint set in backend
      set({messages: [...messages, response.data]}); //update messages state with new message
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket; //get socket instance from auth store

    // Listen for new messages from the server
    socket.on('newMessage', (newMessage) => {
      
    if (newMessage.senderId === selectedUser._id || 
    newMessage.receiverId === selectedUser._id) {
      set({
        messages: [...get().messages, newMessage]
      });
    }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket; //get socket instance from auth store
    socket.off('newMessage'); //remove the listening event (socket.on)
  },


  //setter functions to update the state
  setSelectedUser: (selectedUser) => set({selectedUser}), //set the selected user for chat

}));



