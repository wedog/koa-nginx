const winston = require('winston');
const moment = require('moment');

const dateFormat = () => {
  return moment().format('YYYY-MM-DD HH:mm:ss:SSS');
};
const log = level => [
  new winston.transports.Console({
    name: 'console',
    colorize: true,
    level,
    label: process.pid,
    timestamp: dateFormat,
  }),
];
module.exports = level => {
  const transports = log(level);
  return new winston.Logger({
    transports,
  });
};
