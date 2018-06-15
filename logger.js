const winston = require('winston');
const moment = require('moment');

const dateFormat = () => {
  return moment().format('YYYY-MM-DD HH:mm:ss:SSS');
};

const transports = [ new winston.transports.Console({
  name: 'console',
  colorize: true,
  level: 'info',
  label: process.pid,
  timestamp: dateFormat,
}) ];


module.exports = new winston.Logger({
  transports,
});
