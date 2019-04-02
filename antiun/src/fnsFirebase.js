/* eslint-disable indent */

const src = "https://www.gstatic.com/firebasejs/5.7.1/firebase.js";

var CerrarSesionConfirm = new CerrarSesionConfirm();


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

    var userData = userInput.value;
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


async function obtenerVecinos(pagina) {

    // Inicialización de variables
    var query;
    let contador = 0;
    let skip = (5 * pagina) - 5;
    let last = 5 * pagina;

    // Getters de la página web
    var tabla_vecinos = document.getElementById("tabla_vecinos");
    var tbody = document.getElementById("tableBody");
    var loader = document.getElementById("loader");

    // Se le hace un reset a la tabla y se hace visible el loader
    $("#tabla_vecinos tbody tr").remove();
    loader.style.display = "block";

    // Se obtiene el query
    query = firebase.database().ref("Vecinos");

    // Se recorre el query
    query.once("value").then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {

            contador += 1;

            // Si el rango está en la cantidad de dato consultados...
            if (contador > skip && contador <= last) {

                // Se obtiene llave / valor
                var key = childSnapshot.key;
                var childData = childSnapshot.val();

                // Se crea el nodo de cada variable
                var id = document.createTextNode(key);
                var nombre = document.createTextNode(childData["nombre"]);
                var area = document.createTextNode(childData["area"]);
                var correo = document.createTextNode(childData["correo"]);

                // Si llega a su fin, se termina la función
                if (key == "x")
                    return true;

                // Se inserta una nueva fila
                let newRow = tbody.insertRow(-1);

                // Se insertan celdas a la fila
                let celdaId = newRow.insertCell(0);
                let celdaNombre = newRow.insertCell(1);
                let celdaArea = newRow.insertCell(2);
                let celdaCorreo = newRow.insertCell(3);

                // Se insertan datos a la celda
                celdaId.appendChild(id);
                celdaNombre.appendChild(nombre);
                celdaArea.appendChild(area);
                celdaCorreo.appendChild(correo);
            }
        });

    }).then(function() {

        // Luego, se quita el loader y se muestra la tabla
        loader.style.display = "none";
        tabla_vecinos.style.display = "inline-table";
    });
};


async function agregarVecino() {
    let form = document.getElementById("agregarForm")

    let correo_input = document.getElementById("mail_icon");
    let vecino_correo = correo_input.value;

    let nombre_input = document.getElementById("name_icon");
    let vecino_nombre = nombre_input.value;

    var query = firebase.database().ref("Vecinos");
    var b = 0;

    query.once("value").then(function(snapshot) {
        var a = JSON.stringify(snapshot.numChildren());
        b = parseInt(a);
        if ((b - 1) > 0) {
            b = b - 1;
        } else {
            b = 0;
        }
        //aqi va codigo
        b = b + 1;


        if (!correo_input.checkValidity() || !nombre_input.checkValidity()) {
            window.alert("Por favor, verifique que todos los campos sean válidos");
        } else {
            $("#tabla_vecinos tbody tr").remove();

            firebase.database().ref('Vecinos/x').set({
                Contador: b
            });

            firebase.database().ref('Vecinos/' + b).set({
                nombre: vecino_nombre,
                area: "Antigua Guatemala",
                correo: vecino_correo
            });

            document.getElementById("tabla_vecinos").style.display = "none";
            document.getElementById("loader").style.display = "block";
            obtenerVecinos(pagActual).then(function() {
                window.alert("Vecino agregado con éxito!");

                form.reset();

            });
        }
    })
};


function eliminarVecino() {
    let form = document.getElementById("eliminarForm");
    let vecino_id_input = document.getElementById("id_vecino2");
    let vecino_id = vecino_id_input.value;

    if (vecino_id == "") {
        window.alert("Por favor, ingrese el ID de un vecino.");
    } else if (vecino_id <= 0) {
        vecino_id_input.className = "validate invalid"
    } else {

        firebase.database().ref('Vecinos/' + vecino_id).remove().then(function() {
            window.alert("Vecino eliminado con éxito!");
            document.getElementById("tabla_vecinos").style.display = "none";
            document.getElementById("loader").style.display = "block";

            $("#tabla_vecinos tbody tr").remove();

            obtenerVecinos(pagActual).then(function() {
                form.reset();
            });

        }).catch(function(error) {
            vecino_id_input.className = "validate invalid";
        });
    }
};


async function eliminarVecino2() {
    let form = document.getElementById("eliminarForm");
    var correo_input = document.getElementById("mail_icon7");
    var correo_val = correo_input.value
    let existe = false;
    let contador = 0;


    var query = firebase.database().ref("Vecinos");
    query.once("value").then(function(snapshot) {

        let numeroHijos = snapshot.numChildren();

        snapshot.forEach(function(childSnapshot) {

            contador += 1;

            var key = childSnapshot.key;
            var childData = childSnapshot.val();

            var id = document.createTextNode(key);
            var correo = childData["correo"];


            if (correo === correo_val) {

                existe = true;

                firebase.database().ref('Vecinos/' + key).remove().then(function() {
                    window.alert("Vecino eliminado con éxito!");
                    document.getElementById("tabla_vecinos").style.display = "none";
                    document.getElementById("loader").style.display = "block";
                    $("#tabla_vecinos tbody tr").remove();

                    obtenerVecinos(pagActual).then(function() {
                        form.reset();
                    });

                }).catch(function(error) {

                    vecino_id_input.className = "validate invalid";
                });
            }

            if (contador == numeroHijos && !existe) {
                window.alert("El correo ingresado no existe");
            }

        });
    });

};


