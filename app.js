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

function obtenerHora() {
  let today = new Date();
  let hours = today.getHours();
  if (hours < 10) {
  hours = `0${hours}`;}
  let min = today.getMinutes();
  if(min < 10) {
  min = `0${min}`;}
  let sec = today.getSeconds();
  if(sec < 10) {
  sec = `0${sec}`;}
  let horaActual = `${hours}:${min}:${sec}`;
  return horaActual;
}

function obtenerDia() {
  let today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth() + 1;
  if(month < 10) {
  month = `0${month}`;}
  let day = today.getDate();
  if(day < 10) {
  day = `0${day}`;}
  let diaActual = `${year}-${month}-${day}`;
  return diaActual;
}

let con = mysql.createPool({
  connectionLimit: 4,
  host: "us-cdbr-gcp-east-01.cleardb.net",
  user: "bd70014928536a",
  password: "a867a9ff",
  database: "gcp_3a44f6029eefbaf3050d"
});

app.get('/datos', (req, res) => {
  const sql = `SELECT temp, hum, lum FROM datos ORDER BY ID DESC LIMIT 1`; 
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

app.get('/graficos', (req, res) =>  {
  let diaActual = obtenerDia();
  const sql = `SELECT temp, hum, lum, hora FROM datos WHERE dia = '${diaActual}' ORDER BY ID DESC`;
  con.query(sql, (err, result) => {
    if (err) {
      try {
        throw err;
      } catch (e) {
          res.status(400).json({ errorMessage: `Endpoint: ${req.path}. Sucedio un error: ${e}` });
        }
    } else {
      let dataArray = {
        tempArray: [],
        humArray: [],
        lumArray: [],
        horaArray: []
      };
      for(let i = 0; i < result.length; i++){
        dataArray.tempArray[i] = result[i].temp;
        dataArray.humArray[i] = result[i].hum; 
        dataArray.lumArray[i] = result[i].lum;
        dataArray.horaArray[i] = result[i].hora;
      }
      res.status(200).json(dataArray);
      }
      });    
    });




app.post('/insert', (req, res) =>{
  let horaActual = obtenerHora();
  console.log(horaActual);
  const data = req.body;
  let sql = `INSERT INTO datos (id, dia, hora, serie, temp, hum, lum) `;
  sql += `VALUES (NULL, CURDATE(), "${horaActual}", ${data.serie}, ${data.temp}, ${data.hum}, ${data.lum})`;
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