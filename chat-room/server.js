const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const chatServer = require('./lib/chat_server');
const cache = {};

const server = http.createServer(function(req, res) {
  let filePath = false;
  if (req.url === '/') {
    filePath = 'public/index.html';
  } else {
    filePath = 'public' + req.url;
  }
  var absPath = './' + filePath;
  serverStatic(res, cache, absPath);
});

server.listen(3001, function() {
  console.log('Server listening on port 3001');
});

chatServer.listen(server);

function send404(res) {
  res.writeHead(404, {'content-type': 'text/plain'});
  res.write('Error 404: resource not found');
  res.end();
}

function sendFile(res, filePath, fileContent) {
  res.writeHead(
    200,
    {
      'content-type': mime.getType(path.basename(filePath))
    }
  );
  res.end(fileContent);
}

function serverStatic(res, cache, absPath) {
  if (cache[absPath]) {
    sendFile(res, absPath, cache[absPath])
  } else {
    fs.exists(absPath, function(exists) {
      if (exists) {
        fs.readFile(absPath, function(err, data) {
          if (err) {
            send404(res);
          } else {
            sendFile(res, absPath, data);
          }
        });
      } else {
        send404(res);
      }
    });
  }
}