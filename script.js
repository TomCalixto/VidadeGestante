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

// Inicializar o Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Variáveis de controle de contrações
let contractions = [];
let startTime = null;

document.addEventListener("DOMContentLoaded", () => {
    checkUserLoggedIn();
});

function loginWithEmail() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            const user = userCredential.user;
            console.log("Usuário logado: ", user.email);
            document.getElementById("login-container").style.display = "none";
            document.getElementById("contracao-container").style.display = "block";
            loadContractions();
        })
        .catch(error => {
            console.error("Erro ao fazer login: ", error);
            document.getElementById("login-error").style.display = "block";
        });
}

function checkUserLoggedIn() {
    auth.onAuthStateChanged(user => {
        if (user) {
            document.getElementById("login-container").style.display = "none";
            document.getElementById("contracao-container").style.display = "block";
            loadContractions();
        } else {
            document.getElementById("login-container").style.display = "block";
            document.getElementById("contracao-container").style.display = "none";
        }
    });
}

function logout() {
    auth.signOut().then(() => {
        console.log("Usuário deslogado");
        document.getElementById("login-container").style.display = "block";
        document.getElementById("contracao-container").style.display = "none";
    }).catch(error => {
        console.error("Erro ao deslogar: ", error);
    });
}

function startContraction() {
    if (startTime) {
        alert("A contração já foi iniciada!");
        return;
    }
    startTime = new Date();
    alert("Contração iniciada!");
}

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

    saveContractions();
    displayContractions();

    startTime = null; // Reseta o início da contração
}

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

function saveContractions() {
    const user = auth.currentUser;
    if (user) {
        const userId = user.uid;
        db.collection("users").doc(userId).set({
            contractions: contractions
        }).then(() => {
            console.log("Contrações salvas com sucesso!");
        }).catch((error) => {
            console.error("Erro ao salvar contrações: ", error);
        });
    }
}

function loadContractions() {
    const user = auth.currentUser;
    if (user) {
        const userId = user.uid;
        db.collection("users").doc(userId).get().then((doc) => {
            if (doc.exists) {
                contractions = doc.data().contractions || [];
                displayContractions();
            } else {
                console.log("Nenhuma contração salva.");
            }
        }).catch((error) => {
            console.error("Erro ao carregar contrações: ", error);
        });
    }
}

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}
