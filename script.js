import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js';
import { getFirestore, collection, addDoc } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js';

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDKEF-5qgGEm_e3JtIG9r4AwjH3x5s6o48",
    authDomain: "vida-de-gestante.firebaseapp.com",
    projectId: "vida-de-gestante",
    storageBucket: "vida-de-gestante.firebasestorage.app",
    messagingSenderId: "442794310384",
    appId: "1:442794310384:web:b9de65e5d28508cf386035",
    measurementId: "G-J3LTZLML9K"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let contractions = [];
let startTime = null;

// Ações de Login
const loginForm = document.getElementById('login-form');
const loginScreen = document.getElementById('login-screen');
const contractionScreen = document.getElementById('contraction-screen');
const loginErrorMessage = document.getElementById('login-error-message');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        loginScreen.style.display = 'none';
        contractionScreen.style.display = 'block';
        loadContractions();
    } catch (error) {
        loginErrorMessage.textContent = 'Falha no login. Tente novamente!';
    }
});

// Monitorar o estado de autenticação
onAuthStateChanged(auth, (user) => {
    if (user) {
        loginScreen.style.display = 'none';
        contractionScreen.style.display = 'block';
        loadContractions();
    } else {
        loginScreen.style.display = 'block';
        contractionScreen.style.display = 'none';
    }
});

// Função para iniciar a contração
function startContraction() {
    if (startTime) {
        alert("A contração já foi iniciada!");
        return;
    }
    startTime = new Date();
    alert("Contração iniciada!");
}

// Função para finalizar a contração
async function endContraction() {
    if (!startTime) {
        alert("Nenhuma contração em andamento.");
        return;
    }

    const endTime = new Date();
    const duration = (endTime - startTime) / 1000; // em segundos
    const interval = contractions.length ? (startTime - contractions[contractions.length - 1].startTime) / 1000 : 0;

    const newContraction = { startTime, endTime, duration, interval };

    try {
        await addDoc(collection(db, 'contractions'), newContraction);
        contractions.push(newContraction);
        displayContractions();
        startTime = null;
    } catch (error) {
        console.error('Erro ao salvar contração:', error);
    }
}

// Exibir o histórico de contrações
function displayContractions() {
    const list = document.getElementById("contractions-list");
    list.innerHTML = "";

    if (contractions.length === 0) {
        return;
    }

    contractions.forEach((contraction, index) => {
        const li = document.createElement("li");

        const header = document.createElement("div");
        header.className = "contraction-header";
        header.textContent = `Contração ${index + 1}:`;

        const startFormatted = formatDate(contraction.startTime);
        const endFormatted = formatDate(contraction.endTime);

        const dataHoraField = document.createElement("div");
        dataHoraField.className = "contraction-field";
        dataHoraField.innerHTML = `<span class="label">Data/Hora:</span> Início: ${startFormatted}, Fim: ${endFormatted}`;

        const durationField = document.createElement("div");
        durationField.className = "contraction-field";
        durationField.innerHTML = `<span class="label">Duração:</span> ${contraction.duration.toFixed(3)} segundos`;

        const intervalField = document.createElement("div");
        intervalField.className = "contraction-field";
        const interval = contraction.interval !== null && !isNaN(contraction.interval) ? contraction.interval.toFixed(3) : "0";
        intervalField.innerHTML = `<span class="label">Intervalo:</span> ${interval} segundos`;

        li.appendChild(header);
        li.appendChild(dataHoraField);
        li.appendChild(durationField);
        li.appendChild(intervalField);
        list.appendChild(li);
    });
}

// Carregar as contrações do Firestore
async function loadContractions() {
    const contractionsRef = collection(db, 'contractions');
    const snapshot = await getDocs(contractionsRef);
    snapshot.forEach(doc => {
        contractions.push(doc.data());
    });
    displayContractions();
}

// Função para formatar a data
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}
