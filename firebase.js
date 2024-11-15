// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKEF-5qgGEm_e3JtIG9r4AwjH3x5s6o48",
  authDomain: "vida-de-gestante.firebaseapp.com",
  projectId: "vida-de-gestante",
  storageBucket: "vida-de-gestante.firebasestorage.app",
  messagingSenderId: "442794310384",
  appId: "1:442794310384:web:b9de65e5d28508cf386035",
  measurementId: "G-J3LTZLML9K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// Função para criar um novo usuário
function createAccount(email, password) {
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('Usuário criado com sucesso:', user);
        })
        .catch((error) => {
            console.error('Erro ao criar usuário:', error);
        });
}

// Função de login
function login(email, password) {
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('Usuário logado:', user);
        })
        .catch((error) => {
            console.error('Erro no login:', error);
        });
}

// Função de logout
function logout() {
    auth.signOut().then(() => {
        console.log('Usuário deslogado');
    }).catch((error) => {
        console.error('Erro ao deslogar:', error);
    });
}

function saveContraction(contraction) {
    if (!auth.currentUser) {
        console.log('Usuário não autenticado');
        return;
    }

    db.collection("contractions").add({
        userId: auth.currentUser.uid,  // Salva o ID do usuário para associar a contração
        startTime: contraction.startTime,
        endTime: contraction.endTime,
        duration: contraction.duration,
        interval: contraction.interval
    })
    .then(() => {
        console.log('Contração salva com sucesso!');
    })
    .catch((error) => {
        console.error('Erro ao salvar contração:', error);
    });
}

function loadContractions() {
    if (!auth.currentUser) {
        console.log('Usuário não autenticado');
        return;
    }

    db.collection("contractions")
        .where("userId", "==", auth.currentUser.uid)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
                // Aqui você pode processar e exibir os dados de cada contração
            });
        })
        .catch((error) => {
            console.error("Erro ao recuperar contrações:", error);
        });
}

