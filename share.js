function sharePost(element) {
    const shareIcon = element;
    const shareCount = shareIcon.nextElementSibling;
    const feedItem = shareIcon.closest('.feed-item'); // Get the specific post to share

    // Store the post being shared in a global variable
    window.selectedPostToShare = feedItem;
    window.selectedShareCountElem = shareCount; // Pass shareCount to the confirm function

    const shareModal = document.createElement('div');
    shareModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    shareModal.innerHTML = `
        <div class="bg-black border border-[#DCC681] rounded-lg p-6 w-4/5 max-w-lg shadow-lg">
            <span class="text-[#DCC681] text-2xl font-bold cursor-pointer float-right hover:text-white" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h3 class="text-lg font-bold mb-4">Share Post</h3>
            <textarea class="w-full p-3 border border-[#DCC681] rounded bg-transparent text-[#DCC681] focus:outline-none focus:border-white" placeholder="Add a caption..."></textarea>
            <button class="w-full py-2 px-4 mt-4 bg-[#DCC681] text-black rounded hover:bg-white transition" onclick="confirmShareAndRepost(this)">Share</button>
        </div>
    `;
    document.body.appendChild(shareModal);
    // Removed: shareCount.textContent = parseInt(shareCount.textContent) + 1;
}

function confirmShareAndRepost(button) {
    const modal = button.closest('.fixed');
    const caption = modal.querySelector('textarea').value.trim();

    // Use the globally stored selected post
    const originalPost = window.selectedPostToShare;
    const shareCountElem = window.selectedShareCountElem;
    if (originalPost) {
        // Get current user info (the one sharing)
        const user = JSON.parse(localStorage.getItem('user'));
        const profileUrl = user && user.profile_url ? user.profile_url : 'images/user-profile.png';
        const username = user && user.first_name && user.last_name
            ? `${user.first_name} ${user.last_name}`
            : 'Unknown User';
        const now = new Date();
        const dateString = now.toLocaleString();

        // Clone the original post
        const clone = originalPost.cloneNode(true);

        // Remove any previous "shared by" info to avoid stacking
        const prevSharedBy = clone.querySelector('.shared-by-info');
        if (prevSharedBy) {
            prevSharedBy.remove();
        }

        // --- Insert "Shared by" info above the post ---
        const sharedByDiv = document.createElement('div');
        sharedByDiv.className = "shared-by-info flex flex-col mb-2";
        sharedByDiv.innerHTML = `
            <div class="flex justify-between items-center">
                <div class="flex items-center">
                    <img src="${profileUrl}" alt="User Profile" class="w-12 h-12 rounded-full mr-4">
                    <span class="text-[#DCC681] font-bold text-xs">${username}</span>
                </div>
                <span class="text-xs text-gray-400">${dateString}</span>
            </div>
        `;

        // --- Insert user's caption if provided, below the sharer's profile/name ---
        if (caption) {
            const userCaption = document.createElement('p');
            userCaption.className = "text-[#DCC681] mb-4 mt-2"; // margin-bottom to avoid overlap
            userCaption.textContent = caption;
            sharedByDiv.appendChild(userCaption);
        }

        // Insert the sharedByDiv above the post
        clone.insertBefore(sharedByDiv, clone.firstChild);

        // Reset like, comment, and share counts to 0
        const likeCount = clone.querySelector('.like-count');
        if (likeCount) likeCount.textContent = "0";
        const commentCount = clone.querySelector('.comment-count');
        if (commentCount) commentCount.textContent = "0";
        const shareCount = clone.querySelector('.share-count');
        if (shareCount) shareCount.textContent = "0";

        // Remove all comments from the comment list
        const commentsList = clone.querySelector('.comments-list');
        if (commentsList) commentsList.innerHTML = "";

        // Optionally, remove any "shared" class from the share icon
        const shareIcon = clone.querySelector('.bx-share');
        if (shareIcon) {
            shareIcon.classList.remove('shared');
        }

        // Prepend the cloned post to the feeds container
        const feedsContainer = document.getElementById('feeds');
        if (feedsContainer) {
            feedsContainer.prepend(clone);
        }

        // Only increment the share counter when the post is actually shared
        if (shareCountElem) {
            shareCountElem.textContent = parseInt(shareCountElem.textContent) + 1;
        }
    }
    alert('Post shared successfully!');
    modal.remove();

    // Clean up the global variable
    window.selectedPostToShare = null;
    window.selectedShareCountElem = null;
}