import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";


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

export const login = (req, res) => {
    res.send('Login route');
};

export const logout = (req, res) => {
    res.send('Logout route');
};