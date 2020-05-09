const express = require('express');
const mysql = require('mysql');
const chalk = require('chalk');
const app = express();
const http = require('http').createServer(app);
const bodyParser = require('body-parser'); 
let moment = require('moment');

app.use(express.json());

http.listen(3000, () => {
  console.log(chalk.green('Listening on port: 3000'));
});


function agregarCero(num) {
  if (num < 10) {
    num = `0${num}`;} 
  return num;}

function obtenerHora() {
  let today = new Date();
  let hours = agregarCero(today.getHours()-3);
  let min = agregarCero(today.getMinutes());
  let sec = agregarCero(today.getSeconds());
  let horaActual = `${hours}:${min}:${sec}`;
  return horaActual;
}

function obtenerDia(num) {
  let today = new Date();
  let year = today.getFullYear();
  let month = agregarCero(today.getMonth()+1);
  let day = agregarCero(today.getUTCDate()-num);
  let dia = `${year}-${month}-${day}`;
  return dia;
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
  let sql = '';
  if(req.params.id === 'hoy') {
  sql = `SELECT temp, hum, lum, hora, dia FROM datos WHERE dia = '${diaHoy}'`;
  }
  else if (req.params.id === 'semana'){
  sql = `SELECT temp, hum, lum, hora, dia FROM datos WHERE dia BETWEEN '${diaSemana}' AND '${diaHoy}'`
  }
  else if (req.params.id === 'mes') {
  sql = `SELECT temp, hum, lum, hora, dia FROM datos WHERE dia BETWEEN '${diaMes}' AND '${diaHoy}'`  
  }
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
        horaArray: [],
        diaArray: [],
      };
      for(let i = 0; i < result.length; i++){
        dataArray.tempArray[i] = result[i].temp;
        dataArray.humArray[i] = result[i].hum; 
        dataArray.lumArray[i] = result[i].lum;
        dataArray.horaArray[i] = result[i].hora;
        dataArray.diaArray[i] = result[i].dia;
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
  sql += `VALUES (NULL, CURDATE(), CURTIME(), ${data.serie}, ${data.temp}, ${data.hum}, ${data.lum})`;
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