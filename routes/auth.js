const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Generate JWT Token
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Send token response
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, profession, company } = req.body;

        console.log('📝 Registration attempt:', { name, email, profession });

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                message: 'User already exists with this email'
            });
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            password,
            profession,
            company: company || 'Not specified',
            avatar: '👨‍💼'
        });

        console.log('✅ User created:', user.email);

        createSendToken(user, 201, res);
        
    } catch (error) {
        console.error('❌ Registration error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error during registration',
            error: error.message
        });
    }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('🔐 Login attempt:', email);

        // Check if email and password exist
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide email and password'
            });
        }

        // Check if user exists and password is correct
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isPasswordCorrect = await user.correctPassword(password, user.password);
        
        if (!isPasswordCorrect) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password'
            });
        }

        console.log('✅ Login successful:', user.email);

        createSendToken(user, 200, res);
        
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error during login',
            error: error.message
        });
    }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Public (for testing)
router.get('/me', async (req, res) => {
    try {
        // Demo response - will be protected later
        res.status(200).json({
            status: 'success',
            message: 'Auth route working',
            user: {
                name: 'Demo User',
                email: 'demo@sidrayyaura.com'
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error',
            error: error.message
        });
    }
});

// @desc    Get all users (for testing)
// @route   GET /api/auth/users
// @access  Public
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({
            status: 'success',
            results: users.length,
            data: {
                users
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching users',
            error: error.message
        });
    }
});

module.exports = router;