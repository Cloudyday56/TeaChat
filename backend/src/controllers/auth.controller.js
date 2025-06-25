import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import cloudinary from "../lib/cloudinary.js"; //import cloudinary for image upload

//signup controller
export const signup = async (req, res) => {
    //get user data
    const { fullName, email, password} = req.body;
    // hash the password and save the user to the database
    try {
        //validate user data
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        //invalide password
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        //check if user already exists
        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        //hash the password given by the user
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        //create a new user
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        if (newUser) {
            //generate JWT token
            generateToken(newUser._id, res);
            await newUser.save(); //save the user to the database

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        }else{
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.log("Error during signup:", error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//login controller
export const login = async (req, res) => {
    //receive input
    const { email, password } = req.body;
    try {
        //check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credential' });
        }

        //compare the password with the hashed password in the database
        const isPasswordCorrect = await bcryptjs.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid Credential' });
        }

        //if everything is fine, send the user data and generate JWT token
        generateToken(user._id, res); //generate JWT token
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });

    } catch (error) {
        console.log("Error during login:", error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//logout controller
export const logout = async (req, res) => {
    //clear out the cookie
    try {
        res.cookie("jwt", "", {maxAge:0})
        res.status(200).json({ message: 'logged out successfully' });
    } catch (error) {
        console.log("Error during logout:", error.message);
        res.status(500).json({ message: 'Internal server error' });
    }

};

//update user profile controller
export const updateProfile = async (req, res) => {
    try {
        const {profilePic} = req.body;
        const userId = req.user._id //user added from the protectRoute middleware

        if (!profilePic) {
            return res.status(400).json({ message: 'Profile picture is required' });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic) //cloudinary is just a bucket for image upload
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url }, //update the profilePic field with the uploaded image URL
            { new: true } //return the user after update
        );

        res.status(200).json(updatedUser); //send the updated user data as response

    } catch (error) {
        console.log("Error during profile update:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//checkAuth controller
export const checkAuth = async (req, res) => {
    try {
        res.status(200).json(req.user); //send the user data from the request object
    } catch (error) {
        console.log("Error during authentication check:", error.message);
        res.status(500).json({ message: 'Internal server error' });
    }

};




