const ctx = document.getElementById('myChart');
const btn = document.querySelector("button");
const input = document.querySelector("#input");
const fx_code = document.querySelector("#fx_code");
const calc_code = document.querySelector("#calc_code");
const calc_result = document.querySelector("#calc_result");
const fx_clp = document.querySelector("#fx_clp");
const opt1 = document.querySelector("#opt1");
const opt2 = document.querySelector("#opt2");
const opt3 = document.querySelector("#opt3");
const opt4 = document.querySelector("#opt4");
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
    calc_result.innerHTML = calc_val.toLocaleString("es-CL"); //Averiguar cómo redondear y dar formato de número.
    calc_code.innerHTML = c_code;
};

async function getDayFX() {
    try {
        const result = await fetch("https://mindicador.cl/api/");
        const dataD = await result.json();
        dataDay = dataD;
        opt1.innerHTML = dataDay.uf.nombre;
        opt1.value = dataDay.uf.codigo;
        opt2.innerHTML = dataDay.dolar.nombre;
        opt2.value = dataDay.dolar.codigo;
        opt3.innerHTML = dataDay.euro.nombre;
        opt3.value = dataDay.euro.codigo;
        opt4.innerHTML = dataDay.utm.nombre;
        opt4.value = dataDay.utm.codigo;
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
            fx_code.innerHTML = `1 ${fx.value.toUpperCase()}`;
            fx_clp.innerHTML = `$${dataDay.uf.valor.toLocaleString("es-CL")} ${dataDay.uf.unidad_medida}`;
            break;
        case "dolar":
            fx_code.innerHTML = `1 ${toCapitalLetter(fx.value)}`;
            fx_clp.innerHTML = `$${dataDay.dolar.valor.toLocaleString("es-CL")} ${dataDay.dolar.unidad_medida}`;
            break;
        case "euro":
            fx_code.innerHTML = `1 ${toCapitalLetter(fx.value)}`;
            fx_clp.innerHTML = `$${dataDay.euro.valor.toLocaleString("es-CL")} ${dataDay.euro.unidad_medida}`;
            break;
        case "utm":
            fx_code.innerHTML = `1 ${fx.value.toUpperCase()}`;
            fx_clp.innerHTML = `$${dataDay.utm.valor.toLocaleString("es-CL")} ${dataDay.utm.unidad_medida}`;
    };
};

btn.addEventListener("click", getFX);
fx.addEventListener("change", showFX);
window.addEventListener("load", getDayFX);