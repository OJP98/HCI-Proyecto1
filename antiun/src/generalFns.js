window.$ = window.jQuery = require('../node_modules/jquery');

function goBack() {
    window.history.back();
}

function CustomAlert() {
    this.render = function (dialog) {
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
    this.ok = function () {
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
    this.render = function (dialog, op) {
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
    this.no = function () {
        document.getElementById('dialogbox').style.display = "none";
        document.getElementById('dialogoverlay').style.display = "none";
    }
    this.yes = function (op) {

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

    setTimeout(function () {
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

    if (minutos < 10)
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
                    label: "Datos reales",
                    borderColor: "#3e95cd",
                    fill: false
                },
                {
                    data: arrPred,
                    label: "Datos predecidos",
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