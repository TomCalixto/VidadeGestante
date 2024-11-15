let contractions = [];
let startTime = null;

document.addEventListener("DOMContentLoaded", () => {
    loadContractions(); // Carregar histórico de contrações ao abrir
});

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
        deleteButton.onclick = () => {
            contractions.splice(index, 1);
            saveContractions();
            displayContractions();
        };

        li.appendChild(header);
        li.appendChild(dataHoraField);
        li.appendChild(durationField);
        li.appendChild(intervalField);
        li.appendChild(deleteButton);
        list.appendChild(li);
    });
}

function saveContractions() {
    localStorage.setItem("contractions", JSON.stringify(contractions));
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
        displayContractions();
    }
}

function clearContractions() {
    contractions = [];
    localStorage.removeItem("contractions");
    displayContractions();
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
