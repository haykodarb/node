const express = require('express');
const mysql = require('mysql');
const chalk = require('chalk');
const app = express();
const http = require('http').createServer(app);
const bodyParser = require('body-parser'); 
const fs = require('fs');

app.use(express.json());

http.listen(3000, () => {
  console.log(chalk.green('Listening on port: 3000'));
});

let con = mysql.createPool({
  connectionLimit: 4,
  host: "us-cdbr-gcp-east-01.cleardb.net",
  user: "bd70014928536a",
  password: "a867a9ff",
  database: "gcp_3a44f6029eefbaf3050d"
});

app.get('/select', (req, res) => {
  fs.readFile('estados.json', (err, data) => {
  if(err) {
    try  {throw err;} 
    catch(e) {console.log(`Sucedió un error al obtener la información ${e}`);}
  }
  let estados = JSON.parse(data);
  res.status(200).json(estados);
  });
});
    
app.post('/insert', (req, res) =>{
  let datos = req.body;
  fs.writeFile('datos.json', datos, (err) => {
    if(err) {
      try  {throw err;} 
      catch(e) {console.log(`Sucedió un error al escribir la información ${e}`);}
    }
    });
  res.status(200).send('Post realizado correcctamente');
  insertSQL(datos);
});

function insertSQL(data) {
  const sql = `INSERT INTO datos (id, serie, temp, hora) VALUES (NULL, ${data.serie}, ${data.temp}, CURRENT_TIMESTAMP)`;
  con.query(sql, (err) => {
    if (err) {
      try {
        throw err;
      } catch (e) {
        console.log(`errorMessage: Sucedio un error al recibir: ${e}`);
      }
    } else {
      console.log('Insert realizado correctamente');
    }
  });
}

module.exports = app;