const jwt = require("jsonwebtoken");
const express = require("express");
const cookieParser = require("cookie-parser");

const router = express.Router();

router.use(cookieParser());

module.exports = function verify(req, res, next) {
  if (typeof req.cookies.token === "undefined") {
    return res.redirect("./login");
  } else {
    const token = req.cookies.token;
    jwt.verify(token, process.env.token_secret, function (
      err,
      decoded
    ) {
      if (typeof decoded === 'undefined') {
        res.redirect("./login");        
      } else {
        next();
      }
    });
  }
};
