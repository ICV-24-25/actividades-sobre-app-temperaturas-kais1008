let temperaturas = [];
let localidades = [];
const diasSemana = ["L", "M", "X", "J", "V", "S", "D"];

fetch("datos.json")
    .then(response => response.json())
    .then(datos => {
        console.log(datos);

        // Guardamos las localidades
        localidades = datos.localidades;

        // Extraemos las temperaturas en un formato adecuado
        temperaturas = datos.localidades.map(loc => loc.temperaturas);

        console.log("Temperaturas cargadas:", temperaturas);

        // Llenamos el select con las localidades
        setSelectLocalidades();
    })
    .catch(error => console.error("El fichero no existe", error))
    .finally(() => console.log("Terminado."));

// 🔹 Llenar el select de localidades
function setSelectLocalidades() {
    let select = document.getElementById("localidad");
    if (!select) {
        console.error("No se encontró el select con id 'localidad'");
        return;
    }

    select.innerHTML = `<option disabled selected hidden value="">Selecciona una localidad</option>`; // Reset

    localidades.forEach((loc, index) => {
        let option = document.createElement("option");
        option.value = index;
        option.textContent = loc.nombre;
        select.appendChild(option);
    });

    console.log("Localidades agregadas al select.");
}

// 🔹 Calcular media de temperatura en una localidad
function avglocalidad() {
    let select = document.getElementById("localidad");
    let resultado = document.getElementById("res_avglocalidad");

    if (!select || !resultado) return;

    let localidadIndex = parseInt(select.value);
    if (isNaN(localidadIndex)) {
        resultado.textContent = "⚠️ Selecciona una localidad.";
        return;
    }

    let datosTemp = temperaturas[localidadIndex];

    if (!datosTemp || datosTemp.length === 0) {
        resultado.textContent = "⚠️ No hay datos para esta localidad.";
        return;
    }

    let suma = 0;
    datosTemp.forEach(temp => {
        suma += parseInt(temp.max); // Sumamos las temperaturas máximas
    });

    let media = datosTemp.reduce((sum, temp) => sum + parseInt(temp.max), 0) / datosTemp.length;
    resultado.textContent = `🌡️ Media: ${media.toFixed(2)}°C`;
}

// 🔹 Calcular media de temperatura en un día
function avgdia() {
    let selectDia = document.getElementById("dia");
    let resultado = document.getElementById("res_avgdia");

    if (!selectDia || !resultado) return;

    let diaSeleccionado = selectDia.value;
    let diaIndex = diasSemana.indexOf(diaSeleccionado);

    if (diaIndex === -1) {
        resultado.textContent = "⚠️ Selecciona un día.";
        return;
    }

    let suma = 0, count = 0;

    temperaturas.forEach(localidad => {
        if (localidad[diaIndex]) {
            suma += parseInt(localidad[diaIndex].max);
            count++;
        }
    });

    if (count === 0) {
        resultado.textContent = "⚠️ No hay datos para este día.";
        return;
    }

    let media = suma / count;
    resultado.textContent = `🌡️ Media: ${media.toFixed(2)}°C`;
}

// 🔹 Calcular media de temperatura general
function avg() {
    let resultado = document.getElementById("res_avg");
    if (!resultado) return;

    let totalTemp = 0, count = 0;

    temperaturas.forEach(localidad => {
        localidad.forEach(dia => {
            totalTemp += parseInt(dia.max);
            count++;
        });
    });

    if (count === 0) {
        resultado.textContent = "⚠️ No hay datos disponibles.";
        return;
    }

    let media = totalTemp / count;
    resultado.textContent = `🌡️ Media total: ${media.toFixed(2)}°C`;
}

// 🔹 Asociar eventos a los botones
document.getElementById("avgdia").addEventListener("click", avgdia);
document.getElementById("avg").addEventListener("click", avg);
