

let lector = null;
let camaraActiva = false;

const imagenQR = document.getElementById("imagenQR");
const iniciarCamara = document.getElementById("iniciarCamara");
const detenerCamara = document.getElementById("detenerCamara");

const estadoImagen = document.getElementById("estadoImagen");
const estadoCamara = document.getElementById("estadoCamara");

// Guardar el contenido encontrado y mostrar el resultado
function procesarQR(contenido) {
    sessionStorage.setItem("contenidoQR", contenido);

    if (lector && camaraActiva) {
        detenerEscaneo();
    }

    window.location.href = "resultado-qr.html";
}

// ESCANEAR UNA IMAGEN DESDE LOS ARCHIVOS
imagenQR.addEventListener("change", async function () {

    const archivo = this.files[0];

    if (!archivo) {
        return;
    }

    estadoImagen.textContent = "Analizando imagen...";

    try {
        const lectorImagen = new Html5Qrcode("lectorQR");

        const contenido = await lectorImagen.scanFile(archivo, true);

        estadoImagen.textContent = "¡Código QR encontrado!";

        procesarQR(contenido);

    } catch (error) {
        estadoImagen.textContent =
            "No se encontró ningún código QR. Probá con otra imagen.";

    } finally {
        imagenQR.value = "";
    }
});

// ACTIVAR LA CÁMARA
iniciarCamara.addEventListener("click", async function () {

    estadoCamara.textContent = "Solicitando permiso para usar la cámara...";

    try {

        if (!window.Html5Qrcode) {
            throw new Error("No se pudo cargar el lector QR.");
        }

        if (!lector) {
            lector = new Html5Qrcode("lectorQR");
        }

        await lector.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: {
                    width: 250,
                    height: 250
                }
            },
            function (contenido) {
                procesarQR(contenido);
            },
            function () {
                // No mostrar errores por cada fotograma sin QR.
            }
        );

        camaraActiva = true;

        iniciarCamara.hidden = true;
        detenerCamara.hidden = false;

        estadoCamara.textContent = "Cámara activada. Enfocá el código QR.";

    } catch (error) {

        estadoCamara.textContent =
            "No se pudo activar la cámara. Revisá los permisos del navegador.";

        console.error(error);
    }
});

// DETENER LA CÁMARA
detenerCamara.addEventListener("click", detenerEscaneo);

async function detenerEscaneo() {

    if (lector && camaraActiva) {

        try {
            await lector.stop();
            await lector.clear();

        } catch (error) {
            console.error("Error al detener la cámara:", error);
        }
    }

    camaraActiva = false;

    iniciarCamara.hidden = false;
    detenerCamara.hidden = true;

    estadoCamara.textContent = "Cámara detenida.";
}
