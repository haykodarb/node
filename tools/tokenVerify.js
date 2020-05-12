const jwt = require('jsonwebtoken');
const express = require('express');
const cookieParser = require('cookie-parser');

const router = express.Router();

router.use(cookieParser());

module.exports = function verify(req, res, next) {
    if(!req.cookies) {
        return res.redirect('./login');
    }
    try {
        const token = req.cookies.token;
        let data = jwt.verify(token, "tokensecret");
        next();
    }
    catch {
        return res.redirect('./login');
    }
}

