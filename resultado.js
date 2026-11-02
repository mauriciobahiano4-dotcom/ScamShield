

// ===================================
// SCAMSHIELD - SISTEMA DE RESULTADOS
// ===================================

const estado = document.getElementById("estadoResultado");

if (estado) {

    const tipo = sessionStorage.getItem("tipoAnalisis");

    const resultado = document.getElementById("mensajeResultado");
    const original = document.getElementById("mensajeOriginal");
    const tituloOriginal = document.getElementById("tituloOriginal");
    const volver = document.getElementById("volverHerramienta");

    let texto = "";
    let alertas = [];

    // ===================================
    // RESULTADO DE SMS
    // ===================================

    if (tipo === "sms") {

        texto = sessionStorage.getItem("mensajeSMS") || "";

        tituloOriginal.textContent = "SMS analizado:";
        volver.href = "sms.html";
        volver.textContent = "← Analizar otro SMS";

        original.textContent = texto;

        const palabras = [
            "ganaste", "premio", "urgente", "verifica",
            "verificar", "contraseña", "banco",
            "transferencia", "bloqueada", "haz clic",
            "ingresa", "regalo"
        ];

        let cantidad = 0;

        palabras.forEach(function(palabra) {
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
                "No detectamos las palabras sospechosas que buscamos. Esto no garantiza que sea seguro.";
        }
    }

    // ===================================
    // RESULTADO DE ENLACES
    // ===================================

    else if (tipo === "enlace") {

        texto = sessionStorage.getItem("enlaceAnalizado") || "";

        tituloOriginal.textContent = "Enlace analizado:";
        volver.href = "enlace.html";
        volver.textContent = "← Analizar otro enlace";

        original.textContent = texto;

        let url = null;

        try {
            url = new URL(texto);
        } catch (error) {
            estado.textContent = "❌ Dirección no válida";
            resultado.textContent =
                "Ingresá una dirección completa, por ejemplo https://ejemplo.com.";
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
                resultado.textContent = alertas.join(" ");
            } else {
                estado.textContent = "🟢 Sin señales comunes detectadas";
                resultado.textContent =
                    "No encontramos señales comunes. Esto no garantiza que el enlace sea seguro.";
            }
        }
    }

    // ===================================
    // RESULTADO DE TELEFONOS
    // ===================================

    else if (tipo === "telefono") {

        texto = sessionStorage.getItem("telefonoAnalizado") || "";

        tituloOriginal.textContent = "Número analizado:";
        volver.href = "telefono.html";
        volver.textContent = "← Analizar otro número";

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
            resultado.textContent = alertas.join(" ");
        } else {
            estado.textContent = "🟢 Formato aparentemente válido";
            resultado.textContent =
                "No encontramos anomalías básicas. Esto no significa que el número sea confiable.";
        }
    }

    // ===================================
    // TIPO DE ANALISIS DESCONOCIDO
    // ===================================

    else {

        estado.textContent = "No hay un análisis disponible";
        resultado.textContent =
            "Volvé a la herramienta correspondiente e ingresá los datos.";

        original.textContent = "No hay datos disponibles.";

        volver.style.display = "none";
    }
}
