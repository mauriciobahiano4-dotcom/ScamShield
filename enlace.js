
// ===================================
// SCAMSHIELD - ANALIZADOR DE ENLACES
// ===================================

const botonEnlace = document.getElementById("analizarEnlace");

botonEnlace.addEventListener("click", function() {

    const enlace = document.getElementById("enlace").value.trim();

    if (enlace === "") {
        alert("Ingresá un enlace para analizar.");
        return;
    }

    sessionStorage.setItem("tipoAnalisis", "enlace");
    sessionStorage.setItem("enlaceAnalizado", enlace);

    window.location.href = "resultado.html";

});
