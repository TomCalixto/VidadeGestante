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
  
  // Inicializando o Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  
  // Pegando os elementos HTML
  const loginContainer = document.getElementById("login-container");
  const signupContainer = document.getElementById("signup-container");
  const appContainer = document.getElementById("app");
  
  const loginForm = document.getElementById("login-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  
  const signupForm = document.getElementById("signup-form");
  const signupEmailInput = document.getElementById("signup-email");
  const signupPasswordInput = document.getElementById("signup-password");
  
  let contractions = [];
  let startTime = null;
  
  // Alternar entre telas de login e cadastro
  document.getElementById("login-link").addEventListener("click", () => {
      loginContainer.style.display = "block";
      signupContainer.style.display = "none";
  });
  
  document.getElementById("signup-link").addEventListener("click", () => {
      signupContainer.style.display = "block";
      loginContainer.style.display = "none";
  });
  
  // Função de login
  loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = emailInput.value;
      const password = passwordInput.value;
  
      firebase.auth().signInWithEmailAndPassword(email, password)
          .then((userCredential) => {
              // Login bem-sucedido
              const user = userCredential.user;
              loginContainer.style.display = "none";
              appContainer.style.display = "block";
              loadContractions();  // Carregar contrações após o login
          })
          .catch((error) => {
              console.error("Erro ao fazer login", error);
              alert("Erro ao fazer login: " + error.message);
          });
  });
  
  // Função de cadastro
  signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = signupEmailInput.value;
      const password = signupPasswordInput.value;
  
      firebase.auth().createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
              alert("Cadastro realizado com sucesso!");
              signupContainer.style.display = "none";
              loginContainer.style.display = "block";
          })
          .catch((error) => {
              console.error("Erro ao cadastrar", error);
              alert("Erro ao cadastrar: " + error.message);
          });
  });
  
  // Função de logout
  function logout() {
      firebase.auth().signOut()
          .then(() => {
              appContainer.style.display = "none";
              loginContainer.style.display = "block";
          })
          .catch((error) => {
              console.error("Erro ao sair", error);
          });
  }
  
  // Verificar se o usuário está logado
  firebase.auth().onAuthStateChanged((user) => {
      if (user) {
          // Usuário logado
          loginContainer.style.display = "none";
          appContainer.style.display = "block";
      } else {
          // Usuário não logado
          loginContainer.style.display = "block";
          appContainer.style.display = "none";
      }
  });
  
  // Funções para registrar contrações
  
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
      const user = firebase.auth().currentUser;
      if (user) {
          db.collection("contractions").doc(user.uid).set({
              contractions: contractions
          })
          .then(() => {
              console.log("Contrações salvas com sucesso no Firestore!");
          })
          .catch((error) => {
              console.error("Erro ao salvar as contrações no Firestore:", error);
          });
      }
  }
  
  function loadContractions() {
      const user = firebase.auth().currentUser;
      if (user) {
          db.collection("contractions").doc(user.uid).get()
          .then((doc) => {
              if (doc.exists) {
                  contractions = doc.data().contractions || [];
                  displayContractions();
              } else {
                  console.log("Nenhuma contração encontrada no banco de dados.");
              }
          })
          .catch((error) => {
              console.error("Erro ao carregar as contrações do Firestore:", error);
          });
      }
  }
  
  function formatDate(date) {
      return new Date(date).toLocaleString();
  }
  