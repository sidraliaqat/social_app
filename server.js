const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// In-memory database - Global scope mein
let users = [];
let posts = [];

// Initialize demo data
const initializeDemoData = () => {
    console.log('🔄 Initializing demo data...');
    
    users = [
        {
            _id: '1',
            name: 'Demo User',
            email: 'demo@sidrayyaura.com',
            password: 'password123',
            profession: 'Full Stack Developer',
            company: 'SidrayyAura Inc.',
            avatar: '👨‍💻',
            bio: 'Passionate about building amazing web applications!',
            location: 'New York, USA',
            website: 'https://sidrayyaura.com',
            connections: [],
            followers: [],
            following: [],
            createdAt: new Date()
        }
    ];

    posts = [
        {
            _id: '1',
            content: '🚀 Welcome to SidrayyAura! This professional network is now live and ready for connections.',
            author: users[0],
            likes: ['1'],
            comments: [
                {
                    _id: '1',
                    user: users[0],
                    content: 'Excited to be part of this amazing platform!',
                    createdAt: new Date(Date.now() - 3600000)
                }
            ],
            shares: [],
            tags: ['welcome', 'announcement'],
            postType: 'post',
            image: null,
            createdAt: new Date(Date.now() - 86400000)
        }
    ];

    console.log(`✅ Demo data initialized: ${users.length} users, ${posts.length} posts`);
};

// Initialize data when server starts
initializeDemoData();

// ==================== AUTH ROUTES ====================
app.post('/api/auth/register', (req, res) => {
    try {
        const { name, email, password, profession, company } = req.body;

        console.log('📝 Registration attempt received:', { name, email, profession });

        // Check if user already exists
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            console.log('❌ User already exists:', email);
            return res.status(400).json({
                status: 'error',
                message: 'User already exists with this email'
            });
        }

        // Create new user
        const newUser = {
            _id: Date.now().toString(),
            name,
            email,
            password,
            profession,
            company: company || 'Not specified',
            avatar: '👨‍💼',
            bio: '',
            location: '',
            website: '',
            connections: [],
            followers: [],
            following: [],
            createdAt: new Date()
        };

        users.push(newUser);

        console.log('✅ User created successfully:', newUser.email);

        // Remove password from response
        const { password: _, ...userResponse } = newUser;

        res.status(201).json({
            status: 'success',
            token: 'token_' + Date.now(),
            data: {
                user: userResponse
            }
        });
        
    } catch (error) {
        console.error('❌ Registration error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error during registration'
        });
    }
});

app.post('/api/auth/login', (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('🔐 Login attempt:', email);

        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide email and password'
            });
        }

        // Find user
        const user = users.find(u => u.email === email);
        
        if (!user) {
            console.log('❌ User not found:', email);
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password'
            });
        }

        // Check password
        if (password !== user.password) {
            console.log('❌ Invalid password for:', email);
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password'
            });
        }

        console.log('✅ Login successful:', user.email);

        // Remove password from response
        const { password: _, ...userResponse } = user;

        res.status(200).json({
            status: 'success',
            token: 'token_' + Date.now(),
            data: {
                user: userResponse
            }
        });
        
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error during login'
        });
    }
});

// ==================== POSTS ROUTES ====================
app.get('/api/posts', (req, res) => {
    try {
        console.log('📨 Fetching posts, total:', posts.length);
        res.status(200).json({
            status: 'success',
            results: posts.length,
            data: {
                posts: posts.map(post => ({
                    ...post,
                    author: {
                        _id: post.author._id,
                        name: post.author.name,
                        profession: post.author.profession,
                        company: post.author.company,
                        avatar: post.author.avatar
                    }
                }))
            }
        });
    } catch (error) {
        console.error('❌ Error fetching posts:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching posts'
        });
    }
});

// Create post without image upload
app.post('/api/posts', (req, res) => {
    try {
        const { content, userId } = req.body;
        const image = null;
        
        console.log('📝 Creating new post:', { content, userId });

        if (!content) {
            return res.status(400).json({
                status: 'error',
                message: 'Post content is required'
            });
        }

        // Find the current user
        const author = users.find(u => u._id === userId);
        if (!author) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        const newPost = {
            _id: Date.now().toString(),
            content: content,
            author: {
                _id: author._id,
                name: author.name,
                profession: author.profession,
                company: author.company,
                avatar: author.avatar
            },
            likes: [],
            comments: [],
            shares: [],
            tags: ['general'],
            postType: 'post',
            image: image,
            createdAt: new Date()
        };

        posts.unshift(newPost);

        console.log('✅ Post created successfully. Total posts:', posts.length);

        res.status(201).json({
            status: 'success',
            data: {
                post: newPost
            }
        });
    } catch (error) {
        console.error('❌ Error creating post:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error creating post'
        });
    }
});

// Like a post
app.post('/api/posts/:id/like', (req, res) => {
    try {
        const { userId } = req.body;
        const postId = req.params.id;

        console.log('❤️ Like action:', { postId, userId });

        const post = posts.find(p => p._id === postId);
        if (!post) {
            return res.status(404).json({
                status: 'error',
                message: 'Post not found'
            });
        }

        // Check if already liked
        const alreadyLiked = post.likes.includes(userId);
        
        if (alreadyLiked) {
            // Unlike
            post.likes = post.likes.filter(id => id !== userId);
        } else {
            // Like
            post.likes.push(userId);
        }

        res.status(200).json({
            status: 'success',
            data: {
                liked: !alreadyLiked,
                likesCount: post.likes.length
            }
        });
    } catch (error) {
        console.error('❌ Error liking post:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error liking post'
        });
    }
});

