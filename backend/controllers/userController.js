import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import { validSSNs } from "../utils/validSSNs.js";

// @desc Auth user and set token
// route POST /api/users/auth
// @access PUBLIC
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && await user.matchPassword(password)) {
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role, // Role added for updated functionality
            specialSerialNumber: user.specialSerialNumber // Added to include if applicable
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc Register a new user
// route POST /api/users
// @access PUBLIC
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role, specialSerialNumber } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Validate SSN if user is shelter owner
    if (role === 'shelterOwner' && !validSSNs.includes(specialSerialNumber)) {
        res.status(400);
        throw new Error('Invalid SSN for shelter owner');
    }

    const user = await User.create({
        name,
        email,
        password,
        role,
        specialSerialNumber: role === 'shelterOwner' ? specialSerialNumber : null
    });

    if (user) {
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            specialSerialNumber: user.specialSerialNumber
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc Logout user and clear cookie
// route POST /api/users/logout
// @access PUBLIC
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: 'User logged out' });
});

// @desc Get user profile
// route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role, // Role included for viewing
        specialSerialNumber: req.user.specialSerialNumber // Included if applicable
    };
    res.status(200).json({ user });
});

// @desc Update user profile
// route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        
        if (req.body.password) {
            user.password = req.body.password;
        }

        // Update role if provided and allowed
        if (req.body.role && req.body.role !== user.role) {
            user.role = req.body.role;
        }

        const updatedUser = await user.save();
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            specialSerialNumber: updatedUser.specialSerialNumber
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

export { 
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
};
