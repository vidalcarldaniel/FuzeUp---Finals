function checkSession() {
    const user = localStorage.getItem('user');
    if (!user) {
        window.location.href = "logIn.html";
    }
}

checkSession();

document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        // Set profile image
        const profileImage = document.getElementById('profileImage');
        if (profileImage) {
            profileImage.src = user.profile_picture || 'images/user-profile.png';
        }
        // Set user name
        const userName = document.getElementById('userName');
        if (userName) {
            userName.textContent = `${user.first_name} ${user.last_name}`;
        }
    }
});