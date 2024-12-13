const API_URL = 'http://localhost:3000';

// Mostrar formulário de login
document.getElementById('loginButton').onclick = () => {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('SignupForm').style.display = 'none';
};

// Mostrar formulário de criação de conta
document.getElementById('SignupButton').onclick = () => {
    document.getElementById('SignupForm').style.display = 'block';
    document.getElementById('loginForm').style.display = 'none';
};

// Ir para a tela de registro a partir do login
document.getElementById('goToSignup').onclick = () => {
    document.getElementById('SignupForm').style.display = 'block';
    document.getElementById('loginForm').style.display = 'none';
};

// Ir para a tela de login a partir do registro
document.getElementById('goToLogin').onclick = () => {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('SignupForm').style.display = 'none';
};

// Fechar janela de login
document.getElementById('close-login-modal').onclick = () => {
    document.getElementById('loginForm').style.display = 'none';
};

// Fechar janela de registro
document.getElementById('close-Signup-modal').onclick = () => {
    document.getElementById('SignupForm').style.display = 'none';
};

// Envio do formulário de login
document.getElementById('loginSubmit').onclick = async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUser').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (data.error) {
            alert(data.error);
        } else {
            localStorage.setItem('user', JSON.stringify(data.user));  // Salvar dados do usuário
            displayUserProfile(data.user);
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
    }
};

