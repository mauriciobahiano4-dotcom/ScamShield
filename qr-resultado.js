
const contenido = sessionStorage.getItem("contenidoQR");

const estado = document.getElementById("estadoQRResultado");
const descripcion = document.getElementById("descripcionQR");
const original = document.getElementById("contenidoQR");

if (!contenido) {

    estado.textContent = "No se encontró información.";
    descripcion.textContent = "Volvé a escanear un código QR.";

} else {

    original.textContent = contenido;

    try {

        const url = new URL(contenido);

        if (url.protocol !== "https:") {

            estado.textContent = "⚠️ QR con enlace para revisar";

            descripcion.textContent =
                "El código contiene un enlace que no utiliza HTTPS. Revisá su procedencia antes de abrirlo.";

        } else if (
            url.hostname.includes("xn--") ||
            url.hostname.split(".").length >= 5
        ) {

            estado.textContent = "⚠️ QR sospechoso";

            descripcion.textContent =
                "El dominio presenta características que merecen atención.";

        } else {

            estado.textContent = "🟢 Sin señales comunes detectadas";

            descripcion.textContent =
                "El enlace no presenta las señales básicas que buscamos. Esto no garantiza que sea seguro.";

        }

    } catch (error) {

        estado.textContent = "ℹ️ Código QR con texto";

        descripcion.textContent =
            "El código contiene texto y no una dirección web reconocible. Revisá la información antes de utilizarla.";

    }

}
