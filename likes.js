function likePost(element) {
    const likeIcon = element;
    const likeCount = likeIcon.nextElementSibling;
    if (!likeIcon.classList.contains('liked')) {
        likeIcon.classList.add('liked', 'text-white');
        likeCount.textContent = parseInt(likeCount.textContent) + 1;
    } else {
        likeIcon.classList.remove('liked', 'text-white');
        likeCount.textContent = Math.max(0, parseInt(likeCount.textContent) - 1);
    }
}

function likeComment(element) {
    const likeIcon = element;
    const likeCount = likeIcon.nextElementSibling;
    if (!likeIcon.classList.contains('liked')) {
        likeIcon.classList.add('liked', 'text-white');
        likeCount.textContent = parseInt(likeCount.textContent) + 1;
    } else {
        likeIcon.classList.remove('liked', 'text-white');
        likeCount.textContent = Math.max(0, parseInt(likeCount.textContent) - 1);
    }
}

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('comment-like-btn')) {
        likeComment(e.target);
    }
});