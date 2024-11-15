// Configuração do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

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

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

// Variáveis globais
let startTime = null;
let contractions = [];

// Referências para os elementos HTML
const loginScreen = document.getElementById("login-screen");
const contractionsScreen = document.getElementById("contractions-screen");
const startButton = document.getElementById("start-button");
const endButton = document.getElementById("end-button");

// Função para login com Google
function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            console.log("Usuário logado: ", result.user);
            loginScreen.style.display = "none";  // Oculta a tela de login
            contractionsScreen.style.display = "block";  // Exibe a tela de contrações
        })
        .catch((error) => {
            console.error("Erro ao fazer login com Google: ", error);
        });
}

// Verificar o estado de autenticação
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Usuário logado: ", user);
        loginScreen.style.display = "none";
        contractionsScreen.style.display = "block";
    } else {
        console.log("Usuário não autenticado");
        loginScreen.style.display = "block";
        contractionsScreen.style.display = "none";
    }
});

// Função para iniciar a contração
function startContraction() {
    if (startTime) {
        alert("A contração já foi iniciada!");
        return;
    }
    startTime = new Date();
    console.log("Contração iniciada em:", startTime);
    alert("Contração iniciada!");
}

// Função para finalizar a contração
function endContraction() {
    if (!startTime) {
        alert("Nenhuma contração em andamento.");
        return;
    }
    const endTime = new Date();
    const duration = (endTime - startTime) / 1000; // em segundos

    const lastContraction = contractions[contractions.length - 1];
    const interval = lastContraction ? (startTime - lastContraction.startTime) / 1000 : 0;

    const newContraction = { startTime, endTime, duration, interval };
    contractions.push(newContraction); // Adiciona a contração ao histórico

    console.log("Nova contração registrada:", newContraction);
    saveContractions();
    displayContractions();

    startTime = null; // Reseta o início da contração
}

// Função para exibir os registros de contrações
function displayContractions() {
    const list = document.getElementById("contractions-list");
    list.innerHTML = "";

    if (contractions.length === 0) {
        console.log("Nenhuma contração registrada.");
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

// Função para salvar as contrações no Firebase
async function saveContractions() {
    try {
        const docRef = await addDoc(collection(db, "contractions"), {
            contractions: contractions
        });
        console.log("Contrações salvas com sucesso: ", docRef.id);
    } catch (e) {
        console.error("Erro ao salvar as contrações: ", e);
    }
}

// Função para formatar as datas
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

// Função de logout
function logout() {
    signOut(auth).then(() => {
        console.log("Usuário deslogado");
        loginScreen.style.display = "block";
        contractionsScreen.style.display = "none";
    }).catch((error) => {
        console.error("Erro ao deslogar: ", error);
    });
}
