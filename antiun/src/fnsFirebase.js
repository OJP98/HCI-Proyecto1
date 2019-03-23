/* eslint-disable indent */

const src = "https://www.gstatic.com/firebasejs/5.7.1/firebase.js";

function connectDatabase() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyA-pzF0Tf4szNB9LTzPjF_4rl54xfecTmY",
        authDomain: "hci-uvg.firebaseapp.com",
        databaseURL: "https://hci-uvg.firebaseio.com",
        projectId: "hci-uvg",
        storageBucket: "hci-uvg.appspot.com",
        messagingSenderId: "378655686310"
    };
    firebase.initializeApp(config);
    var database = firebase.database();
};


function iniciarSesion() {

    var userInput = document.getElementById("userInput");
    var passwordInput = document.getElementById("passwordInput");

    var userData = userInput.value + "@gmail.com";
    var passwordData = passwordInput.value;

    firebase.auth().signInWithEmailAndPassword(userData, passwordData).then(function() {

        document.location.href = 'index.html';

    }).catch(function(error) {
        var errorMessage = error.message;

        window.alert("Error: " + errorMessage);
        userInput.value = "";
        passwordInput.value = "";
    });

};

function crearUsuario() {
    var userInput = document.getElementById("userInput");
    var passwordInput1 = document.getElementById("passwordInput1");
    var passwordInput2 = document.getElementById("passwordInput2");

    var userData = userInput.value;
    var passwordData1 = passwordInput1.value;
    var passwordData2 = passwordInput2.value;

    if (passwordData1 == passwordData2) {
        firebase.auth().createUserWithEmailAndPassword(userData, passwordData1).then(function() {

            window.alert("El usuario ha sido creado");
            document.location.href = 'login.html';


        }).catch(function(error) {
            // Handle Errors here.
            var errorMessage = error.message;
            var errorCode = error.code;
            if (errorCode == "auth/invalid-email") {
                window.alert("Ingrese un correo valido");
            }
            if (errorCode == "auth/weak-password") {
                window.alert("Ingrese contraseña de 6 o mas caracteres");
            }
            if (errorCode == "auth/email-already-in-use") {
                window.alert("Usuario ya existente");
            }
        });
    } else
        window.alert("Error: Las contraseñas deben concidir");
};

async function existenDatos(variable) {
    const ref = firebase.database().ref(variable);
    ref.once("value").then(function(snapshot) {
        return snapshot.exists();
    });
};

async function obtenerVecinos() {

    var tabla_vecinos = document.getElementById("tabla_vecinos");
    var tbody = document.getElementById("tableBody");
    var loader = document.getElementById("loader");
    var noData = document.getElementById("no_hay_vecinos");

    let hayDatos = true;

    if (hayDatos) {

        var query = firebase.database().ref("Vecinos");

        query.once("value").then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var key = childSnapshot.key;
                var childData = childSnapshot.val();

                var id = document.createTextNode(key);
                var nombre = document.createTextNode(childData["nombre"]);
                var area = document.createTextNode(childData["area"]);
                var correo = document.createTextNode(childData["correo"]);

                let newRow = tbody.insertRow(-1);

                let celdaId = newRow.insertCell(0);
                let celdaNombre = newRow.insertCell(1);
                let celdaArea = newRow.insertCell(2);
                let celdaCorreo = newRow.insertCell(3);

                celdaId.appendChild(id);
                celdaNombre.appendChild(nombre);
                celdaArea.appendChild(area);
                celdaCorreo.appendChild(correo);
            });
        }).then(function() {
            loader.style.display = "none";
            tabla_vecinos.style.display = "inline-table";
        });

    } else {
        noData.style.display = "inline";
    }
};