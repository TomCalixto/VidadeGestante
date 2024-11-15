let contractions = [];
let startTime = null;
let timerInterval = null;

document.addEventListener("DOMContentLoaded", () => {
    loadContractions();
    console.log("Contractions loaded", contractions);
    updateButtonVisibility();
});

function startContraction() {
    if (startTime) {
        alert("A contração já foi iniciada!");
        return;
    }
    startTime = new Date();
    console.log("Contração iniciada em:", startTime);
    showTimerBar();
    startTimer();
    updateButtonVisibility(); // Atualiza a visibilidade dos botões
}

function endContraction() {
    if (!startTime) {
        alert("Nenhuma contração em andamento.");
        return;
    }
    const endTime = new Date();
    const duration = (endTime - startTime) / 1000;

    const lastContraction = contractions[contractions.length - 1];
    const interval = lastContraction ? (startTime - lastContraction.startTime) / 1000 : 0;

    const newContraction = { startTime, endTime, duration, interval };
    contractions.push(newContraction);

    console.log("Nova contração registrada:", newContraction);
    saveContractions();
    displayContractions();

    resetTimer();
    hideTimerBar();
    startTime = null;
    updateButtonVisibility(); // Atualiza a visibilidade dos botões
}

function startTimer() {
    const timerDisplay = document.getElementById("timer-display");
    const startTimestamp = Date.now();

    timerInterval = setInterval(() => {
        const elapsedTime = Date.now() - startTimestamp;
        const hours = String(Math.floor(elapsedTime / (1000 * 60 * 60))).padStart(2, "0");
        const minutes = String(Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
        const seconds = String(Math.floor((elapsedTime % (1000 * 60)) / 1000)).padStart(2, "0");
        timerDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    document.getElementById("timer-display").textContent = "00:00:00";
}

function showTimerBar() {
    const timerBar = document.getElementById("timer-bar");
    timerBar.style.display = "block";
}

function hideTimerBar() {
    const timerBar = document.getElementById("timer-bar");
    timerBar.style.display = "none";
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

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Excluir";
        deleteButton.className = "delete-button";
        deleteButton.onclick = () => deleteContraction(index);

        li.appendChild(header);
        li.appendChild(dataHoraField);
        li.appendChild(durationField);
        li.appendChild(intervalField);
        li.appendChild(deleteButton);
        list.appendChild(li);
    });
}

function deleteContraction(index) {
    contractions.splice(index, 1);
    saveContractions();
    displayContractions();
}

function saveContractions() {
    localStorage.setItem("contractions", JSON.stringify(contractions));
    console.log("Contractions saved to localStorage", contractions);
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
        console.log("Contractions loaded from localStorage", contractions);
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

function updateButtonVisibility() {
    const startButton = document.querySelector("button[onclick='startContraction()']");
    const endButton = document.querySelector("button[onclick='endContraction()']");
    if (startTime) {
        startButton.style.display = "none";
        endButton.style.display = "inline-block";
    } else {
        startButton.style.display = "inline-block";
        endButton.style.display = "none";
    }
}
