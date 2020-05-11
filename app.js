const express = require('express');
const mysql = require('mysql');
const chalk = require('chalk');
const http = require('http');
const bodyParser = require('body-parser'); 
const moment = require('moment-timezone');

const app = express();
http.createServer(app);
let port = process.env.port || 3000;

http.listen(process.env.port, () => {
  console.log(chalk.green(`Listening on port: ${port}`));
});

app.use(express.json());

function obtenerTiempo() {
  let now = moment().tz('America/Argentina/Buenos_Aires').format();
  return now;
}

function obtenerDia(num) {
  let now = moment().tz('America/Argentina/Buenos_Aires').subtract(num, 'days').hour(0).minute(0).second(0).format();
  return now;
}

let con = mysql.createPool({
  connectionLimit: 4,
  host: `${process.env.host}`,
  user: `${process.env.user}`,
  password: `${process.env.password}`,
  database: `${process.env.database}`
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

app.get('/graficos/:id', (req, res) =>  {
  let diaHoy = obtenerDia(0);  //despues intentar sacando los if y poniendo solo una linea de SQL donde el ID sea la viarabltime let instanteActual = obtenerTiempo();
  let diaSemana = obtenerDia(7);
  let diaMes = obtenerDia(30);
  let tiempoActual = obtenerTiempo();
  let sql = '';
  if(req.params.id === 'hoy') {
  sql = `SELECT tiempo, temp, hum, lum FROM datos WHERE tiempo BETWEEN '${diaHoy}' AND '${tiempoActual}'`;  }
  else if (req.params.id === 'semana'){
  sql = `SELECT tiempo, temp, hum, lum FROM datos WHERE tiempo BETWEEN '${diaSemana}' AND '${tiempoActual}'`;  }
  else if (req.params.id === 'mes') {
  sql = `SELECT tiempo, temp, hum, lum FROM datos WHERE tiempo BETWEEN '${diaMes}' AND '${tiempoActual}'`;  }

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
        timeArray: []
      };
      for(let i = 0; i < result.length; i++){
        dataArray.tempArray[i] = result[i].temp;
        dataArray.humArray[i] = result[i].hum; 
        dataArray.lumArray[i] = result[i].lum;
        result[i].tiempo = moment(result[i].tiempo).format('YYYY-MM-DD HH:mm:ss');
        dataArray.timeArray[i] = moment.tz(result[i].tiempo, 'America/Argentina/Buenos_Aires').format();
      }
      res.status(200).json(dataArray);
      }
      });    
    });




app.post('/insert', (req, res) =>{
  let tiempoActual = obtenerTiempo();
  const data = req.body;
  let sql = `INSERT INTO datos (id, tiempo, serie, temp, hum, lum) `;
  sql += `VALUES (NULL, '${tiempoActual}', ${data.serie}, ${data.temp}, ${data.hum}, ${data.lum})`;
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