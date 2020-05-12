const verify = require('../tools/tokenVerify');
const express = require('express');
const Joi = require('@hapi/joi');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const randomize = require('../tools/randomize');

const router = express.Router();
router.use(cookieParser());
router.use(express.urlencoded({ extended: true}));   

router.get('/', (req, res) => {
    res.render('login.ejs');
});

let salt = bcrypt.genSaltSync(10);

let con = mysql.createPool({
    connectionLimit: 4,
    host: 'us-cdbr-gcp-east-01.cleardb.net',
    user: 'bd70014928536a',
    password: `a867a9ff`,
    database: `gcp_3a44f6029eefbaf3050d`
  });

const userSchema = Joi.object({
    username: Joi.string().min(6).required(),
    password: Joi.string().min(6).required()
});


router.post('/', (req, res) => {
    let user = {
        username: req.body.username,
        password: req.body.password
    }
    const { error } = userSchema.validate(req.body);
    if (error) {
        let err = error.details[0].message;
        return res.render('login', {
            err: err
        });
    } 
    let sqlVerify = `SELECT serie, password FROM users WHERE username = '${user.username}'`;
    con.query(sqlVerify, (err, result) => {
        if (result[0]) {
            let validPass = bcrypt.compareSync(user.password, result[0].password); 
            if(!validPass) {
                let err = 'La contraseña ingresada es incorrecta';
                return res.render('login', {
                    err: err
                });
            } else {
                const tokenSecret = "tokensecret"
                const token = jwt.sign( {username: user.username, serie: result[0].serie }, tokenSecret);
                res.cookie('token', token);
                res.redirect('../dashboard');
            }
        } else {
            let err = 'El usuario ingresado no existe';
            return res.render('login', {
                err: err
            });
        }   
    });       
});

module.exports = router;