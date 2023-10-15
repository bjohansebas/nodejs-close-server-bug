import * as http from "node:http";
import { promisify } from "node:util";
import { fetch } from "./fetch.mjs";

const fetchType = process.env.FETCH_TYPE;

console.log("Using fetch type", fetchType);

const server = http.createServer(async (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.write("Hello world");
  res.end();
});
const listenPromisied = promisify(server.listen.bind(server));
const closePromisied = promisify(server.close.bind(server));

await listenPromisied(0, "127.0.0.1");
const address = server.address();
const response = await fetch(
  `http://${address.address}:${address.port}`,
  fetchType
);
const text = await response.text();
console.log(text);
console.time("server close");
await closePromisied();
console.timeEnd("server close");
