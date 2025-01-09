import axios from 'axios';

const client = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// Función para generar una contraseña aleatoria
const generateRandomPassword = () => {
  const length = 12;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

export const recoverPassword = async () => {
  try {
    // Primero preguntamos por el email
    const { value: email } = await Swal.fire({
      title: 'Recuperar contraseña',
      input: 'email',
      inputLabel: 'Introduce tu correo electrónico',
      inputPlaceholder: 'email@ejemplo.com',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Enviar',
      validationMessage: 'El email no es válido'
    });

    if (email) {
      // Mostramos loading mientras se procesa
      Swal.fire({
        title: 'Procesando',
        text: 'Enviando email de recuperación...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const newPassword = generateRandomPassword();
      
      // Hacemos la petición al backend
      const response = await client.post('/api/recover-password/', {
        email,
        newPassword
      });

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: '¡Email enviado!',
          text: 'Revisa tu bandeja de entrada para ver tu nueva contraseña'
        });
      }
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo procesar la recuperación de contraseña. Por favor, inténtalo más tarde.'
    });
    console.error('Error recovering password:', error);
  }
};