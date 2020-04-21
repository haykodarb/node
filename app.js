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

let con = mysql.createPool({
  connectionLimit: 4,
  host: "us-cdbr-gcp-east-01.cleardb.net",
  user: "bd70014928536a",
  password: "a867a9ff",
  database: "gcp_3a44f6029eefbaf3050d"
});

app.get('/estados', (req, res) => {
  const sql = `SELECT estadoApp, estadoActual, setPoint FROM estados ORDER BY ID DESC LIMIT 1`; 
  con.query(sql, (err, result) => {
    if (err) {
      try {
        throw err;
      } catch (e) {
          res.status(400).json({ errorMessage: `Endpoint: ${req.path}. Sucedio un error: ${e}` });
        }
    } else {
      res.status(200).json(result[0]);
      }      
    });
});

app.get('/datos', (req, res) => {
  const sql = `SELECT temp FROM datos ORDER BY ID DESC LIMIT 1`; 
  con.query(sql, (err, result) => {
    if (err) {
      try {
        throw err;
      } catch (e) {
          res.status(400).json({ errorMessage: `Endpoint: ${req.path}. Sucedio un error: ${e}` });
        }
    } else {
      res.status(200).send(result[0].temp);
      }      
    });
});


app.post('/insert', (req, res) =>{
  const data = {
    temp: req.body.temp,
    serie: req.body.serie
  };
  const sql = `INSERT INTO datos (id, serie, temp, hora) VALUES (NULL, ${data.serie}, ${data.temp}, CURRENT_TIMESTAMP)`;
  con.query(sql, (err) => {
    if (err) {
      try {
        throw err;
      } catch (e) {
        res.status(400).json({ errorMessage: `Endpoint: ${req.path}. Sucedio un error al recibir: ${e}`});
      }
    } else {
      res.status(200).send("Post hecho correctamente");
    }
  });
});

module.exports = app; 