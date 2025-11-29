const express = require('express');
const User = require('../models/User');

const router = express.Router();

// @desc    Get all users
// @route   GET /api/users
// @access  Public
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('name email profession company avatar').limit(20);
        
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

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('name email profession company avatar bio location website createdAt');
        
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching user',
            error: error.message
        });
    }
});

// @desc    Create demo user (for testing)
// @route   POST /api/users/demo
// @access  Public
router.post('/demo', async (req, res) => {
    try {
        const demoUser = await User.create({
            name: 'Demo User',
            email: 'demo@sidrayyaura.com',
            password: 'password123',
            profession: 'Software Developer',
            company: 'SidrayyAura',
            avatar: '👨‍💻'
        });

        res.status(201).json({
            status: 'success',
            message: 'Demo user created',
            data: {
                user: demoUser
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error creating demo user',
            error: error.message
        });
    }
});

module.exports = router;