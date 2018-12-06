/**
 * Created by zhijie.huang on 2017/9/22.
 */
const fs = require('fs');
const path = require('path');
const WebSocketServer = require('ws');
const wss = new WebSocketServer.Server({
    port: 8080,
    verifyClient: socketverify
});

console.log('__dirname=' + __dirname);


let data = fs.readFileSync(path.resolve(__dirname, 'data1.json'), {encoding: 'utf8'});
try {
    data = JSON.parse(data);
} catch (err) {
    console.error('json error', err);
}

console.log(data.length);

setupWebsocket();

function sendData(ws, data) {
    setInterval(function () {
        let res = data[Math.floor(Math.random() * data.length)]
        res = JSON.stringify(res);
        ws.send(res);
    }, 2000)
}

function setupWebsocket() {
    wss.on('connection', function(ws) {
        ws.onmessage = message;
        ws.onclose = close;
        ws.onerror = errorFun;
        ws.onopen = open;

        ws.isAlive = true;
        ws.on('pong', heartbeat);

        ws.send('hello+');

        sendData(ws, data);
    });
}
function heartbeat() {
    this.isAlive = true;
}

function socketverify(info) {
    const origin = info.origin.match(/^(:?.+\:\/\/)([^\/]+)/);
    console.log('origin = ' + origin);
    return true;
}

function message(msg) {
    console.log('onmessage = ' + msg.data);
}

function errorFun(err) {
    console.error('socket err', err);
}

function close(data) {
    console.log('onclose', data);
    setupWebsocket();
}

function open() {
    console.log('onopen');
}