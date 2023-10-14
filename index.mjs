import * as http from "node:http";

function listenServerPromised(server, port, hostname) {
  return new Promise((resolve) => {
    server.listen(port, hostname, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

function closeServerPromised(server) {
  return new Promise((resolve, reject) => {
    console.time("server close");
    server.close((error) => {
      console.timeEnd("server close");
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.write("Hello world");
  res.end();
});

await listenServerPromised(server, 0, "127.0.0.1");
const address = server.address();
await fetch(`http://${address.address}:${address.port}`);
await closeServerPromised(server);
