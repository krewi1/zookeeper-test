const zookeeper = require("node-zookeeper-client");
const { env } = require("./environment");

async function createClientForPath(host, path) {
  const client = zookeeper.createClient(host, {
    sessionTimeout: 10000,
    spinDelay: 1000,
    retries: 1,
  });
  await connect(client);
  const exist = await exists(client, path);

  if (exist) {
    const initialData = await getData(client, path);
    return [client, +initialData];
  }

  await mkdir(client, path);
  const initialData = await getData(client, path);
  return [client, +initialData];
}

async function getData(client, path) {
  return new Promise((res, rej) => {
    const timeoutId = setTimeout(
      () => rej(new Error("Get data timeout")),
      15000
    );
    client.getData(path, (err, data) => {
      clearTimeout(timeoutId);
      if (err) {
        return rej(err);
      }
      return res(data.toString("utf8"));
    });
  });
}

async function setData(client, path, data) {
  return new Promise((res, rej) => {
    const timeoutId = setTimeout(
      () => rej(new Error("Set data timeout")),
      15000
    );
    client.setData(path, data, (err, stat) => {
      clearTimeout(timeoutId);
      if (err) {
        return rej(err);
      }
      return res();
    });
  });
}

async function mkdir(client, path) {
  return new Promise((res, rej) => {
    client.mkdirp(path, Buffer.from("0"), (err) => {
      if (err) {
        return rej(err);
      }
      res();
    });
  });
}

async function exists(client, path) {
  return new Promise((res, rej) => {
    client.exists(path, (err, stat) => {
      if (err) {
        return rej(err);
      }
      res(Boolean(stat));
    });
  });
}

async function connect(client) {
  return new Promise((res) => {
    client.once("connected", res);
    client.connect();
  });
}

module.exports = {
  getData,
  setData,
  createClientForPath,
};
