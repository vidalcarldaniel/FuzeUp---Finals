document.addEventListener('DOMContentLoaded', () => {
    const submitPost = document.getElementById('submitPost');
    const modal = document.getElementById('postModal');
    const feedsContainer = document.getElementById('feeds');
    const captionInput = document.getElementById('caption');
    const uploadFileInput = document.getElementById('uploadFile');
    const postTypeButtons = document.querySelectorAll('.postTypeButton');

    let selectedType = 'TEXT'; // Default

    // Highlight selected post type button and set selectedType
    postTypeButtons.forEach((btn, idx) => {
        btn.addEventListener('click', function () {
            postTypeButtons.forEach(b => {
                b.classList.remove('bg-[#DCC681]', 'text-black');
                b.classList.add('bg-black', 'text-[#DCC681]');
            });
            this.classList.remove('bg-black', 'text-[#DCC681]');
            this.classList.add('bg-[#DCC681]', 'text-black');
            selectedType = this.textContent.trim();

            // Enable/disable file input based on type
            if (selectedType === 'TEXT') {
                uploadFileInput.value = '';
                uploadFileInput.disabled = true;
                uploadFileInput.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                uploadFileInput.disabled = false;
                uploadFileInput.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        });
    });

    // Set initial state for file input
    uploadFileInput.disabled = true;
    uploadFileInput.classList.add('opacity-50', 'cursor-not-allowed');

    if (submitPost && modal) {
        submitPost.addEventListener('click', () => {
            const caption = captionInput.value.trim();
            const file = uploadFileInput.files[0];
            const currentUser = JSON.parse(localStorage.getItem('user')); // <-- Get logged-in user

            // Validation based on selected type
            if (selectedType === 'TEXT') {
                if (!caption) {
                    alert('Please add a caption.');
                    return;
                }
            } else if (selectedType === 'IMAGE' || selectedType === 'VIDEO') {
                if (!file) {
                    alert('Please upload a file.');
                    return;
                }
                if (selectedType === 'IMAGE' && !file.type.startsWith('image/')) {
                    alert('Please upload an image file.');
                    return;
                }
                if (selectedType === 'VIDEO' && !file.type.startsWith('video/')) {
                    alert('Please upload a video file.');
                    return;
                }
            }

            const now = new Date();
            const dateString = now.toLocaleString();

            const feedItem = document.createElement('div');
            feedItem.className = 'feed-item bg-black border border-[#DCC681] rounded-lg p-4 mb-4 relative';

            // Use logged-in user's info
            const userInfo = `
                <div class="flex justify-between items-center mb-4">
                    <div class="flex items-center">
                        <img src="${currentUser && currentUser.profile_picture ? currentUser.profile_picture : 'images/user-profile.png'}" alt="User Profile" class="w-12 h-12 rounded-full mr-4">
                        <p class="text-[#DCC681] font-bold text-sm">${currentUser ? currentUser.first_name + ' ' + currentUser.last_name : 'Unknown User'}</p>
                    </div>
                    <p class="text-xs text-gray-400">${dateString}</p>
                </div>
            `;
            const postCaption = caption ? `<p class="text-[#DCC681] mb-4">${caption}</p>` : '';
            let postContent = '';
            if (file && selectedType === 'IMAGE') {
                const fileURL = URL.createObjectURL(file);
                postContent = `<img src="${fileURL}" alt="Post Image" class="w-full rounded-lg">`;
            } else if (file && selectedType === 'VIDEO') {
                const fileURL = URL.createObjectURL(file);
                postContent = `
                    <video controls class="w-full rounded-lg">
                        <source src="${fileURL}" type="${file.type}">
                        Your browser does not support the video tag.
                    </video>
                `;
            }
            const postActions = `
                <div class="flex justify-around text-[#DCC681] text-2xl mt-4 border-t border-[#DCC681] pt-4">
                    <div class="like-section">
                        <i class='bx bx-star cursor-pointer hover:text-white' onclick="likePost(this)"></i>
                        <span class="like-count text-sm ml-2">0</span>
                    </div>
                    <div class="comment-section">
                        <i class='bx bx-comment cursor-pointer hover:text-white' onclick="toggleCommentDropdown(this)"></i>
                        <span class="comment-count text-sm ml-2">0</span>
                    </div>
                    <div class="share-section">
                        <i class='bx bx-share cursor-pointer hover:text-white' onclick="sharePost(this)"></i>
                        <span class="share-count text-sm ml-2">0</span>
                    </div>
                </div>
                <!-- Comment Dropdown -->
                <div class="comment-dropdown hidden absolute bg-black border border-[#DCC681] rounded-lg p-4 w-96 mt-2 z-40 right-0">
                    <div class="comments-list space-y-4"></div>
                    <div class="flex items-center mt-4">
                        <input type="text" class="comment-input flex-1 p-2 rounded-full bg-transparent border border-[#DCC681] text-[#DCC681] mr-2" placeholder="Write a comment...">
                        <i class='bx bx-microphone text-2xl mr-2 cursor-pointer'></i>
                        <i class='bx bx-send text-2xl cursor-pointer send-comment'></i>
                    </div>
                </div>
            `;
            feedItem.innerHTML = userInfo + postCaption + postContent + postActions;
            feedsContainer.prepend(feedItem);

            captionInput.value = '';
            uploadFileInput.value = '';
            modal.classList.add('hidden');
        });
    }
});