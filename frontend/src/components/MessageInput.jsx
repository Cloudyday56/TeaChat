import React from "react";
import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useRef } from "react";
import { Image, X, Send } from "lucide-react";
import toast from "react-hot-toast";


const MessageInput = () => {
  const [text, setText] = useState(""); //text input state
  const [imagePreview, setImagePreview] = useState(null); //image preview state
  const fileInputRef = useRef(null); //file input reference
  const { sendMessage } = useChatStore(); //destructure sendMessage from the store

  //image upload functions (image change and remove)
  const handleImageChange = async (e) => {
    const file = e.target.files[0]; //get the first file from the input
    //if not an image
    if (!file.type.startsWith("image/")){
      toast.error("Please upload an image file.");
      return;
    }
    const reader = new FileReader(); //create a FileReader to read the file
    reader.onloadend = () => {
      setImagePreview(reader.result); //set the image preview state with the file data
    };
    reader.readAsDataURL(file); //read the file as a data URL
  };

  const removeImage = () => {
    setImagePreview(null);
    // clear the file input value if there is a file
    if (fileInputRef.current) { fileInputRef.current.value = ""; }
  };

  //send message function
  const handleSendMessage = async (e) => {
    e.preventDefault(); //prevent page refresh
    //if no text and no image
    if (!text.trim() && !imagePreview) {
      return;
    }

    //call sendMessage

    try {
      await sendMessage({
      text: text.trim(),
      image: imagePreview, //image data will be sent as base64 string
      });

      //clear form
      setText(""); //clear the text input
      setImagePreview(null); //clear the image preview
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="p-4 w-full">

      {/* image preview */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            {/* click to remove image */}
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          {/* message input */}
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {/* image upload button */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                    ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>

        {/* send button */}
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
