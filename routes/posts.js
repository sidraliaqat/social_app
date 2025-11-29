const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');

const router = express.Router();

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'name profession company avatar')
            .populate('comments.user', 'name profession avatar')
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json({
            status: 'success',
            results: posts.length,
            data: {
                posts
            }
        });
    } catch (error) {
        console.error('❌ Error fetching posts:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching posts',
            error: error.message
        });
    }
});
// Add comment to post
router.post('/:id/comments', async (req, res) => {
    try {
        const { content, userId } = req.body;
        const postId = req.params.id;

        console.log('💬 Adding comment:', { postId, userId, content });

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                status: 'error',
                message: 'Post not found'
            });
        }

        // Get user for comment
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        const newComment = {
            user: userId,
            content: content,
            createdAt: new Date()
        };

        post.comments.push(newComment);
        await post.save();

        // Populate the new comment with user data
        await post.populate('comments.user', 'name profession avatar');

        res.status(200).json({
            status: 'success',
            data: {
                comment: newComment,
                post
            }
        });
    } catch (error) {
        console.error('❌ Error adding comment:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error adding comment',
            error: error.message
        });
    }
});
// Like/unlike post
router.post('/:id/like', async (req, res) => {
    try {
        const { userId } = req.body;
        const postId = req.params.id;

        console.log('❤️ Like action:', { postId, userId });

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                status: 'error',
                message: 'Post not found'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Check if already liked
        const alreadyLiked = post.likes.includes(userId);
        
        if (alreadyLiked) {
            // Unlike - remove from array
            post.likes = post.likes.filter(likeId => likeId.toString() !== userId);
        } else {
            // Like - add to array
            post.likes.push(userId);
        }

        await post.save();
        await post.populate('likes', 'name avatar');

        res.status(200).json({
            status: 'success',
            data: {
                post,
                liked: !alreadyLiked,
                likesCount: post.likes.length
            }
        });
    } catch (error) {
        console.error('❌ Error liking post:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error liking post',
            error: error.message
        });
    }
});
// @desc    Create a post
// @route   POST /api/posts
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { content, author, tags, postType } = req.body;

        console.log('📝 Creating post:', { content });

        // Get any user as author for demo
        const demoAuthor = await User.findOne();
        
        if (!demoAuthor) {
            return res.status(400).json({
                status: 'error',
                message: 'No users found. Please create a user first.'
            });
        }

        const post = await Post.create({
            content,
            author: demoAuthor._id,
            tags: tags || ['general'],
            postType: postType || 'post'
        });

        // Populate author info
        await post.populate('author', 'name profession company avatar');

        console.log('✅ Post created:', post._id);

        res.status(201).json({
            status: 'success',
            data: {
                post
            }
        });
    } catch (error) {
        console.error('❌ Error creating post:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error creating post',
            error: error.message
        });
    }
});

// @desc    Get post by ID
// @route   GET /api/posts/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'name profession company avatar')
            .populate('comments.user', 'name profession avatar')
            .populate('likes', 'name avatar')
            .populate('shares', 'name avatar');

        if (!post) {
            return res.status(404).json({
                status: 'error',
                message: 'Post not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                post
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching post',
            error: error.message
        });
    }
});

// @desc    Create demo posts
// @route   POST /api/posts/demo
// @access  Public
router.post('/demo', async (req, res) => {
    try {
        const demoUser = await User.findOne();
        
        if (!demoUser) {
            return res.status(400).json({
                status: 'error',
                message: 'No users found'
            });
        }

        const demoPosts = [
            {
                content: '🚀 Welcome to SidrayyAura! This professional network is now live and ready for connections.',
                author: demoUser._id,
                tags: ['welcome', 'announcement']
            },
            {
                content: '💼 Building meaningful professional relationships is key to career growth. Excited to see this community grow!',
                author: demoUser._id,
                tags: ['career', 'networking']
            },
            {
                content: '🌟 Just deployed the backend API successfully! The platform is now fully functional with user authentication and post management.',
                author: demoUser._id,
                tags: ['development', 'update']
            }
        ];

        const posts = await Post.create(demoPosts);
        await Post.populate(posts, { path: 'author', select: 'name profession company avatar' });

        res.status(201).json({
            status: 'success',
            message: 'Demo posts created',
            data: {
                posts
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error creating demo posts',
            error: error.message
        });
    }
});

module.exports = router;