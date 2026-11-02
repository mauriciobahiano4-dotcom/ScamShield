
// ===================================
// SCAMSHIELD - ANALIZADOR DE TELEFONOS
// ===================================

const botonTelefono = document.getElementById("analizarTelefono");

botonTelefono.addEventListener("click", function() {

    const telefono = document.getElementById("telefono").value.trim();

    if (telefono === "") {
        alert("Ingresá un número de teléfono.");
        return;
    }

    sessionStorage.setItem("tipoAnalisis", "telefono");
    sessionStorage.setItem("telefonoAnalizado", telefono);

    window.location.href = "resultado.html";

});
