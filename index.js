const { createClientForPath, getData, setData } = require("./client");
const { env } = require("./environment");
const { error, info, debug } = require("./log");

const path = `${env.basePath}/${env.clientId}`;

(async function run() {
  let value;
  while (true) {
    try {
      info("Connecting");
      const [client, initialValue] = await createClientForPath(env.host, path);
      info("Conntected");

      if (!value) {
        debug("Setting initial value", initialValue);
        value = initialValue;
      }
      while (true) {
        value = await generateNextSequenceValue(client, value);
        debug("Gererating sequence value", value);
      }
    } catch (e) {
      error("Failed to operate! Going to restart connection");
      error(e.message);
    }
  }
})();

async function generateNextSequenceValue(client, value) {
  await throttle();
  await preGenerateValidation(client, value);
  const generated = await generateItem(client, value);
  await postGenerateValidation(client, generated);
  return generated;
}

async function postGenerateValidation(client, generated) {
  const nextValue = await getData(client, path);
  if (generated !== +nextValue) {
    throw new Error("Current value in zookeeper is not equal to generated one");
  }
  return +nextValue;
}

async function preGenerateValidation(client, value) {
  const current = await getData(client, path);
  if (value !== +current) {
    throw new Error("Current value is not equal to value in zookeeper");
  }
}

function throttle() {
  return new Promise((res) => setTimeout(res, env.throttleTimeout));
}

async function generateItem(client, value) {
  const newNum = value + 1;
  await setData(client, path, Buffer.from(`${newNum}`));
  return newNum;
}