async function editarVecino2() {
    let form = document.getElementById("editarForm");
    var correo_input = document.getElementById("mail_icon3");
    var correo_val = correo_input.value
    let hayDatos = true;
    if (hayDatos) {
        var query = firebase.database().ref("Vecinos");
        query.once("value").then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var key = childSnapshot.key;
                var childData = childSnapshot.val();
                var id = document.createTextNode(key);
                var correo = childData["correo"];
                var correo_val2 = correo.value
                if (correo === correo_val) {
                    let form = document.getElementById("editarForm");
                    let vecino_name_input = document.getElementById("name_icon3");
                    let vecino_name = vecino_name_input.value;
                    let vecino_mail_input = document.getElementById("mail_icon3");
                    let vecino_mail = vecino_mail_input.value;
                    firebase.database().ref('Vecinos/' + key).set({
                        nombre: vecino_name,
                        area: "Antigua Guatemala",
                        correo: vecino_mail
                    });

                    $("#tabla_vecinos tbody tr").remove();
                    obtenerVecinos(pagActual).then(function() {
                        window.alert("Vecino editado con éxito!");
                        form.reset();

                    });
                } else {
                    window.alert("El correo no existe, por favor verificar");
                }
            });
        });
    }
};


function editarVecino() {

    let form = document.getElementById("editarForm");
    let vecino_id_input = document.getElementById("id_vecino3");
    let vecino_id = vecino_id_input.value;
    let vecino_name_input = document.getElementById("name_icon3");
    let vecino_name = vecino_name_input.value;
    let vecino_mail_input = document.getElementById("mail_icon3");
    let vecino_mail = vecino_mail_input.value;

    if (vecino_id == "") {
        window.alert("Por favor, ingrese el ID de un vecino.");
    } else if (vecino_id <= 0) {
        vecino_id_input.className = "validate invalid"
    } else {

        firebase.database().ref('Vecinos/' + vecino_id).set({
            nombre: vecino_name,
            area: "Antigua Guatemala",
            correo: vecino_mail


        });
    }
    $("#tabla_vecinos tbody tr").remove();
    obtenerVecinos(pagActual).then(function() {
        window.alert("Vecino editado con éxito!");

        form.reset();
    });
};


function verData() {
    console.log(firebase.database().ref("Vecinos"));
};


function recuperar() {

    var emailAddress = document.getElementById("userInput");
    var email = emailAddress.value;
    firebase.auth().languageCode = 'es';
    firebase.auth().sendPasswordResetEmail(email).then(function() {
        window.alert("El correo ha sido enviado");
        document.location.href = 'login.html';
    }).catch(function(error) {
        window.alert("Ingrese un correo valido");
    });
};


function cerrarSesion() {

    CerrarSesionConfirm.render('¿Quiere cerrar la sesión?');
};


function cargarMenuPrincipal() {

    let nombreUsuario = document.getElementById("nombreUsuario");
    let contenido = document.getElementById("contenidoGeneral");
    let loader = document.getElementById("loader");

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            let user = (firebase.auth().currentUser)["email"];
            nombreUsuario.innerHTML = user.substring(0, user.indexOf('@'));
            GetNivelAguaActual();
            loader.style.display = 'none';
            contenido.style.display = 'block';
        } else {
            document.location.href = 'login.html';
        }
    });
};


