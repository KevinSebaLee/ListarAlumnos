import express  from "express"; // hacer npm i express
import cors     from "cors";    // hacer npm i cors
import config from './configs/db-config.js'
import pkg from 'pg'

const { Client }  = pkg;

const app  = express();
const port = 3000;

app.use(cors());         // Middleware de CORS

app.use(express.json()); // Middleware para parsear y comprender JSON

app.get('/api/alumnos/', async (req, res) => {
    const client = new Client(config)
    try{
        await client.connect()
        let sql =  `SELECT * FROM alumnos`
        let alumnos = await client.query(sql);
        alumnosArray = alumnos;
        res.status(200).send(alumnos.rows);
    }

    catch(error){
        res.status(500).send(error);
        console.log(error)
    }

    finally{
        await client.end()
    }
});

app.get('/api/alumnos/:id', async (req, res) => {

});

app.post('/api/alumnos/', async (req, res) => {

});

app.put('/api/alumnos/', async (req, res) => {

});

app.delete('/api/alumnos/:id', async (req, res) => {

});

app.listen(port, () => {
    console.log(`Example app listening on port: http://localhost:${port}`)
})