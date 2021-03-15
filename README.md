# Zookeeper testing project

It writes sequence of numbers to zookeeper. It also validate writes and check if data was not lost for some reason.

## How to use

Project is dockerized so it can be used everywhere with docker. Simple docker example:

```
docker run -it --rm -e ZOO_HOST="zooip" -e CLIENT_ID="uniqueid" krewilone/zookeeper-test
```

Kubernetes example:

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: zookeeper-test
  labels:
    app: zoo-test
spec:
  replicas: 1
  selector:
    matchLabels:
      app: zoo-test
  template:
    metadata:
      labels:
        app: zoo-test
    spec:
      containers:
      - name: zootest
        image: krewilone/zookeeper-test
        env:
          - name: ZOO_HOST
            value: zoo_ip:2181
          - name: CLIENT_ID
              valueFrom:
              fieldRef:
                  fieldPath: metadata.name
```

## ENV variables

You have to provide 2 env variables: **ZOO_HOST** and **CLIENT_ID**. **ZOO_HOST** is ip of zookeeper and **CLIENT_ID** should be unique client identifier. ClientId will be used for resolving zookeeper path. Default path is /test/${clientId}. /test can be also overriden with env variable **BASE_PATH**. There is one more optional variable called **THROTTLE_TIMEOUT**, which is used for sequence throttling, default is 5000. **LOG_LEVEL** is optional variable, with default to _info_ and accepts _"debug", "info", "error"._
