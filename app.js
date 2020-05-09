const express = require('express');
const mysql = require('mysql');
const chalk = require('chalk');
const app = express();
const http = require('http').createServer(app);
const bodyParser = require('body-parser'); 
let moment = require('moment-timezone');

app.use(express.json());

http.listen(3000, () => {
  console.log(chalk.green('Listening on port: 3000'));
});


function obtenerFecha() {
  let now = moment().tz('America/Argentina/Buenos_Aires').format();
  return now;
}

function obtenerDia(num) {
  let now = moment().subtract(num, 'days').tz('America/Argentina/Buenos_Aires').format('YYYY-MM-DD');
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
  let diaHoy = obtenerDia(0);  //despues intentar sacando los if y poniendo solo una linea de SQL donde el ID sea la viarable
  let diaSemana = obtenerDia(7);
  let diaMes = obtenerDia(30);
  let fechaHoy = obtenerFecha();
  let sql = '';
  if(req.params.id === 'hoy') {
  sql = `SELECT time, temp, hum, lum FROM datos WHERE dia = '${diaHoy}'`;  }
  else if (req.params.id === 'semana'){
  sql = `SELECT time, temp, hum, lum FROM datos WHERE dia BETWEEN '${diaSemana}' AND '${fechaHoy}'`;  }
  else if (req.params.id === 'mes') {
  sql = `SELECT time, temp, hum, lum FROM datos WHERE dia BETWEEN '${diaMes}' AND '${diaHoy}'`;  }

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
        dataArray.timeArray[i] = result[i].time;
      }
      res.status(200).json(dataArray);
      }
      });    
    });




app.post('/insert', (req, res) =>{
  let fechaActual = obtenerFecha();
  console.log(horaActual);
  const data = req.body;
  let sql = `INSERT INTO datos (id, time, serie, temp, hum, lum) `;
  sql += `VALUES (NULL, ${fechaActual}, ${data.serie}, ${data.temp}, ${data.hum}, ${data.lum})`;
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