const jwt = require('jsonwebtoken');
const express = require('express');
const cookieParser = require('cookie-parser');

const router = express.Router();

router.use(cookieParser());

module.exports = function verify(req, res, next) {
    if (typeof req.cookies === 'undefined') {
        return res.redirect('./login');
    } else {
        try {
            const token = req.cookies.token;
            let data = jwt.verify(token, process.env.token_secret);
            next();
        } catch {
            return res.redirect('./login');
        }
    }
};
