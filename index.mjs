import * as http from "node:http";
import { promisify } from "node:util";

const server = http.createServer(async (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.write("Hello world");
  res.end();
});
const listenPromisied = promisify(server.listen.bind(server));
const closePromisied = promisify(server.close.bind(server));

await listenPromisied(0, "127.0.0.1");
const address = server.address();
await fetch(`http://${address.address}:${address.port}`);
console.time("server close");
await closePromisied();
console.timeEnd("server close");
