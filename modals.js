// Hamburger menu and modal open/close logic
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('postModal');
    const openModal = document.getElementById('openModal');
    const closeModal = document.getElementById('closeModal');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const dropdownMenu = document.getElementById('dropdownMenu');

    if (openModal && modal) openModal.addEventListener('click', () => modal.classList.remove('hidden'));
    if (closeModal && modal) closeModal.addEventListener('click', () => modal.classList.add('hidden'));
    if (modal) window.addEventListener('click', (event) => { if (event.target === modal) modal.classList.add('hidden'); });

    if (hamburgerMenu && dropdownMenu) {
        hamburgerMenu.addEventListener('click', (event) => {
            event.stopPropagation();
            dropdownMenu.classList.toggle('hidden');
        });
        window.addEventListener('click', (event) => {
            if (!dropdownMenu.contains(event.target) && event.target !== hamburgerMenu) {
                dropdownMenu.classList.add('hidden');
            }
        });
    }
});