// Add comment to post
app.post('/api/posts/:id/comments', (req, res) => {
    try {
        const { content, userId } = req.body;
        const postId = req.params.id;

        console.log('💬 Adding comment:', { postId, userId, content });

        const post = posts.find(p => p._id === postId);
        if (!post) {
            return res.status(404).json({
                status: 'error',
                message: 'Post not found'
            });
        }

        // Find user
        const user = users.find(u => u._id === userId);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        const newComment = {
            _id: Date.now().toString(),
            user: {
                _id: user._id,
                name: user.name,
                profession: user.profession,
                avatar: user.avatar
            },
            content: content,
            createdAt: new Date()
        };

        post.comments.push(newComment);

        res.status(200).json({
            status: 'success',
            data: {
                comment: newComment,
                commentsCount: post.comments.length
            }
        });
    } catch (error) {
        console.error('❌ Error adding comment:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error adding comment'
        });
    }
});

// ==================== USERS ROUTES ====================
app.get('/api/users', (req, res) => {
    try {
        const usersWithoutPassword = users.map(({ password, ...user }) => user);
        
        console.log('📊 Sending users:', usersWithoutPassword.length);
        
        res.status(200).json({
            status: 'success',
            results: usersWithoutPassword.length,
            data: {
                users: usersWithoutPassword
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching users'
        });
    }
});

app.get('/api/users/:id', (req, res) => {
    try {
        const user = users.find(u => u._id === req.params.id);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Remove password from response
        const { password, ...userResponse } = user;

        res.status(200).json({
            status: 'success',
            data: {
                user: userResponse
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching user'
        });
    }
});

// ==================== PROFILE ROUTES ====================
app.patch('/api/users/:id', (req, res) => {
    try {
        const userId = req.params.id;
        const { name, profession, company, location, website, bio } = req.body;

        console.log('📝 Updating profile for user:', userId);
        console.log('📦 Update data:', req.body);

        // Find user index
        const userIndex = users.findIndex(u => u._id === userId);
        if (userIndex === -1) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Update user data
        if (name !== undefined) users[userIndex].name = name;
        if (profession !== undefined) users[userIndex].profession = profession;
        if (company !== undefined) users[userIndex].company = company;
        if (location !== undefined) users[userIndex].location = location;
        if (website !== undefined) users[userIndex].website = website;
        if (bio !== undefined) users[userIndex].bio = bio;

        console.log('✅ Updated user:', users[userIndex]);

        // Also update user info in posts
        posts.forEach(post => {
            if (post.author._id === userId) {
                if (name !== undefined) post.author.name = name;
                if (profession !== undefined) post.author.profession = profession;
                if (company !== undefined) post.author.company = company;
            }
        });

        // Remove password from response
        const { password, ...userResponse } = users[userIndex];

        res.status(200).json({
            status: 'success',
            data: {
                user: userResponse
            }
        });
    } catch (error) {
        console.error('❌ Error updating profile:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error updating profile'
        });
    }
});

// Get user's posts
app.get('/api/users/:id/posts', (req, res) => {
    try {
        const userId = req.params.id;
        
        const userPosts = posts.filter(post => post.author._id === userId);
        
        res.status(200).json({
            status: 'success',
            results: userPosts.length,
            data: {
                posts: userPosts
            }
        });
    } catch (error) {
        console.error('❌ Error fetching user posts:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching user posts'
        });
    }
});

// Debug endpoint to check current users
app.get('/api/debug/users', (req, res) => {
    res.json({
        totalUsers: users.length,
        users: users.map(u => ({
            id: u._id,
            name: u.name,
            email: u.email,
            profession: u.profession
        }))
    });
});

// ==================== OTHER ROUTES ====================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/api', (req, res) => {
    res.json({
        message: '🌟 Welcome to SidrayyAura Backend API',
        version: '3.1.0',
        timestamp: new Date().toISOString(),
        database: 'In-memory (Debug Mode)',
        features: ['Posts', 'Likes', 'Comments', 'Users', 'Authentication', 'Profile Update'],
        stats: {
            users: users.length,
            posts: posts.length,
            totalLikes: posts.reduce((sum, post) => sum + post.likes.length, 0),
            totalComments: posts.reduce((sum, post) => sum + post.comments.length, 0)
        }
    });
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        service: 'SidrayyAura Backend',
        database: 'In-memory (Debug Mode)',
        users: users.length,
        posts: posts.length,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Demo setup endpoint
app.get('/api/demo/setup', (req, res) => {
    initializeDemoData();
    res.json({
        status: 'success',
        message: 'Demo data reset successfully',
        data: {
            users: users.length,
            posts: posts.length
        }
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: err.message
    });
});

app.use('*', (req, res) => {
    res.status(404).json({ message: 'API route not found' });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log('=================================');
    console.log('🚀 SIDRAYYAURA SERVER STARTED');
    console.log('=================================');
    console.log('🌟 DEBUG MODE - Enhanced Logging');
    console.log('📝 Features: Posts, Likes, Comments, Profile Update');
    console.log('💾 Using in-memory database');
    console.log('=================================');
    console.log(`📍 Frontend: http://localhost:${PORT}`);
    console.log(`🔧 API: http://localhost:${PORT}/api`);
    console.log(`👥 Debug Users: http://localhost:${PORT}/api/debug/users`);
    console.log(`❤️ Health: http://localhost:${PORT}/api/health`);
    console.log(`🎮 Demo Setup: http://localhost:${PORT}/api/demo/setup`);
    console.log('=================================');
});