const logfmt = require("logfmt");
const { env } = require("./environment");

const info = log.bind(null, "info");
const error = log.bind(null, "error");
const debug = log.bind(null, "debug");
const logLevel = env.logLevel;

function log(logfnc, ...messages) {
  const message = messages.join(" ");
  const log = {
    time: new Date().toLocaleString(),
    message,
  };
  if (LevelToPriority[logfnc] >= LevelToPriority[logLevel]) {
    console[logfnc](logfmt.stringify(log));
  }
}

const LevelToPriority = {
  debug: 0,
  info: 1,
  error: 2,
};

module.exports = {
  info,
  debug,
  error,
};
