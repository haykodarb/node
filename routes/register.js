const express = require('express');
const Joi = require('@hapi/joi');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const randomize = require('../tools/randomize');

const router = express.Router();

router.use(express.json());
router.use(cookieParser());
router.use(express.urlencoded( { extended: true}));

let salt = bcrypt.genSaltSync(10);

let con = mysql.createPool({
    connectionLimit: 4,
    host: 'us-cdbr-gcp-east-01.cleardb.net',
    user: 'bd70014928536a',
    password: `a867a9ff`,
    database: `gcp_3a44f6029eefbaf3050d`
  });
  

const registerSchema = Joi.object({
    username: Joi.string().min(6).required(),
    email: Joi.string().min(10).required().email(),
    password: Joi.string().min(6).required()
});


function obtenerTiempo() {
    let now = moment().tz('America/Argentina/Buenos_Aires').format();
    return now;
  }

router.get('/', (req, res) => {
    let token = req.cookies.token;
    if(!token){
        return res.render('register');
    } 
    try {
        let data = jwt.verify(token, "tokensecret");
        return res.redirect('./dashboard');
    }
    catch {
        return res.render('register');;
    }
});


router.post('/', (req, res) => {
    let hassedPass = bcrypt.hashSync(req.body.password, salt);
    let user = {
        username: req.body.username,
        email: req.body.email,
        password: hassedPass,
        date: obtenerTiempo()
    };
    const { error } = registerSchema.validate(req.body);
    if (error) {
        let err = error.details[0].message;
        res.render('register', {
            err: err,
        });
    } 
    else {
        let sqlVerify = `SELECT username, email FROM users WHERE email = '${user.email}' OR username = '${user.username}'`
        con.query(sqlVerify, (error, result) => {
            if (result[0]) {
                let err =   'Este usuario o email ya está siendo utilizado'; 
                res.render('register', {
                    err: err
                }); } 
            else {
                let serie = randomize(8);
                let sqlCreate = `INSERT INTO users (id, date, serie, username, email, password) `;
                sqlCreate += `VALUES (NULL, '${user.date}', '${serie}', '${user.username}', '${user.email}', '${user.password}')`;
                con.query(sqlCreate, (err) => {
                    if (err) {
                        try {
                            throw err;
                        } 
                        catch (e) {
                            res.status(400).json({ errorMessage: `Endpoint: ${req.path}. Sucedio un error al recibir: ${e}`});
                        }
                    } 
                    else {    
                        res.render('register', {
                            err: `Su usuario fue creado correctamente. Su código individual es "${serie}", por favor ingreselo junto con sus credenciales de WiFi en su dispositivo.`
                        });
                    }
                });
            }
        });
    } 
});


module.exports = router;