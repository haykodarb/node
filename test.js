 let moment = require('moment-timezone');

 let now = moment().subtract(7, 'days').tz('America/Argentina/Buenos_Aires').format('YYYY-MM-DD');
 
 console.log(now);