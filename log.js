const logfmt = require("logfmt");

const info = log.bind(null, "info");
const error = log.bind(null, "error");

function log(logfnc, message) {
  const log = {
    time: new Date().toLocaleString(),
    message,
  };
  console[logfnc](logfmt.stringify(log));
}

module.exports = {
  info,
  error,
};
