const env = (() => {
  return {
    host: requireEnv("ZOO_HOST"),
    clientId: requireEnv("CLIENT_ID"),
    throttleTimeout: process.env["THROTTLE_TIMEOUT"] ?? 5000,
    basePath: process.env["BASE_PATH"] ?? "/test",
    logLevel: process.env["LOG_LEVEL"] ?? "info",
    sleepBeforeExit: process.env["EXIT_SLEEP"] ?? 30000,
    retryConnection: process.env["CONNECTION_RETRY"] ?? 0,
  };
})();

function requireEnv(name) {
  const env = process.env[name];
  if (!env) {
    throw new Error(`Env variable ${name} not found!!!`);
  }
  return env;
}

module.exports = {
  env,
};
