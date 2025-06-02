document.getElementById('LogIn-Form').onsubmit = async function (e) {
    e.preventDefault();
    const email = document.querySelector('#LogIn-Form input[type="email"]').value.trim();
    const password = document.querySelector('#LogIn-Form input[type="password"]').value;

    if (!email || !password) {
        alert('Please fill out all fields.');
        return;
    }

    // Check your users table for a user with the email and plain password
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();

    if (error || !data) {
        alert('Invalid email or password.');
        return;
    }

    // Store full user info in localStorage for session
    localStorage.setItem('user', JSON.stringify({
        user_id: data.user_id,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        profile_picture: data.profile_picture
    }));

    // Optionally show which account is logged in (for example, on the login page)
    showCurrentUserBar(data);

    // Redirect to dashboard
    window.location.href = "dashboard.html";
};

// Optional: function to show current user info (call this on any page after login)
function showCurrentUserBar(user) {
    let userBar = document.getElementById('current-user-bar');
    if (!userBar) {
        userBar = document.createElement('div');
        userBar.id = 'current-user-bar';
        userBar.className = "w-full max-w-md flex items-center mt-4 mb-2 px-4 py-2 border border-[#DCC681] rounded bg-black";
        document.body.insertBefore(userBar, document.body.firstChild);
    }
    userBar.innerHTML = `
        <img src="${user.profile_picture || 'images/user_profile.png'}" alt="Profile" class="w-8 h-8 rounded-full mr-3">
        <span class="text-[#DCC681] font-bold">${user.first_name} ${user.last_name} (${user.email})</span>
    `;
}