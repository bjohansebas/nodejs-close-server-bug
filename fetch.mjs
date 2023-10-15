import * as http from "http";
import nodeFetchLib from "node-fetch";

export const FetchType = {
  NATIVE: "native",
  LIBRARY: "library",
  REQUEST: "request",
};

export function nativeFetch(url) {
  if (!("fetch" in globalThis)) {
    console.log("No native fetch support, skipping");
    process.exit(0);
  }

  return globalThis.fetch(url);
}

export function nodeFetch(url) {
  return nodeFetchLib(url);
}

export function requestFetch(url) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, (res) => {
      const chunks = [];

      res.on("data", (chunk) => {
        chunks.push(chunk);
      });

      res.on("end", () => {
        const buffer = Buffer.concat(chunks);
        resolve({
          status: res.statusCode,
          statusText: res.statusMessage,
          text: () => Promise.resolve(buffer.toString()),
        });
      });
    });

    req.on("error", reject);
    req.end();
  });
}

export function fetch(params, type = FetchType.NATIVE) {
  switch (type) {
    case FetchType.NATIVE:
      return nativeFetch(params);
    case FetchType.LIBRARY:
      return nodeFetch(params);
    case FetchType.REQUEST:
      return requestFetch(params);
    default:
      throw new Error("Invalid fetch type");
  }
}
