//Background index 
const imagenbg = document.querySelector(".bodyIndexRegistro");

const imagenesFondo = ["background1.jpg", "background2.jpg", "background3.jpg", "background4.jpg", "background5.jpg"];

function cambiarImagen(fondos) {
    let random = Math.floor(Math.random() * fondos.length); 
    imagenbg.style.backgroundImage = `url("../assets/img/${imagenesFondo[random]}")`;
}

window.onload = function() {
    cambiarImagen(imagenesFondo);
}

