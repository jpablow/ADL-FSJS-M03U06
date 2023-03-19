const ctx = document.getElementById('myChart');
const btn = document.querySelector("button");
const fx_code = document.querySelector("#fx_code");
const fx_clp = document.querySelector("#fx_clp");
let fx = document.querySelector("#fx_options");
// var dataDay = [];
let grafico;
let etiquetas = [];
let datos = [];

async function getDayFX() {
    try {
        const result = await fetch("https://mindicador.cl/api/");
        const dataD = await result.json();
        dataDay = dataD;
    } catch (e) {
        alert(e.message);
    };
};

async function getFX() {
    try {
        const res = await fetch("https://mindicador.cl/api/" + fx.value);
        const data = await res.json();
        for (let i = 0; i < 10; i++) {
            etiquetas[i] = data.serie[i].fecha.substr(0, 10);
            datos[i] = data.serie[i].valor;
        };
        etiquetas.reverse();
        datos.reverse();
        renderCanvas();
    } catch (e) {
        alert(e.message);
    };
};

function toCapitalLetter (text) {
    str = text.toString();
    return str.charAt(0).toUpperCase() + str.substr(1, 30).toLowerCase();
};

function renderCanvas() {
    if (grafico) {
        grafico.destroy();
    };
    switch (fx.value) {
        case "uf":
        case "utm":
            var chartLabel = fx.value.toUpperCase();
            break;
        case "dolar":
        case "euro":
            var chartLabel = toCapitalLetter(fx.value);
    };
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

function showFX() {
    switch (fx.value) {
        case "uf":
            fx_code.innerHTML = fx.value.toUpperCase();
            fx_clp.innerHTML = dataDay.uf.valor;
            break;
        case "dolar":
            fx_code.innerHTML = toCapitalLetter(fx.value);
            fx_clp.innerHTML = dataDay.dolar.valor;
            break;
        case "euro":
            fx_code.innerHTML = toCapitalLetter(fx.value);
            fx_clp.innerHTML = dataDay.euro.valor;
            break;
        case "utm":
            fx_code.innerHTML = fx.value.toUpperCase();
            fx_clp.innerHTML = dataDay.utm.valor;
    };
};

btn.addEventListener("click", getFX);
fx.addEventListener("change", showFX);
window.addEventListener("load", getDayFX);