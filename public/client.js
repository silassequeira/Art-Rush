document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('cat-container');
    const loadCats = (() => {
        let page = 1;
        let loading = false;

        return async () => {
            if (loading) return;
            loading = true;

            const response = await fetch(`/cat-data?page=${page}`);
            const data = await response.json();

            const fragment = data.html.trim().length 
                ? new DOMParser().parseFromString(data.html, 'text/html').body.children 
                : [];

            Array.from(fragment).forEach(child => container.appendChild(child));

            page = data.nextPage || (window.removeEventListener('scroll', checkScroll), page);
            loading = false;
        };
    })();

    const checkScroll = () => 
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && loadCats();

    window.addEventListener('scroll', checkScroll);
    loadCats();
});