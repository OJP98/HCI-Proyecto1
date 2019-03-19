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
}


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