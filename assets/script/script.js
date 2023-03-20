const ctx = document.getElementById('myChart');
const btn = document.querySelector("button");
const input = document.querySelector("#input");
const fx_code = document.querySelector("#fx_code");
const calc_code = document.querySelector("#calc_code");
const calc_result = document.querySelector("#calc_result");
const fx_clp = document.querySelector("#fx_clp");
let fx = document.querySelector("#fx_options");
let grafico;
let etiquetas = [];
let datos = [];

function calcFX () {
    switch (fx.value) {
        case "uf":
            var calc_val = Number(input.value) / Number(dataDay.uf.valor);
            var c_code = fx.value.toUpperCase();
            break;
        case "dolar":
            var calc_val = Number(input.value) / Number(dataDay.dolar.valor);
            var c_code = toCapitalLetter(fx.value);
            break;
        case "euro":
            var calc_val = Number(input.value) / Number(dataDay.euro.valor);
            var c_code = toCapitalLetter(fx.value);
            break;
        case "utm":
            var calc_val = Number(input.value) / Number(dataDay.utm.valor);
            var c_code = fx.value.toUpperCase();
    };
    calc_result.innerHTML = calc_val; //Averiguar cómo redondear y dar formato de número.
    calc_code.innerHTML = c_code; //Revisar por qué no aparece el código en el html, de hecho elimina el span.
};

async function getDayFX() {
    try {
        const result = await fetch("https://mindicador.cl/api/");
        const dataD = await result.json();
        dataDay = dataD;
    } catch (e) {
        alert(e.message);
    };
};

async function getFX () {
    try {
        const res = await fetch("https://mindicador.cl/api/" + fx.value);
        const data = await res.json();
        for (let i = 0; i < 10; i++) {
            etiquetas[i] = data.serie[i].fecha.substr(0, 10);
            datos[i] = data.serie[i].valor;
        };
        etiquetas.reverse();
        datos.reverse();
        calcFX();
        renderCanvas(); //Si el FX no ha cambiado, no renderizar.
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