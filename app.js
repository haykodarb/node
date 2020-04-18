const express = require('express');
const mysql = require('mysql');
const chalk = require('chalk');
const app = express();
const http = require('http').createServer(app);
const bodyParser = require('body-parser'); 

app.use(express.json());

http.listen(3000, () => {
  console.log(chalk.green('Listening on port: 3000'));
});

let con = mysql.createConnection({
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
      console.log(`Fallo al conectarse a la base de datos: ${e}`);
      return;
    }
  } else {
    console.log('Conexion correcta');
  }
});

app.get('/select', (req, res) => {
    const sql = `SELECT setPoint, estadoActual, estadoApp FROM estados ORDER BY ID DESC LIMIT 1`; 

    con.query(sql, (err, result) => {
      if (err) {
        try {
          throw err;
        } catch (e) {
          res.status(400).json({ errorMessage: `Endpoint: ${req.path}. Sucedio un error: ${e}` });
        }
      } else {
        // Mas info aca http://expressjs.com/es/api.html#res.json
        res.status(200).json(result[0]);
      }      
    });
});
    
app.post('/insert', (req, res) =>{
  const data = {
    temp: req.body.temp,
    serie: req.body.serie
  };
  const sql = `INSERT INTO datos (id, serie, fecha, temp) VALUES (NULL, ${data.serie}, CURRENT_TIMESTAMP, ${data.temp});`;

  con.query(sql, (err) => {
    if (err) {
      try {
        throw err;
      } catch (e) {
        res.status(400).json({ errorMessage: `Endpoint: ${req.path}. Sucedio un error al recibir: ${e}`});
      }
    } else {
      res.status(200);
    }
  });
});

module.exports = app;