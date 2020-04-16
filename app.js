const express = require('express');
const mysql = require('mysql');
const http = require('http');
const url = require('url');
const app = express();
const bodyParser = requier('body-parser'); 

var port = process.env.PORT || '3306';

app.listen(port, () => { console.log(`Server started on port ${port}`)
} );

app.use(bodyParser.json());

var con = mysql.createConnection(
  {
  host: "us-cdbr-iron-east-01.cleardb.net",
  user: "b93244dc053f45",
  password: "937a4217",
  database: "heroku_0ec97e651295bde"
});

con.connect( (err) => {
  if (err) {
    try {
      throw err;
    } catch (e) {
      console.log('Sucedio un error con la conexion: ', e);
    } } else {
    console.log('Conexion correcta'); }
  });
  
app.get('/select', (req, res) => {
    let sql = `SELECT setPoint, estadoActual, estadoApp FROM estados ORDER BY ID DESC LIMIT 1`; 
    con.query(sql, (err, result) => {
      if (err) {
        try {
          throw err;
        } catch (e) {
          console.log('Sucedio un error al recibir: ', e);
          res.end();
        }
      } else {
        console.log("Select hecho correctamente correctamente");
        var estados = result[0];
        estados = JSON.stringify(estados);
        res.end(estados); // No hace falta .send, .end también envía.
      }  
    });
});
    
app.post('/insert', (req, res) =>{
  let data = {
    temp: req.body.temp,
    serie: req.body.serie
  };
  if (!data.temp) {
    res.end("Parametros vacios o incorrectamente enviados");
    return;
    } 
  let sql = `INSERT INTO datos (id, serie, fecha, temp) VALUES (NULL, ${data.serie}, CURRENT_TIMESTAMP, ${data.temp});`;
  con.query(sql, function (err) {
    if (err) {
      try {
        throw err;}
      catch (e) {
        console.log('Sucedio un error al recibir: ', e);}
        res.end('Sucedio un error al recibir: ', e);
    } else { 
      res.end('Recibido correctamente');} 
    });
});

app.get('/sumar', (req,res) => {
  res.end("HOLA!!!!")
})

process.on('uncaughtException', function (err) {
  console.log(err);
})