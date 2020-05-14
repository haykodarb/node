const express = require('express');
const mysql = require('mysql');
const moment = require('moment-timezone');

const router = express.Router();
router.use(express.json());

function obtenerAhora() {
    let now = moment().tz('America/Argentina/Buenos_Aires').format();
    return now;
}

function obtenerDia(num) {
    let now = moment()
        .tz('America/Argentina/Buenos_Aires')
        .subtract(num, 'days')
        .hour(0)
        .minute(0)
        .second(0)
        .format();
    return now;
}

let con = mysql.createPool({
    connectionLimit: 4,
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
});

router.post('/datos', (req, res) => {
    const serie = req.body.serie;
    const sql = `SELECT temp, hum, lum FROM datos WHERE serie = '${serie}' ORDER BY ID DESC LIMIT 1`;
    con.query(sql, (err, result) => {
        if (err) {
            try {
                throw err;
            } catch (e) {
                res.status(400).json({
                    errorMessage: `Endpoint: ${req.path}. Sucedio un error: ${e}`,
                });
            }
        } else {
            res.status(200).json(result[0]);
        }
    });
});

router.post('/graficos', (req, res) => {
    const serie = req.body.serie;
    const periodo = obtenerDia(req.body.periodo);
    const tiempoActual = obtenerAhora();
    let sql = `SELECT tiempo, temp, hum, lum FROM datos WHERE serie = '${serie}'`;
    sql += `AND tiempo BETWEEN '${periodo}' AND '${tiempoActual}'`;
    con.query(sql, (err, result) => {
        if (err) {
            try {
                throw err;
            } catch (e) {
                res.status(400).json({
                    errorMessage: `Endpoint: ${req.path}. Sucedio un error: ${e}`,
                });
            }
        } else {
            let dataArray = {
                tempArray: [],
                humArray: [],
            };
            for (let i = 0; i < result.length; i++) {
                dataArray.tempArray[i] = result[i].temp;
                dataArray.humArray[i] = result[i].hum;
                dataArray.lumArray[i] = result[i].lum;
                result[i].tiempo = moment(result[i].tiempo).format('YYYY-MM-DD HH:mm:ss');
                dataArray.timeArray[i] = moment
                    .tz(result[i].tiempo, 'America/Argentina/Buenos_Aires')
                    .format();
            }
            res.status(200).json(dataArray);
        }
    });
});

router.post('/insert', (req, res) => {
    let tiempoActual = obtenerAhora();
    const data = req.body;
    let sql = `INSERT INTO datos (id, tiempo, serie, temp, hum, lum) `;
    sql += `VALUES (NULL, '${tiempoActual}', '${data.serie}', ${data.temp}, ${data.hum}, ${data.lum})`;
    con.query(sql, (err) => {
        if (err) {
            try {
                throw err;
            } catch (e) {
                res.status(400).json({
                    errorMessage: `Endpoint: ${req.path}. Sucedio un error al recibir: ${e}`,
                });
            }
        } else {
            res.status(200).send('Post hecho correctamente');
        }
    });
});

module.exports = router;
