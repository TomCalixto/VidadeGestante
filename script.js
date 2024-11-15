// Importando os módulos do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

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
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Variáveis globais
let contractions = [];
let startTime = null;

document.addEventListener("DOMContentLoaded", () => {
    loadContractions(); // Carregar histórico de contrações ao abrir
    console.log("Contractions loaded", contractions); // Log para verificar se as contrações estão sendo carregadas

    // Adicionando event listeners
    const startButton = document.getElementById("start-btn");
    const endButton = document.getElementById("end-btn");

    startButton.addEventListener("click", startContraction);
    endButton.addEventListener("click", endContraction);
});

function startContraction() {
    if (startTime) {
        alert("A contração já foi iniciada!");
        return;
    }
    startTime = new Date();
    console.log("Contração iniciada em:", startTime); // Log para confirmar que a contração foi iniciada
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
    console.log("Nova contração registrada:", newContraction); // Log para confirmar que a contração foi salva
    
    // Salva no Firestore
    saveContractionToFirebase(newContraction);

    // Atualiza a interface
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
    localStorage.setItem("contractions", JSON.stringify(contractions));
    console.log("Contractions saved to localStorage", contractions); // Log para verificar se os dados estão sendo salvos corretamente
}

function loadContractions() {
    const savedContractions = localStorage.getItem("contractions");
    if (savedContractions) {
        contractions = JSON.parse(savedContractions).map(contraction => ({
            startTime: new Date(contraction.startTime),
            endTime: new Date(contraction.endTime),
            duration: contraction.duration,
            interval: contraction.interval
        }));
        console.log("Contractions loaded from localStorage", contractions); // Log para verificar se o carregamento está correto
        displayContractions();
    } else {
        console.log("Nenhuma contração no armazenamento.");
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

async function saveContractionToFirebase(contraction) {
    try {
        const docRef = await addDoc(collection(db, "contractions"), {
            startTime: contraction.startTime,
            endTime: contraction.endTime,
            duration: contraction.duration,
            interval: contraction.interval
        });
        console.log("Contração salva no Firebase com ID: ", docRef.id);
    } catch (e) {
        console.error("Erro ao adicionar contração ao Firebase: ", e);
    }
}
