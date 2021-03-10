const env = (() => {
  return {
    host: requireEnv("ZOO_HOST"),
    clientId: requireEnv("CLIENT_ID"),
    throttleTimeout: process.env["THROTTLE_TIMEOUT"] ?? 5000,
    basePath: process.env["BASE_PATH"] ?? "/test",
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
