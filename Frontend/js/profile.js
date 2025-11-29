// Profile Page JavaScript
class ProfileApp {
    constructor() {
        this.currentUser = null;
        this.userPosts = [];
        this.API_BASE = 'http://localhost:5000/api';
        this.init();
    }

    init() {
        console.log('🌟 Profile page loading...');
        this.checkAuthStatus();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Edit profile button
        document.addEventListener('click', (e) => {
            if (e.target.id === 'editProfileBtn') {
                this.showEditForm();
            }
            if (e.target.id === 'saveProfileBtn') {
                this.updateProfile();
            }
            if (e.target.id === 'cancelEditBtn') {
                this.showProfile();
            }
        });
    }

    checkAuthStatus() {
        const userData = localStorage.getItem('sidrayyAuraUser');
        
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.showProfile();
            this.loadUserPosts();
        } else {
            // Redirect to login if not authenticated
            window.location.href = '/';
        }
    }

    async showProfile() {
        const profileApp = document.getElementById('profileApp');
        
        profileApp.innerHTML = `
            <div class="profile-container fade-in">
                <!-- Profile Header -->
                <div class="profile-header-card">
                    <div class="profile-cover">
                        <div class="cover-gradient"></div>
                    </div>
                    <div class="profile-info">
                        <div class="profile-avatar-large">
                            ${this.currentUser.avatar || '👤'}
                        </div>
                        <div class="profile-details">
                            <h1 class="profile-name">${this.currentUser.name}</h1>
                            <p class="profile-profession">${this.currentUser.profession}</p>
                            <p class="profile-company">${this.currentUser.company}</p>
                           <div class="profile-stats">
    <div class="profile-stat">
        <span class="stat-number" id="postsCount">0</span>
        <span class="stat-label">Posts</span>
    </div>
</div>
                        </div>
                        <button id="editProfileBtn" class="btn btn-primary">
                            ✏️ Edit Profile
                        </button>
                    </div>
                </div>

                <!-- Bio Section -->
                <div class="profile-section">
                    <h3>About</h3>
                    <div class="bio-content">
                        <p>${this.currentUser.bio || 'No bio added yet.'}</p>
                        <div class="profile-details-grid">
    <div class="detail-item">
        <span class="detail-label">📍 Location:</span>
        <span class="detail-value">${this.currentUser.location || 'Not specified'}</span>
    </div>
    <div class="detail-item">
        <span class="detail-label">📅 Member since:</span>
        <span class="detail-value">${new Date(this.currentUser.createdAt).toLocaleDateString()}</span>
    </div>
</div>
                    </div>
                </div>

                <!-- User Posts Section -->
                <div class="profile-section">
                    <h3>My Posts</h3>
                    <div class="user-posts" id="userPostsContainer">
                        <div class="loading">
                            <div class="spinner"></div>
                            <div>Loading your posts...</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    showEditForm() {
    const profileApp = document.getElementById('profileApp');
    
    profileApp.innerHTML = `
        <div class="profile-container fade-in">
            <div class="form-card">
                <div class="form-header">
                    <h2>Edit Profile</h2>
                    <p>Update your information</p>
                </div>
                <div class="form-body">
                    <div id="messageContainer"></div>
                    <form id="editProfileForm">
                        <div class="form-group">
                            <label class="form-label">Full Name</label>
                            <input type="text" class="form-input" id="editName" value="${this.currentUser.name}" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Profession</label>
                            <input type="text" class="form-input" id="editProfession" value="${this.currentUser.profession}" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Location</label>
                            <input type="text" class="form-input" id="editLocation" value="${this.currentUser.location || ''}" placeholder="Enter your location">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Bio</label>
                            <textarea class="form-input" id="editBio" rows="4" placeholder="Tell us about yourself...">${this.currentUser.bio || ''}</textarea>
                        </div>
                        <div class="form-actions">
                            <button type="button" id="cancelEditBtn" class="btn btn-secondary">Cancel</button>
                            <button type="button" id="saveProfileBtn" class="btn btn-primary">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}

    async updateProfile() {
    try {
        // Get form values
        const name = document.getElementById('editName').value.trim();
        const profession = document.getElementById('editProfession').value.trim();
        const location = document.getElementById('editLocation').value.trim();
        const bio = document.getElementById('editBio').value.trim();

        console.log('🔄 UPDATE PROFILE STARTED');
        console.log('📝 Form Data:', { name, profession, location, bio });

        // Show loading
        this.showMessage('Updating profile...', 'loading');

        // Prepare data - COMPANY AUR WEBSITE REMOVE KARDI
        const updateData = {
            name: name,
            profession: profession,
            location: location,
            bio: bio
        };

        console.log('📤 Sending to server:', updateData);

        // API call
        const response = await fetch(`${this.API_BASE}/users/${this.currentUser.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData)
        });

        console.log('📥 Response Status:', response.status);

        const result = await response.json();
        console.log('📥 Response Data:', result);

        if (response.ok && result.status === 'success') {
            // SUCCESS
            console.log('✅ Profile update successful');
            
            // Update local storage
            localStorage.setItem('sidrayyAuraUser', JSON.stringify(result.data.user));
            this.currentUser = result.data.user;
            
            this.showMessage('✅ Profile updated successfully!', 'success');
            
            // Refresh profile after 2 seconds
            setTimeout(() => {
                this.showProfile();
            }, 2000);
            
        } else {
            // ERROR
            console.error('❌ Profile update failed:', result.message);
            this.showMessage(`❌ ${result.message || 'Failed to update profile'}`, 'error');
        }

    } catch (error) {
        console.error('💥 NETWORK ERROR:', error);
        this.showMessage('❌ Network error. Please check console and try again.', 'error');
    }
}

    async loadUserPosts() {
        try {
            const response = await fetch(`${this.API_BASE}/posts`);
            const data = await response.json();

            if (response.ok && data.data && data.data.posts) {
                // Filter posts by current user
                this.userPosts = data.data.posts.filter(post => 
                    post.author._id === this.currentUser.id
                );
                
                // Update posts count
                document.getElementById('postsCount').textContent = this.userPosts.length;
                this.displayUserPosts();
            }
        } catch (error) {
            console.error('Error loading user posts:', error);
            this.displayNoPosts();
        }
    }

    displayUserPosts() {
        const postsContainer = document.getElementById('userPostsContainer');
        
        if (this.userPosts.length === 0) {
            this.displayNoPosts();
            return;
        }

        postsContainer.innerHTML = this.userPosts.map(post => `
            <div class="user-post-card">
                <div class="post-content">
                    ${post.content ? `
                        <div class="post-text">
                            ${post.content.replace(/\n/g, '<br>')}
                        </div>
                    ` : ''}
                    
                    ${post.image ? `
                        <div class="post-image">
                            <img src="${post.image}" alt="Post image">
                        </div>
                    ` : ''}
                </div>
                <div class="post-meta">
                    <span class="post-time">${new Date(post.createdAt).toLocaleString()}</span>
                    <div class="post-stats-small">
                        <span>❤️ ${post.likes?.length || 0}</span>
                        <span>💬 ${post.comments?.length || 0}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    displayNoPosts() {
        const postsContainer = document.getElementById('userPostsContainer');
        postsContainer.innerHTML = `
            <div class="no-posts">
                <div class="no-posts-icon">📝</div>
                <h4>No posts yet</h4>
                <p>Share your first post to get started!</p>
                <button onclick="app.goToFeed()" class="btn btn-primary">Create Post</button>
            </div>
        `;
    }

    showMessage(message, type = 'info') {
        let messageContainer = document.getElementById('messageContainer');
        if (!messageContainer) {
            // Create message container if it doesn't exist
            const formBody = document.querySelector('.form-body');
            if (formBody) {
                messageContainer = document.createElement('div');
                messageContainer.id = 'messageContainer';
                formBody.insertBefore(messageContainer, formBody.firstChild);
            } else {
                return;
            }
        }

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

    goToFeed() {
        window.location.href = '/';
    }

    logout() {
        localStorage.removeItem('sidrayyAuraUser');
        window.location.href = '/';
    }
}

// Initialize profile app
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ProfileApp();
});