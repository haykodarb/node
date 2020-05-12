const express = require('express');

const router = express.Router();

router.get('/views/login.ejs', (req, res) => {
    res.sendFile(__dirname + "/views/login.ejs"); 
}); 

router.get('/views/register.ejs', (req, res) => {
    res.sendFile(__dirname + "/views/register.ejs"); 
}); 

router.get('/views/dashboard.ejs', (req, res) => {
    res.sendFile(__dirname + "/views/dashboard.ejs"); 
}); 

router.get('/scripts/dashboard.js', (req, res) => {
    res.sendFile(__dirname + "/scripts/dashboard.js"); 
}); 

router.get('/scripts/graph.js', (req, res) => {
    res.sendFile(__dirname + "/scripts/graph.js"); 
}); 

router.get('/styles/style.css', (req, res) => {
    res.sendFile(__dirname + "/styles/style.css"); 
}); 

module.exports = router;