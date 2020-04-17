const express = require('express');
const mysql = require('mysql');
const http = require('http');
const app = express();
const bodyParser = require('body-parser'); 

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
        res.send(estados); 
        res.end();
      }  
    });
});
    
app.post('/insert', (req, res) =>{
  var data = {
    temp: req.body.temp,
    serie: req.body.serie
  };
  let sql = `INSERT INTO datos (id, serie, fecha, temp) VALUES (NULL, ${data.serie}, CURRENT_TIMESTAMP, ${data.temp});`;
  con.query(sql, (err) => {
    if (err) {
      try {
        throw err;}
      catch (err) {
        var jason = JSON.stringify(data);
        res.end(`Hubo un error: ${err}, Los valores recibidos fueron: ${jason}`);
        console.log(err);}
            } 
      else {
        var jason = JSON.stringify(data);
        res.end(`POST hecho correctamente con los valores ${jason}`);} 
    });
});

process.on('uncaughtException', function (err) {
  console.log(err);
})