<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Art Rush</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1><a href="#top" class="home-link">Art Rush</a></h1>
        <div class="buttons-container">
            <button id="SignupButton">Criar Conta</button>
            <button id="loginButton">Login</button>
        </div>
    </header>

    <!-- Login Form -->
    <div class="form-container" id="loginForm" style="display: none;">
        <!-- Botão de fechar com X -->
        <button id="close-login-modal" class="close-btn">&#x2715;</button>
        <h2>Bem-vindo ao Art Rush</h2>
        <form>
            <label for="loginUser">Username ou E-mail</label>
            <input type="text" id="loginUser" required>

            <label for="loginPassword">Password</label>
            <input type="password" id="loginPassword" required>

            <div class="form-buttons">
                <button type="button" id="loginSubmit">Iniciar Sessão</button>
                <button type="button" id="goToSignup">Criar Conta</button>
            </div>
        </form>
    </div>

    <!-- Signup Form -->
    <div class="form-container" id="SignupForm" style="display: none;">
        <!-- Botão de fechar com X -->
        <button id="close-Signup-modal" class="close-btn">&#x2715;</button>
        <h2>Registo de Conta</h2>
        <form>
            <label for="SignupUser">Username</label>
            <input type="text" id="SignupUser" required>

            <label for="SignupPassword">Password</label>
            <input type="password" id="SignupPassword" required>

            <label>Nome Próprio</label>
            <div class="name-fields">
                <input type="text" id="firstName" placeholder="Primeiro Nome" required>
                <input type="text" id="lastName" placeholder="Último Nome" required>
            </div>

            <div class="form-buttons">
                <button type="button" id="SignupSubmit">Registar</button>
                <button type="button" id="goToLogin">Fazer Login</button>
            </div>
        </form>
    </div>

    <script src="html_functions.js"></script>

</body>
</html>
