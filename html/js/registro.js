let btn_registro = document.getElementById("btn_registro");
btn_registro.addEventListener("click",almacenarUsuarios);

//1. Creamos una clase Usuario
class Usuario {
    constructor(id, usuario,contrasenia, tipo){
        this.usuario = usuario; //string
        this.id = id; //string
        this.contrasenia = contrasenia; //string
        this.tipo  = tipo;//string
    }
}

//2. Función para pasar la información de form a una colección de usuarios
function almacenarContactosColeccion(){
    let user = document.getElementById("usuario").value;
    let id = ;
    let password = document.getElementById("contrasenia").value;
    let type = document.getElementById("tipoCuenta").value;

    let auxUsuario = new Usuario(id,user,password,type);
    user = "";
    id = "";
    password = "";
    type ="";
}


// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

//Your web app's Firebase configuration
    const firebaseConfig = {
    apiKey: "AIzaSyAIPgErK_AibeICQR4qrQT7hyxVywJtAsQ",
    authDomain: "databeachvolley.firebaseapp.com",
    projectId: "databeachvolley",
    storageBucket: "databeachvolley.appspot.com",
    messagingSenderId: "208878307395",
    appId: "1:208878307395:web:e0e7757b7f35a0e345ecf6"
    };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  //5 Insertar datos en nuestra bd
async function almacenarUsuarios(evento){
    let user = document.getElementById("usuario").value;
    let id = ;
    let password = document.getElementById("contrasenia").value;
    let type = document.getElementById("tipoCuenta").value;
    let auxUsuario = new Usuario(id,user,password,type);
    
    user = "";
    id = "";
    password = "";
    type ="";

    //estructura : Colección/ Sub-colección-Documentos/ Documentos-Elementos
    await setDoc(doc(database,'usuarios',auxUsuario.id),{
        user: auxUsuario.user,
        password: auxUsuario.password,
        type: auxUsuario.type
    });
}
async function importarDB(){
    const querySnapshot = await getDocs(collection(database, "usuarios"));
    querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());

        muestra.innerHTML+=`<div><h4>${doc.id}</h4>
                            <p>${doc.data().user}</p>
                            <p>${doc.data().password}</p>
                            <p>${doc.data().type}</p><br>

                            <input type="button" class"btn_Eliminar" value="Eliminar" id=el${doc.id}>
                            <input type="button" class"btn_Editar" value="Editar" id=ed${doc.id}>
                            </div>`;
    });
}