function actualizar_datos_agua() {

    let tabla_datos = document.getElementById("tabla_datos");
    let tbody = document.getElementById("tableBody");
    let query = firebase.database().ref("Datos").limitToLast(12);
    let loader = document.getElementById("loader");

    var items = [];
    let ultima_hora = "0";
    let hora;
    let minutos;
    var datos = [];
    var datosPredecidos = [];
    var horasLista = [];


    query.once("value").then(function(snapshot) {

        snapshot.forEach(function(childSnapshot) {

            // Inicialización de variables
            let key = childSnapshot.key;
            let childData = childSnapshot.val();

            let nivelAguaPred;
            let nivelAgua;
            let hora_minuto;

            // Cuando llega al contador, detiene el ciclo que recorre los datos
            if (key == "x")
                return true;

            // Obitene datos generales
            let dia = document.createTextNode(childData["dia"]);
            let mes = document.createTextNode(childData["mes"]);


            // Si no hay dato, lo reemplaza por 3 guiones
            if (typeof childData["nivel_agua"] === 'undefined')
                nivelAgua = document.createTextNode("---");
            else
                nivelAgua = document.createTextNode(childData["nivel_agua"]);

            datos.push(parseInt(nivelAgua.data));


            // Si no hay prediccion, lo reemplaza por 3 guiones
            if (typeof childData["nivel_agua_p"] === 'undefined')
                nivelAguaPred = document.createTextNode("---");
            else
                nivelAguaPred = document.createTextNode(childData["nivel_agua_p"]);

            datosPredecidos.push(parseInt(nivelAguaPred.data));


            // Si el dato es predecido...
            if (typeof childData["hora"] === 'undefined') {

                // Si es la primera vez que aparece un dato predecido...
                if (ultima_hora == "0") {

                    // Se postea la última hora en la base de datos + segundos de predicción
                    ultima_hora = (items[items.length - 1]).data;
                    hora = ultima_hora.substring(0, ultima_hora.indexOf(':'));
                    minutos = parseInt(ultima_hora.substring(ultima_hora.indexOf(':') + 1, ultima_hora.length));

                }

                // Si el dato es predecido y ya se obtuvo la última hora, solo se va sumando
                hora_minuto = sumarTiempo(hora, minutos, 1);
                hora = hora_minuto.substring(0, hora_minuto.indexOf(':'));
                minutos = hora_minuto.substring(hora_minuto.indexOf(':') + 1, hora_minuto.length);
                hora_minuto = document.createTextNode(hora + ":" + minutos);
                minutos = parseInt(minutos, 10)

                // Por lo contrario, se postea el dato de firebase
            } else {
                hora_minuto = document.createTextNode(childData["hora"] + ":" + childData["minuto"]);
                items.push(hora_minuto);
            }
            horasLista.push(hora_minuto.data);

            // Se inserta una nueva  fila
            let newRow = tbody.insertRow(-1);

            // A dicha fila se insertan los valores de fecha, nivel de agua y predicción
            let celdaFecha = newRow.insertCell(0);
            let celdaNivelAgua = newRow.insertCell(1);
            let celdaPrediccion = newRow.insertCell(2);

            // A dicha celda se le insertan sus respectivos valores
            celdaFecha.appendChild(hora_minuto);
            celdaNivelAgua.appendChild(nivelAgua);
            celdaPrediccion.appendChild(nivelAguaPred);
        });

    }).then(function() {
        // Se quita el loader y se muestra la tabla
        loader.style.display = "none";
        tabla_datos.style.display = "inline-table";

        graficarDatos(datos, datosPredecidos, horasLista);

    });
};



function CerrarSesionConfirm() {

    this.render = function(dialog, op) {
        let winW = window.innerWidth;
        let winH = window.innerHeight;

        let dialogoverlay = document.getElementById('dialogoverlay');
        let dialogbox = document.getElementById('dialogbox');
        let dialogboxbody = document.getElementById('dialogboxbody');
        let dialogboxfoot = document.getElementById('dialogboxfoot');
        let dialogboxhead = document.getElementById('dialogboxhead');

        dialogoverlay.style.display = "block";
        dialogoverlay.style.height = winH + "px";

        dialogbox.style.left = (winW / 2) - (550 * .5) + "px";
        dialogbox.style.top = "100px";
        dialogbox.style.display = "block";

        // dialogboxhead.style.backgroundColor = "#64b5f6";
        // dialogboxfoot.style.backgroundColor = "#64b5f6";
        // dialogboxbody.style.backgroundColor = "#bbdefb";

        dialogboxhead.innerHTML = "Ventana de confirmación";
        dialogboxbody.innerHTML = dialog;
        dialogboxfoot.innerHTML = '<button onclick="CerrarSesionConfirm.yes(\'' + op + '\')">Cerrar sesión</button> <button onclick="CerrarSesionConfirm.no()">Cancelar</button>';
    }
    this.no = function() {
        document.getElementById('dialogbox').style.display = "none";
        document.getElementById('dialogoverlay').style.display = "none";
    }
    this.yes = function() {

        firebase.auth().languageCode = 'es';
        firebase.auth().signOut().then(function() {

            // Sign-out successful.
            document.location.href = 'login.html';
        }).catch(function(error) {
            // An error happened.
            window.alert("No se ha podido cerrar sesión");
        });

        document.getElementById('dialogbox').style.display = "none";
        document.getElementById('dialogoverlay').style.display = "none";
    }
};


function GetNivelAguaActual() {

    let ultimo_nivel_agua;
    let urlImagen = "";
    let query = firebase.database().ref("Datos");

    query.once("value").then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {

            let key = childSnapshot.key;
            let childData = childSnapshot.val();

            if (typeof childData["nivel_agua"] === 'undefined') {

                switch (ultimo_nivel_agua) {
                    case 0:
                        urlImagen = "url( '../Imgs/Inicio0.png')";
                        break;
                    case 1:
                        urlImagen = "url( '../Imgs/Inicio1.png')";
                        break;
                    case 2:
                        urlImagen = "url( '../Imgs/Inicio2.png')";
                        break;
                    case 3:
                        urlImagen = "url( '../Imgs/Inicio3.png')";
                        break
                }
                document.body.style.backgroundImage = urlImagen;

            } else {
                ultimo_nivel_agua = childData["nivel_agua"];
            }
        });
    });
};