document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
  
    const datos = {
      nombre: document.getElementById('nombre').value,
      apellido: document.getElementById('apellido').value,
      correo: document.getElementById('correo').value,
      contrasena: document.getElementById('contrasena').value,
      telefono: document.getElementById('telefono').value,
      direccion: document.getElementById('direccion').value,
      tipo: document.getElementById('tipo').value
    };
  
    console.log(datos);
  
    fetch('/registrarse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    })
    .then(res => res.text())
    .then(html => {
      console.log(html);
      document.write(html); // Muestra la respuesta del backend
    })
    .catch(err => alert("Error al registrar: " + err));
  });
  