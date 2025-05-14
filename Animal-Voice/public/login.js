document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Detiene el envío tradicional

        const correo = document.getElementById('correo').value;
        const contrasena = document.getElementById('contrasena').value;

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ correo, contrasena }),
                credentials: 'include'  // Muy importante para mantener la sesión
            });

            const mensaje = await response.text();

            if (response.ok) {
                alert('✅ Inicio de sesión exitoso');
                window.location.href = 'dashboard.html'; // Redirige al dashboard
            } else {
                alert(`❌ Error: ${mensaje}`); // Muestra el error si no es 200 OK
            }
        } catch (error) {
            console.error('Error en la petición:', error);
            alert('❌ Error al conectar con el servidor'); // Muestra un mensaje de error general
        }
    });
    
});
