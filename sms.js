
// ===================================
// SCAMSHIELD - ANALIZADOR DE SMS
// ===================================

const botonSMS = document.getElementById("analizarSms");

botonSMS.addEventListener("click", function() {

    const mensaje = document.getElementById("mensaje").value.trim();

    if (mensaje === "") {
        alert("Por favor, pegá un mensaje para analizar.");
        return;
    }

    sessionStorage.setItem("tipoAnalisis", "sms");
    sessionStorage.setItem("mensajeSMS", mensaje);

    window.location.href = "resultado.html";

});
