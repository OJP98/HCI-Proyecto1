window.$ = window.jQuery = require('../node_modules/jquery');

function goBack() {
    window.history.back();
}

function CustomAlert() {
    this.render = function(dialog) {
        var winW = window.innerWidth;
        var winH = window.innerHeight;
        var dialogoverlay = document.getElementById('dialogoverlay');
        var dialogbox = document.getElementById('dialogbox');
        dialogoverlay.style.display = "block";
        dialogoverlay.style.height = winH + "px";
        dialogbox.style.left = (winW / 2) - (550 * .5) + "px";
        dialogbox.style.top = "100px";
        dialogbox.style.display = "block";
        document.getElementById('dialogboxhead').innerHTML = "Acknowledge This Message";
        document.getElementById('dialogboxbody').innerHTML = dialog;
        document.getElementById('dialogboxfoot').innerHTML = '<button onclick="Alert.ok()">OK</button>';
    }
    this.ok = function() {
        document.getElementById('dialogbox').style.display = "none";
        document.getElementById('dialogoverlay').style.display = "none";
    }
}

var Alert = new CustomAlert();

function deletePost(id) {
    var db_id = id.replace("post_", "");
    // Run Ajax request here to delete post from database
    document.body.removeChild(document.getElementById(id));
}

function salirSistema() {
    const remote = require('electron').remote;
    let w = remote.getCurrentWindow();
    w.close();

}

function CustomConfirm() {
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
        dialogboxfoot.innerHTML = '<button onclick="Confirm.yes(\'' + op + '\')">Enviar correo</button> <button onclick="Confirm.no()">Cancelar</button>';
    }
    this.no = function() {
        document.getElementById('dialogbox').style.display = "none";
        document.getElementById('dialogoverlay').style.display = "none";
    }
    this.yes = function(op) {

        enviarCorreo(op);

        if (op == "amarillo") {
            toastMensaje('Enviando mensaje de alerta amarilla');
        } else if (op == 'rojo') {
            toastMensaje('Enviando mensaje de alerta roja');
        }

        document.getElementById('dialogbox').style.display = "none";
        document.getElementById('dialogoverlay').style.display = "none";
    }
}

var Confirm = new CustomConfirm();

function toastMensaje(mensaje) {
    M.toast({
        html: mensaje,
        classes: 'rounded'
    });

    setTimeout(function() {
        M.toast({
            html: '¡Mensajes enviados!',
            classes: 'rounded'
        });
    }, 4500);
}


function sumarTiempo(horas, minutos, suma_tiempo) {
    minutos += suma_tiempo;
    horas = Number(horas);

    if (minutos >= 60) {
        minutos %= 60;
        horas += 1;
    }

    if (Number(minutos) < 10)
        minutos = "0" + minutos;

    horas = horas % 24;

    return (horas + ":" + minutos);
};


function graficarDatos(arrDatos, arrPred, arrTiempo) {

    let chart1 = document.getElementById('myChart');
    let ctx = chart1.getContext('2d');

    let chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: arrTiempo,
            datasets: [{
                    data: arrDatos,
                    label: "Dato real",
                    borderColor: "#3e95cd",
                    fill: false
                },
                {
                    data: arrPred,
                    label: "Dato predecido",
                    borderColor: "#8e5ea2",
                    fill: false
                }
            ]
        },

        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        suggestedMax: 3,
                        min: 0,
                        stepSize: 1
                    }
                }]
            }
        }
    });
}


var pagActual = 1;

function changePage(changePag, specificPag) {

    if (specificPag == 0) {

        if (pagActual + changePag >= 1 && pagActual + changePag <= 2) {

            pagActual += changePag;

            document.getElementById("pag1").className = "disabled";
            document.getElementById("pag2").className = "disabled";

            switch (pagActual) {
                case 1:
                    document.getElementById("pag1").className = "active";
                    break;

                case 2:
                    document.getElementById("pag2").className = "active";
                    break;
            }

            obtenerVecinos(pagActual)
        }
    }
}



"use strict";
const nodemailer = require("nodemailer");

async function enviarCorreo(tipoAlerta) {

    let mensaje = "";
    let subject = "";
    let listaVecinos = [];

    // Se obtiene el query
    let query = firebase.database().ref("Vecinos");
    // Se recorre el query
    query.once("value").then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            // Se obtiene llave / valor
            var key = childSnapshot.key;
            var childData = childSnapshot.val();

            var correo = childData["correo"];
            listaVecinos.push(correo);

            // Si llega a su fin, se termina la función
            if (key == "x")
                return true;
        });
    });

    if (tipoAlerta == 'amarillo') {
        mensaje = "Esta alerta fue enviada manualmente.\n\nVECINOS DE ANTIGUA GUATEMALA:\nPor favor, estar atentos al nivel del agua puesto que se denotó que el mismo está incrementando rápidamente.";
        subject = "ALERTA AMARILLA";

    } else if (tipoAlerta == 'rojo') {
        mensaje = "Esta alerta fue enviada manualmente.\n\nVECINOS DE ANTIGUA GUATEMALA:\nSe identificó que el nivel del agua es demasiado peligroso, por favor, evacuar el área inmediatamente.";
        subject = "ALERTA ROJA";
    }


    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: "proyectouvghci@gmail.com",
            pass: "perroUVG"
        },
        tls: {
            rejectUnathorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"PREVENCIÓN DE INUNDACIONES" <proyectouvghci@gmail.com>',
        to: listaVecinos,
        subject: subject,
        text: mensaje,
    };

    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);
}