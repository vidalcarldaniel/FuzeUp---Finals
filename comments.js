// comment.js

let currentCommentFeedItem = null;

function createCommentModal() {
    if (document.getElementById('commentModal')) return;
    const modal = document.createElement('div');
    modal.id = 'commentModal';
    modal.className = 'hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-black border border-[#DCC681] rounded-lg p-6 w-96 max-w-lg shadow-lg relative">
            <span id="closeCommentModal" class="absolute top-2 right-4 text-[#DCC681] text-2xl font-bold cursor-pointer hover:text-white">&times;</span>
            <h3 class="text-lg font-bold mb-4">Comments</h3>
            <div class="comments-list space-y-4 mb-4"></div>
            <div class="flex items-center mt-4">
                <input type="text" class="comment-input flex-1 p-2 rounded-full bg-transparent border border-[#DCC681] text-[#DCC681] mr-2" placeholder="Write a comment...">
                <i class='bx bx-microphone text-2xl mr-2 cursor-pointer'></i>
                <i class='bx bx-send text-2xl cursor-pointer send-comment'></i>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('closeCommentModal').onclick = function() {
        modal.classList.add('hidden');
        currentCommentFeedItem = null;
    };
}
createCommentModal();

function toggleCommentDropdown(icon) {
    createCommentModal();
    const feedItem = icon.closest('.feed-item');
    currentCommentFeedItem = feedItem;
    const feedComments = feedItem.querySelector('.comments-list');
    const modal = document.getElementById('commentModal');
    const modalComments = modal.querySelector('.comments-list');
    modalComments.innerHTML = feedComments ? feedComments.innerHTML : '';
    updateCommentCountForFeedItem(feedItem, modalComments);
    modal.querySelector('.comment-input').value = '';
    modal.classList.remove('hidden');
}

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('send-comment')) {
        const modal = document.getElementById('commentModal');
        if (!modal.classList.contains('hidden')) {
            const input = modal.querySelector('.comment-input');
            const commentsList = modal.querySelector('.comments-list');
            const commentText = input.value.trim();
            if (!commentText) return;
            const userProfile = document.getElementById('profileImage') ? document.getElementById('profileImage').src : 'images/user-profile.png';
            const userName = document.getElementById('userName') ? document.getElementById('userName').textContent : 'John Doe';
            const now = new Date();
            const dateTime = now.toLocaleString();
            const commentHTML = `
                <div class="flex items-start space-x-3">
                    <img src="${userProfile}" alt="User" class="w-10 h-10 rounded-full">
                    <div>
                        <div class="flex items-center space-x-2">
                            <span class="font-bold text-[#DCC681]">${userName}</span>
                            <span class="text-xs text-gray-400">${dateTime}</span>
                        </div>
                        <div class="text-[#DCC681] mb-1">${commentText}</div>
                        <div class="flex items-center">
                            <i class='bx bx-like cursor-pointer hover:text-white comment-like-btn'></i>
                            <span class="comment-like-count text-sm ml-2">0</span>
                        </div>
                    </div>
                </div>
            `;
            commentsList.insertAdjacentHTML('beforeend', commentHTML);
            if (currentCommentFeedItem) {
                const feedComments = currentCommentFeedItem.querySelector('.comments-list');
                if (feedComments) {
                    feedComments.innerHTML = commentsList.innerHTML;
                }
                updateCommentCountForFeedItem(currentCommentFeedItem, commentsList);
            }
            input.value = '';
        }
    }
});

let mediaRecorder;
let audioChunks = [];
let isRecording = false;

document.addEventListener('click', async function(e) {
    if (e.target.classList.contains('bx-microphone')) {
        const micIcon = e.target;
        const input = micIcon.closest('.flex').querySelector('.comment-input');
        // Remove any existing tooltip
        const oldTooltip = micIcon.parentNode.querySelector('.mic-tooltip');
        if (oldTooltip) oldTooltip.remove();

        if (!isRecording) {
            // Start recording
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                alert('Audio recording is not supported in this browser.');
                return;
            }
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                audioChunks = [];
                mediaRecorder.ondataavailable = event => {
                    if (event.data.size > 0) {
                        audioChunks.push(event.data);
                    }
                };
                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                    const audioURL = URL.createObjectURL(audioBlob);
                    // Insert audio player as a comment
                    const userProfile = document.getElementById('profileImage') ? document.getElementById('profileImage').src : 'images/user-profile.png';
                    const userName = document.getElementById('userName') ? document.getElementById('userName').textContent : 'John Doe';
                    const now = new Date();
                    const dateTime = now.toLocaleString();
                    const commentHTML = `
                        <div class="flex items-start space-x-3">
                            <img src="${userProfile}" alt="User" class="w-10 h-10 rounded-full">
                            <div>
                                <div class="flex items-center space-x-2">
                                    <span class="font-bold text-[#DCC681]">${userName}</span>
                                    <span class="text-xs text-gray-400">${dateTime}</span>
                                </div>
                                <audio controls src="${audioURL}" class="mb-1"></audio>
                                <div class="flex items-center">
                                    <i class='bx bx-star cursor-pointer hover:text-white comment-like-btn'></i>
                                    <span class="comment-like-count text-sm ml-2">0</span>
                                </div>
                            </div>
                        </div>
                    `;
                    const modal = document.getElementById('commentModal');
                    const commentsList = modal.querySelector('.comments-list');
                    commentsList.insertAdjacentHTML('beforeend', commentHTML);
                    if (currentCommentFeedItem) {
                        const feedComments = currentCommentFeedItem.querySelector('.comments-list');
                        if (feedComments) {
                            feedComments.innerHTML = commentsList.innerHTML;
                        }
                        updateCommentCountForFeedItem(currentCommentFeedItem, commentsList);
                    }
                };
                mediaRecorder.start();
                isRecording = true;
                // Tailwind: gold color, ring, animate-pulse, shadow
                micIcon.classList.add('text-[#DCC681]', 'ring-2', 'ring-[#DCC681]', 'animate-pulse', 'shadow-lg');
                // Tooltip using Tailwind
                let tooltip = document.createElement('span');
                tooltip.className = 'mic-tooltip absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-[#DCC681] px-2 py-1 rounded text-xs shadow z-10';
                tooltip.innerText = 'Recording... Click to stop';
                micIcon.parentNode.appendChild(tooltip);
            } catch (err) {
                alert('Microphone access denied.');
            }
        } else {
            // Stop recording
            mediaRecorder.stop();
            isRecording = false;
            micIcon.classList.remove('text-[#DCC681]', 'ring-2', 'ring-[#DCC681]', 'animate-pulse', 'shadow-lg');
            // Remove tooltip
            const tooltip = micIcon.parentNode.querySelector('.mic-tooltip');
            if (tooltip) tooltip.remove();
        }
    }
});

function updateCommentCountForFeedItem(feedItem, commentsList) {
    const commentCountSpan = feedItem.querySelector('.comment-count');
    if (commentCountSpan && commentsList) {
        commentCountSpan.textContent = commentsList.children.length;
    }
}