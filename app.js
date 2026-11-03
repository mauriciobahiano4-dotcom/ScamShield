

// ===================================
// ANALIZADOR DE SMS
// ===================================

const botonSMS = document.getElementById("analizarSms");

if (botonSMS) {
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
}


// ===================================
// ANALIZADOR DE ENLACES
// ===================================

const botonEnlace = document.getElementById("analizarEnlace");

if (botonEnlace) {
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
}


// ===================================
// ANALIZADOR DE TELEFONOS
// ===================================

const botonTelefono = document.getElementById("analizarTelefono");

if (botonTelefono) {
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
}


// ===================================
// MOSTRAR RESULTADOS
// ===================================

const estado = document.getElementById("estadoResultado");

if (estado) {

    const tipo = sessionStorage.getItem("tipoAnalisis") || "sms";

    const resultado = document.getElementById("mensajeResultado");
    const original = document.getElementById("mensajeOriginal");

    let texto = "";
    let alertas = [];

    // RESULTADO DE SMS

    if (tipo === "sms") {

        texto = sessionStorage.getItem("mensajeSMS") || "";
        original.textContent = texto;

        const palabrasSospechosas = [
            "ganaste", "premio", "urgente", "verifica",
            "verificar", "contraseña", "banco",
            "transferencia", "bloqueada", "haz clic",
            "ingresa", "regalo"
        ];

        let cantidad = 0;

        palabrasSospechosas.forEach(function(palabra) {
            if (texto.toLowerCase().includes(palabra)) {
                cantidad++;
            }
        });

        if (cantidad >= 2) {
            estado.textContent = "⚠️ Mensaje sospechoso";
            resultado.textContent =
                "Encontramos varias señales que podrían indicar un intento de estafa.";
        } else if (cantidad === 1) {
            estado.textContent = "🟠 Revisá este mensaje";
            resultado.textContent =
                "Encontramos una señal que merece atención.";
        } else {
            estado.textContent = "🟢 Sin señales comunes detectadas";
            resultado.textContent =
                "No detectamos las palabras sospechosas que buscamos. Esto no garantiza que el mensaje sea seguro.";
        }
    }


    // RESULTADO DE ENLACES

    else if (tipo === "enlace") {

        texto = sessionStorage.getItem("enlaceAnalizado") || "";
        original.textContent = texto;

        let url = null;

        try {
            url = new URL(texto);
        } catch (error) {
            estado.textContent = "❌ Dirección no válida";
            resultado.textContent =
                "Ingresá una dirección web completa, por ejemplo https://ejemplo.com.";
        }

        if (url !== null) {

            const dominio = url.hostname.toLowerCase();

            if (url.protocol !== "https:") {
                alertas.push("No utiliza HTTPS.");
            }

            if (url.username || url.password) {
                alertas.push("Contiene datos de usuario en la dirección.");
            }

            if (dominio.includes("xn--")) {
                alertas.push("Contiene caracteres codificados en el dominio.");
            }

            if (dominio.split(".").length >= 5) {
                alertas.push("Tiene varios subdominios.");
            }

            const acortadores = [
                "bit.ly", "tinyurl.com", "t.co",
                "is.gd", "cutt.ly", "shorturl.at"
            ];

            if (acortadores.includes(dominio)) {
                alertas.push("Utiliza un servicio de enlaces acortados.");
            }

            if (/^\d{1,3}(\.\d{1,3}){3}$/.test(dominio)) {
                alertas.push("Utiliza una dirección IP en lugar de un dominio habitual.");
            }

            if (alertas.length > 0) {
                estado.textContent = "⚠️ Enlace para revisar";
                resultado.textContent = alertas.join(" ") +
                    " No abras el enlace si no confiás en su origen.";
            } else {
                estado.textContent = "🟢 Sin señales comunes detectadas";
                resultado.textContent =
                    "No encontramos las señales que buscamos. Esto no garantiza que el enlace sea seguro.";
            }
        }
    }


    // RESULTADO DE TELEFONOS

    else if (tipo === "telefono") {

        texto = sessionStorage.getItem("telefonoAnalizado") || "";
        original.textContent = texto;

        const digitos = texto.replace(/\D/g, "");

        if (/[a-zA-Z]/.test(texto)) {
            alertas.push("El número contiene letras.");
        }

        if (digitos.length < 7) {
            alertas.push("Tiene menos de 7 dígitos.");
        }

        if (digitos.length > 15) {
            alertas.push("Supera los 15 dígitos.");
        }

        if (/^(\d)\1+$/.test(digitos)) {
            alertas.push("Está formado por un mismo dígito repetido.");
        }

        if (alertas.length > 0) {
            estado.textContent = "⚠️ Número para revisar";
            resultado.textContent = alertas.join(" ") +
                " Verificá el número antes de devolver la llamada.";
        } else {
            estado.textContent = "🟢 Formato aparentemente válido";
            resultado.textContent =
                "No encontramos anomalías básicas en el formato. Esto no significa que el número sea confiable ni que no esté relacionado con una estafa.";
        }
    }

}
