// Simulação de um "banco de dados" de usuários
const users = {
    "thomas": "12345",  // Nome de usuário: senha
    "thomascalixto": "86116500",
    "admin": "admin123",
    "teste": "teste"
};

// Selecionando o formulário e os inputs
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('error-message');

// Função para verificar login
loginForm.addEventListener('submit', function (e) {
    e.preventDefault();  // Evita o envio padrão do formulário

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (users[username] && users[username] === password) {
        // Armazenar login no localStorage para lembrar que o usuário está autenticado
        localStorage.setItem('loggedIn', 'true');
        window.location.href = 'index.html';  // Redirecionar para a página principal do sistema
    } else {
        errorMessage.style.display = 'block';  // Exibir mensagem de erro
    }
});
