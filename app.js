const express = require('express');
const mysql = require('mysql');
const http = require('http');
const app = express();
const bodyParser = require('body-parser'); 


app.listen(app.get('port'), () => console.log(`Server started on port ${app.get('port')}`));

app.use(express.json());

var con = mysql.createConnection(
  {
  host: "us-cdbr-gcp-east-01.cleardb.net",
  user: "bd70014928536a",
  password: "a867a9ff",
  database: " gcp_3a44f6029eefbaf3050d"
});

con.connect( (err) => {
  if (err) {
    try {
      throw err;
    } catch (e) {
      console.log(`Fallo al conectarse a la base de datos: ${e}`);
    }
  } else {
    console.log('Conexion correcta');
  }
});

app.get('/select', (req, res) => {
    const sql = `SELECT estadoApp, estadoActual, setPoint FROM estados ORDER BY ID DESC LIMIT 1`; 
    con.query(sql, (err, result) => {
              if (err) {
          try {
            throw err;
          } catch (e) {
            res.status(400).json({ errorMessage: `Endpoint: ${req.path}. Sucedio un error al recibir: ${e}` });
          }
        } else {
          estados = result[0];
          res.status(200).json(estados);
        }      
    });
});
    
app.post('/insert', (req, res) =>{
  let data = {
    temp: req.body.temp,
    serie: req.body.serie
  };
  const sql = `INSERT INTO datos (id, serie, temp, hora) VALUES (NULL, ${data.serie}, ${data.temp}), CURRENT_TIMESTAMP;` ;
  con.query((sql), (err) => {
    if (err) {
      try {
        throw err;}
      catch (e) {
        res.status(400).json({ errorMessage: `Endpoint: ${req.path}. Sucedio un error al recibir: ${e}`});
            }
     }
      else {
        res.status(200).send(`Post hecho correctamente con los datos: ${JSON.stringify(data)}`);} 
    });
});

module.exports = app;