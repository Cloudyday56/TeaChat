import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore.js'
import ChatHeader from './ChatHeader.jsx'
import MessageInput from './MessageInput.jsx'
import MessageSkeleton from './skeletons/MessageSkeleton.jsx'
import { useAuthStore } from '../store/useAuthStore.js'
import { formatMessageTime } from '../lib/utils.js'

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser } = useChatStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    getMessages(selectedUser._id);
  }, [getMessages, selectedUser._id]);

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
                />
              )}
              {/* text */}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />

    </div>
  )
}

export default ChatContainer