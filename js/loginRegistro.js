//login usuarios

//funcion para que se ejecute el codigo despues de que se cargue el DOM
document.addEventListener("DOMContentLoaded", function() {

    //variables para el formulario de login  
    const loginFormulario = document.querySelector(".loginFormulario"),
    mensaje = document.querySelector(".mensaje"),
    usuarioLogin = document.querySelector("#usuarioLogin"),
    contraseniaLogin = document.querySelector("#contraseniaLogin");

    //variables para el formulario de registro
    const registroFormulario = document.querySelector("#registroFormulario"),
    nombre = document.querySelector("#nombre"),
    usuarioRegistro = document.querySelector("#usuarioRegistro"),
    correoRegistro = document.querySelector("#correoRegistro"),
    contraseniaRegistro = document.querySelector("#contraseniaRegistro");
    
    function loginRegistro(usuarios) {
        
        let usuarioEncontrado = usuarios.find((usuario)=>{
            return usuarioLogin.value ==  usuario.usuario  && contraseniaLogin.value == usuario.contrasena ;
            
        });

        //verificar que el obejto usuario encontrado no sea null o undefined
        if (!usuarios || !usuarioLogin.value || !contraseniaLogin.value) {
            mensaje.innerHTML = "Por favor, ingresa tus credenciales";
            return;

        }else if (usuarioEncontrado){
            localStorage.setItem('nombreUsuario', usuarioEncontrado.nombre); // Guardar el nombre del usuario en localStorage
            console.log("Nombre de usuario guardado en localStorage:", localStorage.getItem('nombreUsuario'));
            location.href ="../pages/tienda.html";

        }else if (!usuarioEncontrado){
           mensaje.innerHTML = "Usuario no encontrado";
        }
    }

    //Funcion para traer la info del array usuarios del localStorage
    function recuperarLS(){
        return JSON.parse(localStorage.getItem("usuarios"));
    }

    const usuariosLS = recuperarLS();

    //evento para el formulario de login
    if(loginFormulario){
        loginFormulario.addEventListener("submit", (e)=>{
            e.preventDefault();
            loginRegistro(usuariosLS);

        });
    }

    // registro usuarios

    let usuarios;

    if(localStorage.getItem("usuarios")){
        usuarios = JSON.parse(localStorage.getItem("usuarios"));
    }else{
        usuarios = [];
    }
    console.log(usuarios);

    //Constructor de usuario
    class Usuario {
        constructor (nombre, usuario, correo, contrasena){
            this.nombre = nombre;
            this.usuario = usuario;
            this.correo = correo;
            this.contrasena = contrasena;
        }
    }

    function guardarUsuario(usuario){
        
       return usuarios.push(usuario); 
    }

    //guardar en LS
    function guardarEnLS(arr){
        return localStorage.setItem("usuarios", JSON.stringify(arr));
    }
    function mostrarNotificacion(mensaje) {
        Toastify({
          text: mensaje,
          duration: 3000
        }).showToast();
      }

    //Evento para el formulario de registro
    if(registroFormulario) {
        registroFormulario.addEventListener("submit", (e)=>{
            e.preventDefault();
            const nuevoUsuario = new Usuario(nombre.value, usuarioRegistro.value, correoRegistro.value, contraseniaRegistro.value);
            
            if (!nombre.value || !usuarioRegistro.value || !correoRegistro.value || !contraseniaRegistro.value) {
                mensaje.innerHTML = "Por favor, completa todos los campos";
                return;
            }
            else{
                    //Pusheo los datos ingresados por el usuario
                    guardarUsuario(nuevoUsuario);
                    //Lo guardo en el localStorage al array de usuarios
                    guardarEnLS(usuarios);
                    
                     mostrarNotificacion("Usuario agregado existosamente!");
            }
        });
    }
});  