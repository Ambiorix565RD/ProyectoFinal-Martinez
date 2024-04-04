//Background index 
const imagenbgRegistro  = document.querySelector("#bodyRegistro");

const imagenesFondo = ["background1.jpg", "background2.jpg", "background3.jpg", "background4.jpg", "background5.jpg"];

function cambiarImagen(fondos) {
    let random = Math.floor(Math.random() * fondos.length); 
    imagenbgRegistro.style.backgroundImage = `url("../assets/img/${imagenesFondo[random]}")`;
}

window.onload = function() {
    cambiarImagen(imagenesFondo);
}

