const express = require('express');
const jwt = require('jsonwebtoken');
const verify = require('../tools/tokenVerify');
const cookieParser = require('cookie-parser');

const router = express.Router();

router.use(cookieParser());

router.get('/', verify, (req, res) => {
    let data = jwt.verify(req.cookies.token, 'tokensecret');
    res.render('dashboard', {
        serie: data.serie
    });
});

module.exports = router;