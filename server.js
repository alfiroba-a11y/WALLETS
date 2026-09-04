const http = require("http");
const fs = require("fs");
const path = require("path");

const port = process.env.PORT || 3000;
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8"
};

http.createServer((req, res) => {
  const requested = req.url === "/" ? "index.html" : req.url.split("?")[0].replace(/^\/+/, "");
  const file = path.resolve(__dirname, requested);

  if (!file.startsWith(__dirname)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.readFile(file, (error, data) => {
    if (error) {
      res.writeHead(404);
      return res.end("Not found");
    }

    res.writeHead(200, {
      "Content-Type": types[path.extname(file)] || "application/octet-stream"
    });
    res.end(data);
  });
}).listen(port, () => console.log(`Running on port ${port}`));
