async function getTiposDeCambio() {
    try {
        const res =  await fetch("https://mindicador.cl/api/");
        const data = await res.json();
    } catch (e) {
        alert(e.message);
    }
}
getTiposDeCambio();