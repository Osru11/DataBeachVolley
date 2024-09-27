document.addEventListener("DOMContentLoaded", function() {
    const userType = "entrenador"; // Ejemplo: Este valor debería ser dinámico basado en la autenticación del usuario

    if (userType === "entrenador") {
        document.getElementById("trainer-section").style.display = "block";
    } else if (userType === "jugador") {
        document.getElementById("player-section").style.display = "block";
    } else if (userType === "estadistico") {
        document.getElementById("statistician-section").style.display = "block";
    }

    // Deshabilitar comentarios para jugadores
    if (userType === "jugador") {
        document.getElementById("forum-submit").style.display = "none";
    }
});
