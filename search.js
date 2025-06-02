document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const resultsList = document.getElementById('resultsList');

    async function searchUsersAndPages() {
        const search = searchInput.value.trim();
        resultsList.innerHTML = '';
        if (!search) return;

        // Search users table (no auth)
        const { data: users, error: userError } = await supabase
            .from('users')
            .select('user_id, first_name, last_name, email, profile_picture')
            .or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%`);

        // Search pages by name (case-insensitive)
        const { data: pages, error: pageError } = await supabase
            .from('pages')
            .select('id, name')
            .ilike('name', `%${search}%`);

        if ((userError || !users || users.length === 0) && (pageError || !pages || pages.length === 0)) {
            resultsList.innerHTML = `<li class="py-3 px-4 text-[#DCC681]">No users or pages found.</li>`;
            return;
        }

        // Show users (no duplicate user_id, and do not show current user)
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (users && users.length > 0) {
            const uniqueUsers = [];
            const seenIds = new Set();
            users.forEach(user => {
                // Exclude current user from results
                if (
                    !seenIds.has(user.user_id) &&
                    (!currentUser || user.user_id !== currentUser.user_id)
                ) {
                    seenIds.add(user.user_id);
                    uniqueUsers.push(user);
                }
            });
            uniqueUsers.forEach(user => {
                const li = document.createElement('li');
                li.className = "flex justify-between items-center py-3 px-4";
                li.innerHTML = `
                    <span class="flex items-center">
                        <img src="${user.profile_picture || 'images/user_profile.png'}" alt="Profile" class="w-8 h-8 rounded-full mr-2">
                        <span class="text-[#DCC681]">${user.first_name} ${user.last_name}</span>
                    </span>
                    <button class="add-friend-btn bg-[#DCC681] text-black px-3 py-1 rounded" data-userid="${user.user_id}">Add Friend</button>
                `;
                resultsList.appendChild(li);

                // Add event listener for the Add Friend button
                const addFriendBtn = li.querySelector('.add-friend-btn');

                // Check if a pending or accepted request already exists
                addFriendBtn.addEventListener('click', async function () {
                    const currentUser = JSON.parse(localStorage.getItem('user'));
                    if (!currentUser) return;

                    // Check for existing friend request (pending or accepted)
                    const { data: existingReq } = await supabase
                        .from('friend_requests')
                        .select('id, status')
                        .or(`and(from_user.eq.${currentUser.user_id},to_user.eq.${user.user_id}),and(from_user.eq.${user.user_id},to_user.eq.${currentUser.user_id})`)
                        .in('status', ['pending', 'accepted']);

                    if (existingReq && existingReq.length > 0) {
                        addFriendBtn.textContent = "Pending";
                        addFriendBtn.disabled = true;
                        addFriendBtn.classList.remove('bg-[#DCC681]', 'text-black');
                        addFriendBtn.classList.add('bg-gray-400', 'text-white');
                        return;
                    }

                    // Insert a friend request
                    await supabase
                        .from('friend_requests')
                        .insert([
                            { from_user: currentUser.user_id, to_user: user.user_id, status: 'pending' }
                        ]);
                    addFriendBtn.textContent = "Pending";
                    addFriendBtn.disabled = true;
                    addFriendBtn.classList.remove('bg-[#DCC681]', 'text-black');
                    addFriendBtn.classList.add('bg-gray-400', 'text-white');
                });
            });
        }

        // Show pages
        if (pages && pages.length > 0) {
            pages.forEach(page => {
                const li = document.createElement('li');
                li.className = "flex justify-between items-center py-3 px-4";
                li.innerHTML = `
                    <span class="text-[#DCC681]">${page.name}</span>
                    <button class="follow-page-btn bg-[#DCC681] text-black px-3 py-1 rounded" data-pageid="${page.id}">Follow</button>
                `;
                resultsList.appendChild(li);
            });
        }
    }

    searchBtn.addEventListener('click', searchUsersAndPages);
    searchInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchUsersAndPages();
        }
    });
});