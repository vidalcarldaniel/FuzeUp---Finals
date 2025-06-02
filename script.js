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
    localStorage.removeItem('user'); // Clear user session from localStorage
    window.location.href = "index.html";
}

document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            window.location.href = "search.html";
        });
    }
});