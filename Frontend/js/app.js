// SidrayyAura - Enhanced Version with Image Upload & Current User
class SidrayyAura {
    constructor() {
        this.currentUser = null;
        this.posts = [];
        this.API_BASE = 'http://localhost:5000/api';
        this.init();
    }

    init() {
        console.log('🌟 SidrayyAura Enhanced starting...');
        this.setupEventListeners();
        this.checkAuthStatus();
        this.testBackendConnection();
    }

    async testBackendConnection() {
        try {
            const response = await fetch(`${this.API_BASE}/health`);
            const data = await response.json();
            console.log('✅ Backend connection:', data.status);
        } catch (error) {
            console.log('❌ Backend connection failed:', error);
        }
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'loginBtn' || e.target.id === 'startLogin') {
                this.showLoginForm();
            }
            if (e.target.id === 'registerBtn') {
                this.showRegisterForm();
            }
            if (e.target.id === 'showRegisterLink') {
                e.preventDefault();
                this.showRegisterForm();
            }
            if (e.target.id === 'showLoginLink') {
                e.preventDefault();
                this.showLoginForm();
            }
        });
    }

    checkAuthStatus() {
        const userData = localStorage.getItem('sidrayyAuraUser');
        
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.showFeed();
            this.updateNavigation();
        } else {
            this.showWelcome();
        }
    }

    updateNavigation() {
        const navLinks = document.querySelector('.nav-links');
        if (!navLinks) return;

        if (this.currentUser) {
            navLinks.innerHTML = `
                <span style="color: var(--text-gray); margin-right: 1rem;">Hi, ${this.currentUser.name}</span>
                <button onclick="app.showProfile()" class="nav-btn-outline">Profile</button>
                <button onclick="app.logout()" class="nav-btn">Logout</button>
            `;
        } else {
            navLinks.innerHTML = `
                <button id="loginBtn" class="nav-btn-outline">Sign In</button>
                <button id="registerBtn" class="nav-btn">Join Free</button>
            `;
        }
    }

    showWelcome() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="hero-section fade-in">
                <div class="hero-content">
                    <h1>Welcome to SidrayyAura</h1>
                    <p class="hero-tagline">Where professionals connect, collaborate, and grow together</p>
                    <div class="hero-buttons">
                        <button id="startLogin" class="btn btn-primary btn-large">
                            🚀 Start Your Journey
                        </button>
                        <button onclick="app.showLearnMore()" class="btn btn-secondary">
                            Learn More
                        </button>
                    </div>
                </div>
            </div>

            <div class="features-grid">
                <div class="feature-card fade-in">
                    <div class="feature-icon">🌐</div>
                    <h3>Global Network</h3>
                    <p>Connect with professionals worldwide</p>
                </div>
                <div class="feature-card fade-in">
                    <div class="feature-icon">💼</div>
                    <h3>Career Growth</h3>
                    <p>Discover new opportunities</p>
                </div>
                <div class="feature-card fade-in">
                    <div class="feature-icon">🤝</div>
                    <h3>Real Connections</h3>
                    <p>Build meaningful relationships</p>
                </div>
            </div>
        `;
    }

    showLearnMore() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="form-container">
                <div class="form-card">
                    <div class="form-header">
                        <h2>About SidrayyAura</h2>
                    </div>
                    <div class="form-body">
                        <div style="text-align: left; color: var(--text-gray); line-height: 1.6;">
                            <p>🌟 <strong>SidrayyAura</strong> is a modern professional social network.</p>
                            <ul style="margin: 1rem 0 1rem 1.5rem;">
                                <li>Connect with professionals</li>
                                <li>Share achievements</li>
                                <li>Like and comment on posts</li>
                                <li>Build your network</li>
                            </ul>
                        </div>
                        <button onclick="app.showWelcome()" class="btn btn-primary btn-block">
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    showLoginForm() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="form-container">
                <div class="form-card fade-in">
                    <div class="form-header">
                        <h2>Welcome Back</h2>
                        <p>Sign in to your account</p>
                    </div>
                    <div class="form-body">
                        <div id="messageContainer"></div>
                        <form id="loginForm">
                            <div class="form-group">
                                <label class="form-label">Email Address</label>
                                <input type="email" class="form-input" placeholder="demo@sidrayyaura.com" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Password</label>
                                <input type="password" class="form-input" placeholder="password123" required>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block">
                                🔐 Sign In
                            </button>
                        </form>
                    </div>
                    <div class="form-footer">
                        <p class="form-footer-text">
                            New here? <a href="#" id="showRegisterLink">Create an account</a>
                        </p>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
    }

    showRegisterForm() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="form-container">
                <div class="form-card fade-in">
                    <div class="form-header">
                        <h2>Join SidrayyAura</h2>
                        <p>Start your professional journey</p>
                    </div>
                    <div class="form-body">
                        <div id="messageContainer"></div>
                        <form id="registerForm">
                            <div class="form-group">
                                <label class="form-label">Full Name</label>
                                <input type="text" class="form-input" placeholder="Enter your name" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Email Address</label>
                                <input type="email" class="form-input" placeholder="your@email.com" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Password</label>
                                <input type="password" class="form-input" placeholder="Create a password" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Profession</label>
                                <input type="text" class="form-input" placeholder="e.g. Software Engineer" required>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block">
                                🌟 Create Account
                            </button>
                        </form>
                    </div>
                    <div class="form-footer">
                        <p class="form-footer-text">
                            Already have an account? <a href="#" id="showLoginLink">Sign in here</a>
                        </p>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));
    }

    async handleLogin(e) {
        e.preventDefault();
        const form = e.target;
        const email = form.querySelector('input[type="email"]').value;
        const password = form.querySelector('input[type="password"]').value;

        this.showMessage('Signing you in...', 'loading');

        try {
            const response = await fetch(`${this.API_BASE}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                const userData = {
                    id: data.data.user._id,
                    name: data.data.user.name,
                    email: data.data.user.email,
                    profession: data.data.user.profession,
                    company: data.data.user.company,
                    avatar: data.data.user.avatar,
                    token: data.token
                };

                localStorage.setItem('sidrayyAuraUser', JSON.stringify(userData));
                this.currentUser = userData;
                
                this.showMessage('Welcome back!', 'success');
                setTimeout(() => {
                    this.showFeed();
                    this.updateNavigation();
                }, 1000);
            } else {
                this.showMessage(data.message || 'Login failed. Try: demo@sidrayyaura.com / password123', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showMessage('Network error. Please try again.', 'error');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const form = e.target;
        const inputs = form.querySelectorAll('input');
        const name = inputs[0].value;
        const email = inputs[1].value;
        const password = inputs[2].value;
        const profession = inputs[3].value;

        this.showMessage('Creating your account...', 'loading');

        try {
            const response = await fetch(`${this.API_BASE}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, profession })
            });

            const data = await response.json();

            if (response.ok) {
                const userData = {
                    id: data.data.user._id,
                    name: data.data.user.name,
                    email: data.data.user.email,
                    profession: data.data.user.profession,
                    company: data.data.user.company,
                    avatar: data.data.user.avatar,
                    token: data.token
                };

                localStorage.setItem('sidrayyAuraUser', JSON.stringify(userData));
                this.currentUser = userData;
                
                this.showMessage('Account created successfully!', 'success');
                setTimeout(() => {
                    this.showFeed();
                    this.updateNavigation();
                }, 1000);
            } else {
                this.showMessage(data.message || 'Registration failed.', 'error');
            }
        } catch (error) {
            console.error('Registration error:', error);
            this.showMessage('Network error. Please try again.', 'error');
        }
    }

    showMessage(message, type = 'info') {
        const messageContainer = document.getElementById('messageContainer');
        if (!messageContainer) return;

        if (type === 'loading') {
            messageContainer.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    <div>${message}</div>
                </div>
            `;
        } else {
            const alertClass = type === 'success' ? 'alert-success' : 
                             type === 'error' ? 'alert-error' : 'alert-info';
            messageContainer.innerHTML = `<div class="alert ${alertClass}">${message}</div>`;
        }
    }

    async showFeed() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="feed-container">
                <div class="feed-header fade-in">
                    <h2>Welcome, ${this.currentUser?.name || 'Professional'}!</h2>
                    <p>Share your professional updates and connect with others</p>
                </div>

                <div class="post-form-card fade-in">
                    <textarea class="post-textarea" placeholder="Share your professional updates..." id="postContent"></textarea>
                    
                    <div class="image-upload-section">
                        <input type="file" id="imageUpload" accept="image/*" style="display: none;">
                        <button type="button" onclick="document.getElementById('imageUpload').click()" class="btn btn-secondary">
                            📷 Add Image
                        </button>
                        <span id="fileName" style="margin-left: 1rem; color: var(--text-gray); font-size: 0.9rem;"></span>
                    </div>

                    <div class="post-preview" id="imagePreview" style="display: none; margin-top: 1rem;">
                        <img id="previewImage" style="max-width: 200px; max-height: 200px; border-radius: 10px; border: 2px solid var(--border-dark);">
                        <button type="button" onclick="app.removeImage()" class="btn btn-secondary" style="margin-left: 1rem;">❌ Remove</button>
                    </div>

                    <button onclick="app.createPost()" class="btn btn-primary" style="margin-top: 1rem;">Publish Update</button>
                </div>

                <div class="posts-container" id="postsContainer">
                    <div class="loading">
                        <div class="spinner"></div>
                        <div>Loading your professional feed...</div>
                    </div>
                </div>
            </div>
        `;

        // Setup image upload preview
        this.setupImageUpload();
        await this.loadPosts();
    }

    setupImageUpload() {
        const imageUpload = document.getElementById('imageUpload');
        const fileName = document.getElementById('fileName');
        const imagePreview = document.getElementById('imagePreview');
        const previewImage = document.getElementById('previewImage');

        imageUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                fileName.textContent = file.name;
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImage.src = e.target.result;
                    imagePreview.style.display = 'flex';
                    imagePreview.style.alignItems = 'center';
                }
                reader.readAsDataURL(file);
            }
        });
    }

    removeImage() {
        const imageUpload = document.getElementById('imageUpload');
        const fileName = document.getElementById('fileName');
        const imagePreview = document.getElementById('imagePreview');
        
        imageUpload.value = '';
        fileName.textContent = '';
        imagePreview.style.display = 'none';
    }

    async loadPosts() {
        try {
            const response = await fetch(`${this.API_BASE}/posts`);
            const data = await response.json();

            if (response.ok && data.data && data.data.posts) {
                this.posts = data.data.posts;
                this.displayPosts(this.posts);
            } else {
                this.displayDemoPosts();
            }
        } catch (error) {
            console.error('Error loading posts:', error);
            this.displayDemoPosts();
        }
    }

    displayPosts(posts) {
        const postsContainer = document.getElementById('postsContainer');
        
        if (!posts || posts.length === 0) {
            postsContainer.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--text-gray);">
                    <h3>No posts yet</h3>
                    <p>Be the first to share something!</p>
                </div>
            `;
            return;
        }

        postsContainer.innerHTML = posts.map(post => `
            <div class="post-card fade-in">
                <div class="post-header">
                    <div class="user-avatar">${post.author?.avatar || '👤'}</div>
                    <div class="user-info">
                        <h4>${post.author?.name || 'User'}</h4>
                        <div class="user-profession">${post.author?.profession || 'Professional'}</div>
                        <div class="post-time">${new Date(post.createdAt).toLocaleString()}</div>
                    </div>
                </div>
                
                ${post.content ? `
                    <div class="post-content">
                        ${post.content.replace(/\n/g, '<br>')}
                    </div>
                ` : ''}
                
                ${post.image ? `
                    <div class="post-image" style="margin: 1rem 0;">
                        <img src="${post.image}" alt="Post image" style="max-width: 100%; border-radius: 10px; border: 2px solid var(--border-dark);">
                    </div>
                ` : ''}
                
                <div class="post-stats">
                    <div class="stat ${post.likes?.includes(this.currentUser?.id) ? 'active' : ''}" 
                         onclick="app.likePost('${post._id}')">
                        <span>❤️</span>
                        <span>${post.likes?.length || 0}</span>
                    </div>
                    <div class="stat" onclick="app.showComments('${post._id}')">
                        <span>💬</span>
                        <span>${post.comments?.length || 0}</span>
                    </div>
                    <div class="stat">
                        <span>👁️</span>
                        <span>${post.shares?.length || 0}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    displayDemoPosts() {
        const postsContainer = document.getElementById('postsContainer');
        postsContainer.innerHTML = `
            <div class="post-card fade-in">
                <div class="post-header">
                    <div class="user-avatar">🌟</div>
                    <div class="user-info">
                        <h4>SidrayyAura Team</h4>
                        <div class="user-profession">Welcome to your network</div>
                        <div class="post-time">Just now</div>
                    </div>
                </div>
                <div class="post-content">
                    🎉 Welcome to SidrayyAura! Create your first post and start connecting with professionals.
                </div>
                <div class="post-stats">
                    <div class="stat active" onclick="app.likePost('demo1')">
                        <span>❤️</span>
                        <span>5</span>
                    </div>
                    <div class="stat" onclick="app.showComments('demo1')">
                        <span>💬</span>
                        <span>2</span>
                    </div>
                    <div class="stat">
                        <span>👁️</span>
                        <span>1</span>
                    </div>
                </div>
            </div>
        `;
    }

    async createPost() {
        const textarea = document.querySelector('.post-textarea');
        const content = textarea.value.trim();
        const imageUpload = document.getElementById('imageUpload');
        
        if (!content && !imageUpload.files[0]) {
            this.showMessage('Please write something or add an image to post!', 'error');
            return;
        }

        this.showMessage('Publishing your post...', 'loading');

        try {
            const formData = new FormData();
            formData.append('content', content);
            formData.append('userId', this.currentUser?.id);
            
            if (imageUpload.files[0]) {
                formData.append('image', imageUpload.files[0]);
            }

            const response = await fetch(`${this.API_BASE}/posts`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                textarea.value = '';
                this.removeImage();
                this.showMessage('Post published successfully! 🎉', 'success');
                await this.loadPosts();
            } else {
                this.showMessage(data.message || 'Failed to create post', 'error');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            this.showMessage('Network error. Please try again.', 'error');
        }
    }

    async likePost(postId) {
        try {
            const response = await fetch(`${this.API_BASE}/posts/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: this.currentUser?.id || '1'
                })
            });

            if (response.ok) {
                const data = await response.json();
                this.showMessage(data.data.liked ? 'Post liked! ❤️' : 'Post unliked', 'success');
                await this.loadPosts();
            }
        } catch (error) {
            console.error('Error liking post:', error);
            this.showMessage('Error liking post', 'error');
        }
    }

    showComments(postId) {
        const post = this.posts.find(p => p._id === postId);
        if (!post) return;

        const commentsHTML = post.comments && post.comments.length > 0 ? 
            post.comments.map(comment => `
                <div class="comment-item">
                    <div class="comment-header">
                        <div class="user-avatar small">${comment.user?.avatar || '👤'}</div>
                        <div class="comment-user">
                            <strong>${comment.user?.name || 'User'}</strong>
                            <span class="comment-time">${new Date(comment.createdAt).toLocaleString()}</span>
                        </div>
                    </div>
                    <div class="comment-content">${comment.content}</div>
                </div>
            `).join('') : 
            '<p class="no-comments">No comments yet. Be the first to comment!</p>';

        const modalHTML = `
            <div class="modal-overlay" id="commentsModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Comments</h3>
                        <button onclick="app.closeModal()" class="close-btn">&times;</button>
                    </div>
                    <div class="comments-list">
                        ${commentsHTML}
                    </div>
                    <div class="comment-form">
                        <textarea id="commentText" placeholder="Write a comment..." rows="3"></textarea>
                        <button onclick="app.addComment('${postId}')" class="btn btn-primary">Post Comment</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    async addComment(postId) {
        const commentText = document.getElementById('commentText').value.trim();
        if (!commentText) return;

        try {
            const response = await fetch(`${this.API_BASE}/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: commentText,
                    userId: this.currentUser?.id || '1'
                })
            });

            if (response.ok) {
                this.closeModal();
                this.showMessage('Comment added successfully!', 'success');
                await this.loadPosts();
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            this.showMessage('Error adding comment', 'error');
        }
    }

    closeModal() {
        const modal = document.getElementById('commentsModal');
        if (modal) modal.remove();
    }

    
showProfile() {
    window.location.href = '/profile.html';
}

    logout() {
        localStorage.removeItem('sidrayyAuraUser');
        this.currentUser = null;
        this.posts = [];
        this.showWelcome();
        this.updateNavigation();
        this.showMessage('Signed out successfully', 'success');
    }
}



// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    window.app = new SidrayyAura();
});

