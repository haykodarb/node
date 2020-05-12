//Modules
const express = require('express');
const ejs = require('ejs');
const cors = require('cors');

//Routes
const api = require('./routes/api');
const dashboard = require('./routes/dashboard');
const login = require('./routes/login');
const register = require('./routes/register');
const verify = require('./tools/tokenVerify');

const app = express();

app.use(cors());

app.set('views', './views');
app.set('view engine', 'ejs');

app.use('/api', api);
app.use('/dashboard', dashboard);
app.use('/login', login);
app.use('/register', register);

app.listen(3000, () => {
    console.log('Listening on port 3000');
});

app.get('/', verify, (req, res) => {
    res.redirect('./dashboard');
});
