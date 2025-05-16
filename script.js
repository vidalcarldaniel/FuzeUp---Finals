function goToIndex() {
    window.location.href = "index.html";
}

function goToSignup() {
    window.location.href = "signUp.html";
}

function goToLogin() {
    window.location.href = "logIn.html";
}

function goToDashBoard() {
    window.location.href = "dashboard.html";
}

function goToFriendReq() {
    window.location.href = "friendReq.html";
}

function goToNotification() {
    window.location.href = "notification.html";
}

function goToPage() {
    window.location.href = "pages.html";
}

function goToProfile() {
    window.location.href = "profile.html";
}

function goToContact() {
    window.location.href = "contact.html";
}

function logout() {
    sessionStorage.clear();
    window.location.href = "index.html";
}

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('postModal');
    const openModal = document.getElementById('openModal');
    const closeModal = document.getElementById('closeModal');
    const postTypeButtons = document.querySelectorAll('.postTypeButton');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const submitPost = document.getElementById('submitPost');
    const feedsContainer = document.getElementById('feeds');
    const captionInput = document.getElementById('caption');
    const uploadFileInput = document.getElementById('uploadFile');

    let selectedPostType = null;

    // Open modal (if modal exists)
    if (openModal && modal) {
        openModal.addEventListener('click', () => {
            modal.classList.remove('hidden');
        });
    }

    // Close modal (if modal exists)
    if (closeModal && modal) {
        closeModal.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }

    // Close modal when clicking outside of it (if modal exists)
    if (modal) {
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }

    // Handle post type button clicks (if buttons exist)
    if (postTypeButtons) {
        postTypeButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove 'active' class from all buttons
                postTypeButtons.forEach(btn => btn.classList.remove('active'));

                // Add 'active' class to the clicked button
                button.classList.add('active');

                // Set the selected post type
                selectedPostType = button.getAttribute('data-type');
                console.log(`Selected Post Type: ${selectedPostType}`);
            });
        });
    }

    // Toggle dropdown menu on hamburger menu click
    if (hamburgerMenu && dropdownMenu) {
        hamburgerMenu.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent click from propagating to the window
            dropdownMenu.classList.toggle('hidden');
        });

        // Close dropdown menu when clicking outside
        window.addEventListener('click', (event) => {
            if (!dropdownMenu.contains(event.target) && event.target !== hamburgerMenu) {
                dropdownMenu.classList.add('hidden');
            }
        });
    }

    // Submit post (if modal and submitPost button exist)
    if (submitPost && modal) {
        submitPost.addEventListener('click', () => {
            const caption = captionInput.value.trim();
            const file = uploadFileInput.files[0];

            if (!caption && !file) {
                alert('Please add a caption or upload a file.');
                return;
            }

            // Create a new feed item
            const feedItem = document.createElement('div');
            feedItem.className = 'feed-item bg-black border border-[#DCC681] rounded-lg p-4 mb-4';

            // User info
            const userInfo = `
                <div class="flex justify-between items-center mb-4">
                    <div class="flex items-center">
                        <img src="images/user-profile.png" alt="User Profile" class="w-12 h-12 rounded-full mr-4">
                        <p class="text-[#DCC681] font-bold text-sm">John Doe</p>
                    </div>
                    <p class="text-xs text-gray-400">Just now</p>
                </div>
            `;

            // Post caption
            const postCaption = `<p class="text-[#DCC681] mb-4">${caption}</p>`;

            // Post content
            let postContent = '';
            if (file) {
                const fileURL = URL.createObjectURL(file);
                if (file.type.startsWith('image/')) {
                    postContent = `<img src="${fileURL}" alt="Post Image" class="w-full rounded-lg">`;
                } else if (file.type.startsWith('video/')) {
                    postContent = `
                        <video controls class="w-full rounded-lg">
                            <source src="${fileURL}" type="${file.type}">
                            Your browser does not support the video tag.
                        </video>
                    `;
                }
            }

            // Post actions with counters
            const postActions = `
                <div class="flex justify-around text-[#DCC681] text-2xl mt-4">
                    <div class="like-section">
                        <i class='bx bx-like cursor-pointer hover:text-white' onclick="likePost(this)"></i>
                        <span class="like-count text-sm ml-2">0</span>
                    </div>
                    <div class="comment-section">
                        <i class='bx bx-comment cursor-pointer hover:text-white' onclick="commentPost(this)"></i>
                        <span class="comment-count text-sm ml-2">0</span>
                    </div>
                    <div class="share-section">
                        <i class='bx bx-share cursor-pointer hover:text-white' onclick="sharePost(this)"></i>
                        <span class="share-count text-sm ml-2">0</span>
                    </div>
                </div>
            `;

            // Combine all parts and append to the feed container
            feedItem.innerHTML = userInfo + postCaption + postContent + postActions;
            feedsContainer.prepend(feedItem);

            // Clear inputs and close modal
            captionInput.value = '';
            uploadFileInput.value = '';
            modal.classList.add('hidden');
        });
    }

});

// Example functions for post actions
function likePost(element) {
    const likeIcon = element;
    const likeCount = likeIcon.nextElementSibling;

    if (!likeIcon.classList.contains('liked')) {
        likeIcon.classList.add('liked', 'text-white'); // Change color to indicate liked
        likeCount.textContent = parseInt(likeCount.textContent) + 1;
    } else {
        alert('You have already liked this post.');
    }
}

function updateCommentCount(commentCountClass) {
    const commentCountElement = document.querySelector(`.${commentCountClass}`);
    const commentsContainer = document.querySelector('.comments-container');
    if (commentCountElement && commentsContainer) {
        commentCountElement.textContent = commentsContainer.children.length;
    }
}

function likeComment(element) {
    const likeIcon = element;
    const likeCount = likeIcon.nextElementSibling;

    if (!likeIcon.classList.contains('liked')) {
        likeIcon.classList.add('liked', 'text-white'); // Change color to indicate liked
        likeCount.textContent = parseInt(likeCount.textContent) + 1;
    } else {
        alert('You have already liked this comment.');
    }
}

function sharePost(element) {
    const shareIcon = element;
    const shareCount = shareIcon.nextElementSibling;

    if (!shareIcon.classList.contains('shared')) {
        const shareModal = document.createElement('div');
        shareModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        shareModal.innerHTML = `
            <div class="bg-black border border-[#DCC681] rounded-lg p-6 w-4/5 max-w-lg shadow-lg">
                <span class="text-[#DCC681] text-2xl font-bold cursor-pointer float-right hover:text-white" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <h3 class="text-lg font-bold mb-4">Share Post</h3>
                <textarea class="w-full p-3 border border-[#DCC681] rounded bg-transparent text-[#DCC681] focus:outline-none focus:border-white" placeholder="Add a caption..."></textarea>
                <button class="w-full py-2 px-4 mt-4 bg-[#DCC681] text-black rounded hover:bg-white transition" onclick="confirmShare(this)">Share</button>
            </div>
        `;
        document.body.appendChild(shareModal);
        shareIcon.classList.add('shared');
        shareCount.textContent = parseInt(shareCount.textContent) + 1;
    } else {
        alert('You have already shared this post.');
    }
}

function confirmShare(button) {
    alert('Post shared successfully!');
    button.parentElement.parentElement.remove(); // Close the share modal
}