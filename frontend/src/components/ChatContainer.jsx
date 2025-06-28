import React from 'react'
import { useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore.js'
import ChatHeader from './ChatHeader.jsx'
import MessageInput from './MessageInput.jsx'
import MessageSkeleton from './skeletons/MessageSkeleton.jsx'
import { useAuthStore } from '../store/useAuthStore.js'
import { formatMessageTime } from '../lib/utils.js'
import { useCallback } from 'react'

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages
  } = useChatStore();
  const { authUser } = useAuthStore();

  const messageEndRef = useRef(null); // ref to scroll to the bottom when new messages arrive
  const imageLoadCounter = useRef(0); // to track how many images have loaded

  // Create a reusable scroll function
  const scrollToBottom = useCallback(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);
  // Handle image load event
  const handleImageLoad = useCallback(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages(); // subscribe to new messages for the selected user

    return () => { unsubscribeFromMessages(); }
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  // scroll to the bottom when new messages arrive
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, scrollToBottom]); //whenever messages change, scroll to the bottom

  // UI before loading messages
  if (isMessagesLoading) return (
  <div className='flex-1 flex flex-col overflow-auto'>
    <ChatHeader />
    <MessageSkeleton />
    <MessageInput />
  </div>
  );

  return (
    <div className="flex-1 flex flex-col overflow-auto">

      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`} // seperate messages by sender/receiver
            // ref={messageEndRef} // add a ref to scroll to the bottom when new messages arrive
          >
            {/* Avatar of sender/receiver */}
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  } // again, depends on sender/receiver
                  alt="profile pic"
                />
              </div>
            </div>

            {/* time header */}
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1"> 
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            {/* message display */}
            <div className="chat-bubble flex">
              {/* image */}
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                  onLoad={handleImageLoad}
                />
              )}
              {/* text */}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
        <div ref={messageEndRef}/>
      </div>

      <MessageInput />

    </div>
  )
}

export default ChatContainer