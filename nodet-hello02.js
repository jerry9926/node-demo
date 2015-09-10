var http = require("http");

http.createServer(function(require, response) {
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write("Hello World\n");
	response.write("change");
	response.end();
}).listen(8888);