// Envio do formulário de registro
document.getElementById('SignupSubmit').onclick = async (e) => {
    e.preventDefault();
    const username = document.getElementById('SignupUser').value;
    const password = document.getElementById('SignupPassword').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;

    try {
        const response = await fetch(`${API_URL}/Signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, firstName, lastName }),
        });
        const data = await response.json();
        alert(data.message || data.error);
    } catch (error) {
        console.error('Erro ao registrar:', error);
    }
};

// Exibir perfil do usuário
function displayUserProfile(user) {
    document.body.innerHTML = `
        <!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Art Rush - Dashboard</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <header class="main-header">
        <h1 class="title" id="scrollToTopBtn" style="cursor: pointer;">Art Rush</h1>
        <div class="user-info-header">
            <img src="image_folder/user_icon.jpg" alt="User Avatar" class="header-avatar">
            <span id="user-header" class="username">${user.username}</span>
            <span id="dropdownArrow" class="dropdown-arrow">&#x25BC;</span>
            <div class="dropdown-menu" id="dropdownMenu">
                <button id="logout-btn">Logout</button>
            </div>
        </div>
    </header>

    <main>
        <section class="user-profile">
            <div class="profile-section">
                <img src="image_folder/user_icon.jpg" alt="User Avatar" class="user-avatar">
                <span class="username">${user.username}</span>
                <button class="edit-profile" id="edit-profile-btn">Editar Perfil</button>
            </div>
            <div class="stats">
                <div>
                    <p>Art Liked</p>
                    <span>${user.artCount || 0}</span>
                </div>
                <div>
                    <p>Artists</p>
                    <span>${user.artistCount || 0}</span>
                </div>
                <div>
                    <p>Favorite Art</p>
                    <span>${user.favoriteArt || 0}</span>
                </div>
            </div>
        </section>

        <section class="favorite-artworks">
            <h2>Favorite Artworks</h2>
            <div class="art-gallery">
                <img src="https://via.placeholder.com/150" alt="Art 1">
                <img src="https://via.placeholder.com/150" alt="Art 2">
                <img src="https://via.placeholder.com/150" alt="Art 3">
                <img src="https://via.placeholder.com/150" alt="Art 4">
                <img src="https://via.placeholder.com/150" alt="Art 5">
            </div>
        </section>

        <section class="filters">
            <button class="filter-btn">Rating <span class="filter-arrow">&#x25BC;</span></button>
            <button class="filter-btn">Period <span class="filter-arrow">&#x25BC;</span></button>
            <button class="filter-btn">Century <span class="filter-arrow">&#x25BC;</span></button>
            <button class="filter-btn">Location <span class="filter-arrow">&#x25BC;</span></button>
            <button class="filter-btn">Sort By When Added <span class="filter-arrow">&#x25BC;</span></button>
        </section>

        <section class="art-gallery-grid">
            <img src="https://via.placeholder.com/150" alt="Art">
            <img src="https://via.placeholder.com/150" alt="Art">
            <img src="https://via.placeholder.com/150" alt="Art">
            <img src="https://via.placeholder.com/150" alt="Art">
            <img src="https://via.placeholder.com/150" alt="Art">
            <img src="https://via.placeholder.com/150" alt="Art">
        </section>
    </main>

    <div class="form-container" id="editProfileForm" style="display: none;">
        <button id="close-edit-profile-modal" class="close-btn">&#x2715;</button>
        <h2>Editar Perfil</h2>
        <form>
            <label for="newusername">Username:</label>
            <input type="text" id="newusername" placeholder="New username" value="${user.username}" required>

            <label for="newpassword">Password:</label>
            <input type="password" id="newpassword" placeholder="New password" value="${user.password}" required>

            <label>Nome Próprio:</label>
            <div class="name-fields">
                <input type="text" id="newfirstName" placeholder="Primeiro Nome" value="${user.firstName || ''}" required>
                <input type="text" id="newlastName" placeholder="Último Nome" value="${user.lastName || ''}" required>
            </div>

            <div class="form-buttons">
                <button id="save-changes">Save Changes</button>
                <button id="delete-account">Delete Account</button>
            </div>
        </form>
    </div>
</body>
</html>
    `;

    // Exibir o modal de editar perfil
    document.getElementById('edit-profile-btn').onclick = () => {
        document.getElementById('editProfileForm').style.display = 'block';
    };

    // Fechar o modal de editar perfil
    document.getElementById('close-edit-profile-modal').onclick = () => {
        document.getElementById('editProfileForm').style.display = 'none';
    };

    // Logout
    document.getElementById('logout-btn').onclick = () => {
        localStorage.removeItem('user');
        window.location.reload();
    };

    // Toggle dropdown menu visibility e alternar seta
    const dropdownArrow = document.getElementById('dropdownArrow');
    const dropdownMenu = document.getElementById('dropdownMenu');

    dropdownArrow.onclick = () => {
        const isOpen = dropdownMenu.style.display === 'block';
        dropdownMenu.style.display = isOpen ? 'none' : 'block';
        dropdownArrow.innerHTML = isOpen ? '&#x25BC;' : '&#x25B2;';  // Alterna a seta
    };


    document.getElementById('save-changes')?.addEventListener('click', async (e) => {
        e.preventDefault();

        // Obter os valores dos campos do formulário
        const username = document.getElementById('newusername').value.trim();
        const password = document.getElementById('newpassword').value.trim();
        const firstName = document.getElementById('newfirstName').value.trim();
        const lastName = document.getElementById('newlastName').value.trim();

        if (!username) {
            alert('O campo de nome de usuário é obrigatório.');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/updateProfile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, firstName, lastName }),
            });

            const data = await response.json();

            if (data.error) {
                alert(data.error);
            } else {
                alert(data.message || 'Perfil atualizado com sucesso!');
                // Atualiza o usuário no localStorage
                localStorage.setItem('user', JSON.stringify({ username, firstName, lastName }));
                // Atualiza a exibição do perfil
                displayUserProfile({ username, firstName, lastName });
            }
        } catch (error) {
            console.error('Erro ao salvar alterações:', error);
            alert('Erro ao salvar as alterações. Tente novamente mais tarde.');
        }
    });


    // Excluir conta
    document.getElementById('delete-account')?.addEventListener('click', async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));
        const username = user.username;

        const confirmDelete = confirm("Tem certeza de que deseja excluir sua conta? Esta ação não pode ser desfeita.");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${API_URL}/deleteAccount`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }), // Envia o username para a exclusão
            });
            const data = await response.json();
            if (data.error) {
                alert(data.error);
            } else {
                localStorage.removeItem('user'); // Remove o usuário do localStorage
                window.location.href = 'index.html'; // Redireciona para a página inicial
            }
        } catch (error) {
            console.error('Erro ao excluir conta:', error);
        }
    });
}

// Ao carregar a página, verifica se o usuário está logado
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        displayUserProfile(user);
    }
});




