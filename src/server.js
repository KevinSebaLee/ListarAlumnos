import express  from 'express';
import cors     from 'cors';
import config   from './configs/db-config.js';
import pkg      from 'pg';

const { Pool } = pkg;
const pool = new Pool(config);

const app  = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/api/alumnos/', async (req, res) => {
    try {
        const sql = 'SELECT * FROM alumnos';
        const alumnos = await pool.query(sql);
        res.status(200).send(alumnos.rows);
    } catch (error) {
        res.status(500).send(error);
        console.log(error);
    }
});

app.get('/api/alumnos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const sql = 'SELECT * FROM alumnos WHERE id = $1';
        const alumno = await pool.query(sql, [id]);
        if (alumno.rows.length === 0) {
            return res.status(404).send({ message: 'Alumno not found' });
        }
        res.status(200).send(alumno.rows[0]);
    } catch (error) {
        res.status(500).send(error);
        console.log(error);
    }
});

app.post('/api/alumnos/', async (req, res) => {
    const { nombre, apellido, id_curso, fecha_nacimiento, hace_deportes } = req.body;
    try {
        const sql = 'INSERT INTO alumnos (nombre, apellido, id_curso, fecha_nacimiento, hace_deportes) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const newAlumno = await pool.query(sql, [nombre, apellido, id_curso, fecha_nacimiento, hace_deportes]);
        res.status(201).send(newAlumno.rows[0]);
    } catch (error) {
        res.status(500).send(error);
        console.log(error);
    }

    // Example usage:
    // POST http://localhost:3000/api/alumnos/
    // Body (JSON):
    // {
    //   "nombre": "Juan",
    //   "apellido": "Pérez",
    //   "id_curso": 1,
    //   "fecha_nacimiento": "2000-01-01",
    //   "hace_deportes": true
    // }
});

app.put('/api/alumnos/', async (req, res) => {
    const { id, nombre, apellido, id_curso, fecha_nacimiento, hace_deportes } = req.body;
    try {
        const sql = 'UPDATE alumnos SET nombre = $1, apellido = $2, id_curso = $3, fecha_nacimiento = $4, hace_deportes = $5 WHERE id = $6 RETURNING *';
        const updatedAlumno = await pool.query(sql, [nombre, apellido, id_curso, fecha_nacimiento, hace_deportes, id]);
        if (updatedAlumno.rows.length === 0) {
            return res.status(404).send({ message: 'Alumno not found' });
        }
        res.status(200).send(updatedAlumno.rows[0]);
    } catch (error) {
        res.status(500).send(error);
        console.log(error);
    }
});

app.delete('/api/alumnos/:id', async (req, res) => {    
    const { id } = req.params;
    try {
        const sql = 'DELETE FROM alumnos WHERE id = $1 RETURNING *';
        const deletedAlumno = await pool.query(sql, [id]);
        if (deletedAlumno.rows.length === 0) {
            return res.status(404).send({ message: 'Alumno not found' });
        }
        res.status(200).send(deletedAlumno.rows[0]);
    } catch (error) {
        res.status(500).send(error);
        console.log(error);
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port: http://localhost:${port}`)
})