const express = require('express');
const mysql = require('mysql');
var http = require('http');
var url = require('url');
const app = express();

var port = process.env.PORT || '3306';

app.listen(port, () => { console.log(`Server started on port ${port}`)
} );

var estados = {
  setPoint: 0,
  estadoActual: 0,
  estadoApp: 0 
} 

var con = mysql.createConnection({
  host: "us-cdbr-iron-east-01.cleardb.net",
  user: "b93244dc053f45",
  password: "937a4217",
  database: "heroku_0ec97e651295bde"
});

con.connect(function(err) {
  if (err) throw err;
  console.log('Conexion correcta');
});

app.get('/', (req,res) => {
res.send("Página principal de Hayk")
});


app.get('/recibir', (req, res) => { 
    let datos = req.query;
    let sql = `SELECT setPoint, estadoActual, estadoApp FROM estados ORDER BY ID DESC LIMIT 1`; 
    let query = con.query(sql, (err, result) => {
        console.log("Select hecho correctamente correctamente");
        estados = result[0];
        estados = JSON.stringify(estados);
        res.send(estados);
        res.end;
      });
  
});
    
app.get('/enviar', (req, res) =>{
  let datos = req.query;
  let temp = datos.temp; 
  let serie = datos.serie;
  let sql = `INSERT INTO datos (id, serie, fecha, temp) VALUES (NULL, ${serie}, CURRENT_TIMESTAMP, ${temp});`;
  let query = con.query(sql, function (err) { 
      res.send("Post hecho correctamente correctamente");
       });
});
