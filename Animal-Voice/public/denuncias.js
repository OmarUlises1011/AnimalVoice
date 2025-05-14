// Obtener referencias a los elementos del DOM
const abrirModalBtn = document.getElementById('btn-crear-reporte');
const modal = document.getElementById('modal-crear-reporte');
const cerrarModalBtn = document.getElementById('cerrar-modal');
const formulario = document.getElementById('form-crear-denuncia');
const mensajeExito = document.getElementById('mensaje-exito');

// Función para abrir el modal
abrirModalBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

// Función para cerrar el modal
cerrarModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Cerrar el modal si se hace clic fuera del contenido
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});
// archivo: routes/reportes.js
const express = require('express');
const router = express.Router();
const connection = require('../database');

// Endpoint para obtener denuncias de un usuario
router.get('/denuncias/:usuarioId', (req, res) => {
    const usuarioId = req.params.usuarioId; // ID del usuario que pide las denuncias

    // Consulta para obtener las denuncias del usuario
    const query = 'SELECT * FROM denuncias WHERE ID_Usuario = ? ORDER BY Fecha_Denuncia DESC';
    connection.query(query, [usuarioId], (err, results) => {
        if (err) {
            console.error('Error al obtener las denuncias:', err);
            return res.status(500).json({ error: 'Error al obtener las denuncias' });
        }
        res.json(results); // Devolvemos los resultados como respuesta
    });
});

module.exports = router;


// Lógica para manejar el formulario de reporte
formulario.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevenir que el formulario se envíe de forma convencional

    // Simulación de un envío exitoso de reporte
    // Aquí deberías poner la lógica para enviar el formulario al backend
    setTimeout(() => {
        // Mostrar el mensaje de éxito
        mensajeExito.style.display = 'block';
        
        // Después de 2 segundos, redirigir al Dashboard
        setTimeout(() => {
            window.location.href = '/dashboard'; // Cambia '/dashboard' a la URL de tu dashboard
        }, 2000); // 2 segundos de espera
    }, 500); // 0.5 segundos de espera simulando el proceso de registro
});
document.addEventListener("DOMContentLoaded", function () {
    // Simulación de los reportes que vienen de la base de datos o de un backend
    const reportes = [
        {
            titulo: "Maltrato en parque",
            estado: "Pendiente",
            ubicacion: "Colonia Centro, CDMX",
            descripcion: "Perro encadenado sin agua ni sombra.",
            fecha: "06/05/2025 - 10:24 AM"
        },
        {
            titulo: "Animal abandonado",
            estado: "Resuelto",
            ubicacion: "Av. Reforma, CDMX",
            descripcion: "Gato encontrado vagando sin dueño.",
            fecha: "07/05/2025 - 12:30 PM"
        }
    ];

    const contenedorReportes = document.getElementById("contenedor-reportes");

    // Iterar sobre el array de reportes y crear una tarjeta para cada uno
    reportes.forEach(reporte => {
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("tarjeta-reporte");

        tarjeta.innerHTML = `
            <div class="cabecera-reporte">
                <h3>${reporte.titulo}</h3>
                <span class="estado estado-${reporte.estado.toLowerCase()}">${reporte.estado}</span>
            </div>
            <p><strong>Ubicación:</strong> ${reporte.ubicacion}</p>
            <p><strong>Descripción:</strong> ${reporte.descripcion}</p>
            <p class="fecha-reporte">Enviado el: ${reporte.fecha}</p>
        `;

        // Agregar la tarjeta al contenedor de reportes
        contenedorReportes.appendChild(tarjeta);
    });
});


