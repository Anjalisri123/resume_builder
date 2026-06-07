import User from "../../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Resume from "../../models/Resume.js";

// Generate and return the token for the user
const generateToken = (userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return token;
};

// Controller for user registration and login
// Post : /api/users/register
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Check if required field is present
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }
        // Check if user already exists
        const user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        // Check if password length is valid
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        // Create new user and hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword
        });

        // Return success message
        const token = generateToken(newUser._id);
        newUser.password = undefined;
        return res.status(200).json({ message: "Registered successfully", token, user: newUser });

    } catch (error) {
        return res.status(400).json({ message: "Error registering user", error: error.message });
    }
};
// Controller for user login
// Post : /api/users/login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check if required field is present
        if (!email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }
        // Check if user exists
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }
        // Generate token
        const token = generateToken(user._id);
        user.password = undefined;
        return res.status(200).json({ message: "Login successfully", token, user });
    } catch (error) {
        return res.status(400).json({ message: "Error logging in", error: error.message });
    }
};

// Controller for getting user by id
// Get : /api/users/me
export const getUserbyID = async (req, res) => {
    try {
        const userId = req.userID;
        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Return user data
        user.password = undefined;
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Controller for getting resumes
// GET :/api/users/resumes
export const getResumes = async (req, res) => {
    try {
        const userId = req.userID;
        // Return user resumes
        const resumes = await Resume.find({ userId });
        return res.status(200).json({ resumes });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};