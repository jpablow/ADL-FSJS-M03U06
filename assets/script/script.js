const ctx = document.getElementById('myChart');
const btn = document.querySelector("button");
let fx = document.querySelector("#fx_options");
let grafico;
let etiquetas = [];
let datos = [];

async function getFX() {
    try {
        const res = await fetch("https://mindicador.cl/api/" + fx.value);
        const data = await res.json();
        for (let i = 0; i < 10; i++) {
            etiquetas[i] = data.serie[i].fecha;
            datos[i] = data.serie[i].valor;
        };
        etiquetas.reverse();
        datos.reverse();
        renderCanvas();
    } catch (e) {
        alert(e.message);
    };
};

function renderCanvas() {
    if (grafico) {
        grafico.destroy();
    };
    let chartLabel = fx.value.toUpperCase();
    grafico = new Chart(ctx, {
        type: 'line',
        data: {
            labels: etiquetas,
            datasets: [{
                label: 'Valor de: ' + chartLabel,
                data: datos,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
};

btn.addEventListener("click", getFX);