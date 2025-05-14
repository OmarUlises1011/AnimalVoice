const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();

// Middleware para procesar JSON y formularios
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware de sesión
app.use(session({
    secret: 'claveSecreta123',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // true solo si usas HTTPS
}));

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Ulises2004',
    database: 'animalvoice'
});

db.connect(err => {
    if (err) {
        console.error('❌ Error al conectar con la base de datos:', err);
        return;
    }
    console.log('✅ Conectado a MySQL');
});

// Middleware de autenticación
function verificarSesion(req, res, next) {
    if (!req.session.usuarioId) {
        return res.status(401).send('<script>alert("Por favor inicia sesión"); window.location.href="/login.html";</script>');
    }
    next();
}

// Ruta para registro de usuarios
app.post('/registrarse', (req, res) => {
    const { nombre, apellido, correo, contrasena, telefono, direccion, tipo } = req.body;

    bcrypt.hash(contrasena, 10, (err, hashedPassword) => {
        if (err) {
            console.error('❌ Error al encriptar la contraseña:', err);
            return res.status(500).send('<script>alert("Error al registrar usuario"); window.location.href="registrarse.html";</script>');
        }

        const query = 'INSERT INTO usuarios (Nombre, Apellido, Correo, Contrasena, Telefono, Direccion, Tipo) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.query(query, [nombre, apellido, correo, hashedPassword, telefono, direccion, tipo], (err, result) => {
            if (err) {
                console.error('❌ Error al registrar usuario:', err);
                return res.status(500).send('<script>alert("Error al registrar usuario"); window.location.href="registrarse.html";</script>');
            }
            res.send('<script>alert("Usuario registrado exitosamente"); window.location.href="/login.html";</script>');
        });
    });
});

// Ruta para inicio de sesión
app.post('/login', (req, res) => {
    const { correo, contrasena } = req.body;

    const query = 'SELECT * FROM usuarios WHERE Correo = ?';
    db.query(query, [correo], async (err, results) => {
        if (err) {
            console.error('❌ Error en la consulta:', err);
            return res.status(500).send('<script>alert("Error del servidor"); window.location.href="login.html";</script>');
        }

        if (results.length === 0) {
            return res.status(401).send('<script>alert("Correo no registrado"); window.location.href="login.html";</script>');
        }

        const usuario = results[0];
        const match = await bcrypt.compare(contrasena, usuario.Contrasena);

        if (match) {
            req.session.usuarioId = usuario.ID_Usuario;
            res.send(`<script>alert("Bienvenido, ${usuario.Nombre}"); window.location.href="index.html";</script>`);
        } else {
            res.status(401).send('<script>alert("Contraseña incorrecta"); window.location.href="login.html";</script>');
        }
    });
});

// Ruta para registrar una denuncia
app.post('/denuncias', verificarSesion, (req, res) => {
    const ID_Usuario = req.session.usuarioId;
    const { descripcion, ubicacion } = req.body;

    if (!descripcion || !ubicacion) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' }); 
    }

    const query = 'INSERT INTO denuncias (ID_Usuario, Descripcion, Ubicacion) VALUES (?, ?, ?)';
    db.query(query, [ID_Usuario, descripcion, ubicacion], (err, result) => {
        if (err) {
            console.error('❌ Error al registrar denuncia:', err);
            return res.status(500).json({ error: 'Error al registrar denuncia' });
        }

        // Redirigir al dashboard luego de guardar denuncia
        res.redirect('/dashboard');
    });
});

// ✅ Ruta global para mostrar el dashboard
app.get('/dashboard', verificarSesion, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Ruta para obtener los reportes del usuario actual
app.get('/api/mis-reportes', verificarSesion, (req, res) => {
    const usuarioId = req.session.usuarioId;

    const query = 'SELECT * FROM denuncias WHERE ID_Usuario = ? ORDER BY Fecha_Denuncia DESC';
    db.query(query, [usuarioId], (err, results) => {
        if (err) {
            console.error('❌ Error al obtener reportes:', err);
            return res.status(500).json({ error: 'Error del servidor' });
        }

        res.json(results);
    });
});

// Ruta para obtener información del usuario actual
app.get('/api/usuarios', verificarSesion, (req, res) => {
    const query = 'SELECT Nombre, Tipo FROM usuarios WHERE ID_Usuario = ?';
    db.query(query, [req.session.usuarioId], (err, results) => {
        if (err) {
            console.error('❌ Error al obtener usuario:', err);
            return res.status(500).json({ error: 'Error de servidor' });
        }

        if (results.length > 0) {
            const { Nombre, Tipo } = results[0];
            res.json({ nombre: Nombre, tipo: Tipo });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    });
});

// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('❌ Error al destruir la sesión:', err);
            return res.status(500).send('<script>alert("Error al cerrar sesión"); window.location.href="/index.html";</script>');
        }
        res.clearCookie('connect.sid');
        res.send('<script>alert("Has cerrado sesión correctamente"); window.location.href="/login.html";</script>');
    });
});

// Redirección si ya está autenticado
app.get('/login.html', (req, res) => {
    if (req.session.usuarioId) {
        return res.redirect('/index.html');
    }
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
