const express = require('express');
const mysql = require('mysql');
const http = require('http');
const app = express();
const bodyParser = require('body-parser'); 


app.listen(app.get('port'), () => console.log(`Server started on port ${app.get('port')}`));

app.use(express.json());
app.set('view engine', 'ejs');

var con = mysql.createConnection(
  {
  host: "us-cdbr-iron-east-01.cleardb.net",
  user: "b93244dc053f45",
  password: "937a4217",
  database: "heroku_0ec97e651295bde"
});

con.connect((err) => {
  if (err) {
    try {
      throw err;
    } catch (e) {
      res.status(400).json({ errorMessage: `Fallo al conectarse a la base de datos: ${e}` });
    }
    
  } else {
    console.log('Conexion correcta');
    res.status(200);
  }
});

let data = {
  temp,
  estadoActual,
  estadoApp,
  setPoint
}

app.use('/', (req, res) => {
  let sql = `SELECT setPoint, estadoActual, estadoApp FROM estados ORDER BY ID DESC LIMIT 1`; 
  con.query(sql, (err, result) => {
    if (err) {
        try {
        throw err;}
        catch (e) {
          res.status(400).json({ errorMessage: `Endpoint: ${req.path}. Sucedio un error al recibir: ${e}` });
          }
        } 
    else {
        data.setPoint = result[0].setPoint;
        data.estadoActual = result[0].estadoActual;
        data.estadoApp = result[0].estadoApp;
        } 
      });

      let sql = `SELECT temp FROM datos ORDER BY ID DESC LIMIT 1`; 
      con.query(sql, (err, result) => {
        if (err) {
            try {
            throw err;}
            catch (e) {
              res.status(400).json({ errorMessage: `Endpoint: ${req.path}. Sucedio un error al recibir: ${e}` });
              }
            } 
        else {
            data.temp = result[0].temp;
            } 
          });    
});

app.get('/', (req, res) => {
  
  res.render('home', data);

});

app.get('/select', (req, res) => {
    let sql = `SELECT setPoint, estadoActual, estadoApp FROM estados ORDER BY ID DESC LIMIT 1`; 
    con.query(sql, (err, result) => {
              if (err) {
          try {
            throw err;
          } catch (e) {
            res.status(400).json({ errorMessage: `Endpoint: ${req.path}. Sucedio un error al recibir: ${e}` });
          }
        } else {
          estados = result[0];
          // Mas info aca http://expressjs.com/es/api.html#res.json
          res.status(200).json(estados);
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
        res.status(400).json({ errorMessage: `Endpoint: ${req.path}. Sucedio un error al recibir: ${e}`});
            }
     }
      else {
        var jason = JSON.stringify(data);
        res.status(200);} 
    });
});

module.exports = app;