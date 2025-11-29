const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Please provide post content'],
        maxlength: [2000, 'Post cannot exceed 2000 characters']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: true,
            maxlength: [500, 'Comment cannot exceed 500 characters']
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    shares: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    tags: [{
        type: String,
        trim: true
    }],
    postType: {
        type: String,
        enum: ['post', 'article', 'achievement', 'question'],
        default: 'post'
    }
}, {
    timestamps: true
});

// Index for better performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ likes: 1 });
postSchema.index({ tags: 1 });

module.exports = mongoose.model('Post', postSchema);