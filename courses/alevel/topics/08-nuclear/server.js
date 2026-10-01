const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = process.env.PORT || 3000;
const types = {
  ".html":"text/html; charset=utf-8",
  ".css":"text/css; charset=utf-8",
  ".js":"application/javascript; charset=utf-8",
  ".json":"application/json; charset=utf-8",
  ".webmanifest":"application/manifest+json; charset=utf-8",
  ".svg":"image/svg+xml",
  ".png":"image/png",
  ".jpg":"image/jpeg",
  ".jpeg":"image/jpeg",
  ".webp":"image/webp",
  ".ico":"image/x-icon"
};

function safePath(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]).replace(/^\/+/, "");
  const requested = clean || "index.html";
  const full = path.normalize(path.join(root, requested));
  return full.startsWith(root) ? full : null;
}

http.createServer((req,res)=>{
  if ((req.url || "").split("?")[0] === "/favicon.ico") { res.writeHead(204); return res.end(); }
  let file = safePath(req.url || "/");
  if (!file) { res.writeHead(403); return res.end("Forbidden"); }
  fs.stat(file,(err,stat)=>{
    if (!err && stat.isDirectory()) file=path.join(file,"index.html");
    fs.readFile(file,(readErr,data)=>{
      if (readErr) {
        if (!path.extname(file)) {
          return fs.readFile(path.join(root,"index.html"),(e,index)=>{
            if(e){res.writeHead(404);return res.end("Not found");}
            res.writeHead(200,{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-cache"});
            res.end(index);
          });
        }
        res.writeHead(404);return res.end("Not found");
      }
      const ext=path.extname(file).toLowerCase();
      res.writeHead(200,{
        "Content-Type":types[ext] || "application/octet-stream",
        "Cache-Control": ext===".html" ? "no-cache" : "public, max-age=3600"
      });
      res.end(data);
    });
  });
}).listen(port,"0.0.0.0",()=>console.log("Nuclear Physics Learning Lab listening on",port));