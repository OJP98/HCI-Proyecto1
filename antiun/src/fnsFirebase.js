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
    firebase.auth().languageCode = 'es';
    firebase.auth().signInWithEmailAndPassword(userData, passwordData).then(function() {

        document.location.href = 'index.html';

    }).catch(function(error) {
        var errorMessage = error.message;
        var errorCode = error.code;
        if (errorCode == "auth/invalid-email") {
            window.alert("Ingrese un usuario valido");
        }
        if (errorCode == "auth/user-not-found") {
            window.alert("Usuario no encontrado");
        }
        if (errorCode == "auth/wrong-password") {
            window.alert("Contrasena incorrecta");
        }
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
                window.alert("Ingrese un correo válido");
            }
            if (errorCode == "auth/weak-password") {
                window.alert("Ingrese contraseña de 6 o más caracteres");
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


function agregarVecino() {

    let form = document.getElementById("agregarForm")

    let correo_input = document.getElementById("mail_icon");
    let vecino_correo = correo_input.value;

    let nombre_input = document.getElementById("name_icon");
    let vecino_nombre = nombre_input.value;

    let id_input = document.getElementById("id_icon");
    let vecino_id = id_input.value;

    if (!correo_input.checkValidity() || !nombre_input.checkValidity() || !id_input.checkValidity()) {
        window.alert("Por favor, verifique que todos los campos sean válidos");
    } else {
        $("#tabla_vecinos tbody tr").remove();

        firebase.database().ref('Vecinos/' + vecino_id).set({
            nombre: vecino_nombre,
            area: "Antigua Guatemala",
            correo: vecino_correo
        });

        document.getElementById("tabla_vecinos").style.display = "none";
        document.getElementById("loader").style.display = "block";
        obtenerVecinos().then(function() {
            window.alert("Vecino agregado con éxito!");

            form.reset();

        });
    }

};

function eliminarVecino() {

    let form = document.getElementById("eliminarForm");

    let vecino_id = document.getElementById("id_vecino2").value;

    if (vecino_id == "") {
        window.alert("Por favor, ingrese el ID de un vecino.");
    } else {

        firebase.database().ref('Vecinos/' + vecino_id).remove().then(function() {
            window.alert("Vecino eliminado con éxito!");
            document.getElementById("tabla_vecinos").style.display = "none";
            document.getElementById("loader").style.display = "block";

            $("#tabla_vecinos tbody tr").remove();

            obtenerVecinos().then(function() {
                form.reset();
            });
        });
    }
};

function recuperar() {

    var emailAddress = document.getElementById("recuperar");
    var email = emailAddress.value;
    firebase.auth().languageCode = 'es';
    firebase.auth().sendPasswordResetEmail(email).then(function() {
        window.alert("El correo ha sido enviado");
        document.location.href = 'login.html';
    }).catch(function(error) {
        window.alert("Ingrese un correo valido");
    });
};

function actualizar_datos_agua() {
    let tabla_datos = document.getElementById("tabla_datos");
    let tbody = document.getElementById("tableBody");
    let query = firebase.database().ref("Datos");

    query.once("value").then(function(snapshot) {

        console.log(snapshot.numChildren());

        snapshot.forEach(function(childSnapshot) {

            let key = childSnapshot.key;
            let childData = childSnapshot.val();

            if (key == "x")
                return true;

            if (typeof childData["hora"] === 'undefined')
                return true;



            let dia = document.createTextNode(childData["dia"]);
            let minuto = document.createTextNode(childData["minuto"]);
            let hora = document.createTextNode(childData["hora"]);
            let mes = document.createTextNode(childData["mes"]);
            let nivelAgua1 = document.createTextNode(childData["nivel_agua"]);
            let nivelAgua2 = document.createTextNode(childData["nivel_agua"]);

            let hora_minuto = document.createTextNode(childData["hora"] + ":" + childData["minuto"]);

            let newRow = tbody.insertRow(-1);

            let celdaFecha = newRow.insertCell(0);
            let celdaNivelAgua = newRow.insertCell(1);
            let celdaPrediccion = newRow.insertCell(2);

            celdaFecha.appendChild(hora_minuto);
            celdaNivelAgua.appendChild(nivelAgua1);
            celdaPrediccion.appendChild(nivelAgua2);
        });
    }).then(function() {
        tabla_datos.style.display = "inline-table";
    });
}