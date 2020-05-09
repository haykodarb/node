 let moment = require('moment-timezone');

 let now = moment().tz('America/Argentina/Buenos_Aires').subtract(0, 'days').hour(0).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss');
 
 console.log(now);