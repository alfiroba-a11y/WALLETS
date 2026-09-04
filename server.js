const http = require("http");
const fs = require("fs");
const path = require("path");

const port = process.env.PORT || 3000;

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const server = http.createServer((request, response) => {
  const requestPath = request.url === "/"
    ? "index.html"
    : decodeURIComponent(request.url.split("?")[0]).replace(/^\/+/, "");

  const filePath = path.resolve(__dirname, requestPath);

  if (!filePath.startsWith(__dirname)) {
    response.writeHead(403);
    return response.end("Forbidden");
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(error.code === "ENOENT" ? 404 : 500);
      return response.end(error.code === "ENOENT" ? "Not found" : "Server error");
    }

    response.writeHead(200, {
      "Content-Type": contentTypes[path.extname(filePath)] || "application/octet-stream"
    });

    response.end(content);
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`FlowSend is running on port ${port}`);
});
