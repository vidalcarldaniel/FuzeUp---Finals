document.getElementById('signUp-Form').onsubmit = async function (e) {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!firstName || !lastName || !email || !password) {
        alert('Please fill out all fields.');
        return;
    }

    // Register user with Supabase Auth (optional, for email verification)
    const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                first_name: firstName,
                last_name: lastName
            }
        }
    });

    if (authError) {
        alert(authError.message || 'Sign up failed.');
        return;
    }

    // Insert user details into your users table with plain password
    const { error: insertError } = await supabase.from('users').insert([
        { email, password, first_name: firstName, last_name: lastName }
    ]);
    if (insertError) {
        alert('User insert error: ' + insertError.message);
        return;
    }

    window.location.href = "logIn.html";
};