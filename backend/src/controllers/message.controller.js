import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js"; //cloudinary config

//get all users controller
export const getUsersForSidebar = async (req, res) => {
  try {
    //fetch all users except self
    const loggedInUserId = req.user._id; //current user

    //get all users except the logged-in user, excluding password field
    const filteredUsers = await User.find({_id: {$ne:loggedInUserId}}).select("-password"); 

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error fetching users for sidebar:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//get all messages controller
export const getMessages = async (req, res) => {
  try {
    const { id:userToChatId } = req.params; //id of the user to chat with
    const myId = req.user._id; //current user

    //find all messages between the two users
    const messages = await Message.find({
      $or: [
        {senderId:myId, receiverId:userToChatId},
        {senderId:userToChatId, receiverId:myId}
      ]
    })
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//send message controller
export const sendMessage = async (req, res) => {
  try {
    const {text, image} = req.body; //text and image from the request body
    const { id: receiverId } = req.params; //id of the user to chat with
    const senderId = req.user._id; //current user

    //is there an image?
    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url; //get the secure URL of the uploaded image
    }

    //create a new message
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl //if no image, this will be undefined
    });

    await newMessage.save(); //save the message to the database

    // todo: realtime functionality using socket.io

    res.status(201).json(newMessage); //send the new message as response

  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}


