const http = require("http");
const fs = require("fs");
const path = require("path");

const port = Number(process.env.PORT) || 3000;
const root = path.resolve(__dirname);

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
  const rawPath = request.url === "/"
    ? "/index.html"
    : request.url.split("?")[0];

  const relativePath = decodeURIComponent(rawPath).replace(/^[/\\]+/, "");
  const filePath = path.resolve(root, relativePath);

  const isOutsideProject =
    !filePath.startsWith(root + path.sep) &&
    filePath !== path.join(root, "index.html");

  if (isOutsideProject) {
    response.writeHead(403, {
      "Content-Type": "text/plain; charset=utf-8"
    });

    return response.end("Forbidden");
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(error.code === "ENOENT" ? 404 : 500, {
        "Content-Type": "text/plain; charset=utf-8"
      });

      return response.end(
        error.code === "ENOENT" ? "Not found" : "Server error"
      );
    }

    response.writeHead(200, {
      "Content-Type": contentTypes[path.extname(filePath)] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff"
    });

    response.end(content);
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`FlowSend sandbox listening on port ${port}`);
});
