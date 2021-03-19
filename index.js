const { createClientForPath, getData, setData } = require("./client");
const { env } = require("./environment");
const { error, info, debug } = require("./log");
const {
  InvalidSequenceError,
  invalidSequenceType,
} = require("./invalidSequence");

const path = `${env.basePath}/${env.clientId}`;

(async function run() {
  let value, currentClient;
  while (true) {
    try {
      info("Connecting");
      const [client, initialValue] = await createClientForPath(env.host, path);

      currentClient = client;
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
      if (e.type && e.type === invalidSequenceType) {
        value = undefined;
      }
    } finally {
      currentClient.close();
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
    throw new InvalidSequenceError();
  }
  return +nextValue;
}

async function preGenerateValidation(client, value) {
  const current = await getData(client, path);
  if (value !== +current) {
    throw new InvalidSequenceError();
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
