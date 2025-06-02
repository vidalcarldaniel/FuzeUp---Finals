document.addEventListener('DOMContentLoaded', async () => {
    const friendReqDiv = document.getElementById('friend-req');
    friendReqDiv.innerHTML = "<h2 class='mb-2 text-lg font-bold'>Friend Requests</h2>";

    // Get current user (from localStorage/session)
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    // Fetch friend requests sent to this user (pending only) - Incoming requests
    const { data: incoming, error } = await supabase
        .from('friend_requests')
        .select('id, from_user, users:from_user(first_name, last_name, profile_picture)')
        .eq('to_user', user.user_id)
        .eq('status', 'pending');

    if (error) {
        friendReqDiv.innerHTML += "<p class='text-red-500'>Error loading friend requests.</p>";
        return;
    }

    if (incoming && incoming.length > 0) {
        incoming.forEach(req => {
            const reqDiv = document.createElement('div');
            reqDiv.className = "flex items-center justify-between border-b border-[#DCC681] py-2";
            reqDiv.innerHTML = `
                <span class="flex items-center">
                    <img src="${req.users.profile_picture || 'images/user_profile.png'}" alt="Profile" class="w-8 h-8 rounded-full mr-2">
                    <span>${req.users.first_name} ${req.users.last_name}</span>
                </span>
                <div>
                    <button class="accept-btn bg-[#DCC681] text-black px-3 py-1 rounded mr-2" data-reqid="${req.id}" data-from="${req.from_user}">Accept</button>
                    <button class="decline-btn bg-red-500 text-white px-3 py-1 rounded" data-reqid="${req.id}">Decline</button>
                </div>
            `;
            friendReqDiv.appendChild(reqDiv);
        });
    } else {
        friendReqDiv.innerHTML += "<p class='text-sm text-gray-400'>No friend requests.</p>";
    }

    // Fetch outgoing friend requests (pending only)
    const { data: outgoing } = await supabase
        .from('friend_requests')
        .select('id, to_user, users:to_user(first_name, last_name, profile_picture)')
        .eq('from_user', user.user_id)
        .eq('status', 'pending');

    if (outgoing && outgoing.length > 0) {
        friendReqDiv.innerHTML += "<h2 class='mb-2 text-lg font-bold mt-6'>Sent Requests</h2>";
        outgoing.forEach(req => {
            const reqDiv = document.createElement('div');
            reqDiv.className = "flex items-center justify-between border-b border-[#DCC681] py-2";
            reqDiv.innerHTML = `
                <span class="flex items-center">
                    <img src="${req.users.profile_picture || 'images/user_profile.png'}" alt="Profile" class="w-8 h-8 rounded-full mr-2">
                    <span>${req.users.first_name} ${req.users.last_name}</span>
                </span>
                <div>
                    <button class="accept-btn bg-[#DCC681] text-black px-3 py-1 rounded mr-2" data-reqid="${req.id}" data-from="${user.user_id}" data-to="${req.to_user}">Accept</button>
                    <button class="decline-btn bg-red-500 text-white px-3 py-1 rounded" data-reqid="${req.id}">Decline</button>
                </div>
            `;
            friendReqDiv.appendChild(reqDiv);
        });
    }

    // Accept or decline friend request
    friendReqDiv.addEventListener('click', async function (e) {
        // Accept
        if (e.target.classList.contains('accept-btn')) {
            const reqId = e.target.getAttribute('data-reqid');
            const fromUser = e.target.getAttribute('data-from');
            // Update request status
            await supabase.from('friend_requests').update({ status: 'accepted' }).eq('id', reqId);
            // Add to friendships table (both directions)
            await supabase.from('friendships').insert([
                { user_id: user.user_id, friend_id: fromUser },
                { user_id: fromUser, friend_id: user.user_id }
            ]);
            e.target.textContent = "Accepted";
            e.target.disabled = true;
            // Optionally disable decline button
            const declineBtn = e.target.parentElement.querySelector('.decline-btn');
            if (declineBtn) declineBtn.disabled = true;
        }
        // Decline
        if (e.target.classList.contains('decline-btn')) {
            const reqId = e.target.getAttribute('data-reqid');
            await supabase.from('friend_requests').update({ status: 'declined' }).eq('id', reqId);
            e.target.textContent = "Declined";
            e.target.disabled = true;
            // Optionally disable accept button
            const acceptBtn = e.target.parentElement.querySelector('.accept-btn');
            if (acceptBtn) acceptBtn.disabled = true;
        }
    });
});