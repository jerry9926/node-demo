/**
 * Created by zhijie.huang on 2017/9/22.
 */

const WebSocketServer = require('ws');
const wss = new WebSocketServer.Server({
    port: 8080,
    verifyClient: socketverify
});

setupWebsocket();

function setupWebsocket() {
    wss.on('connection', function(ws) {
        ws.onmessage = message;
        ws.onclose = close;
        ws.onerror = errorFun;
        ws.onopen = open;

        ws.isAlive = true;
        ws.on('pong', heartbeat);

        ws.send('hello+');

         setInterval(() => {
             try {
                 ws.send('something' + new Date());
             } catch (err) {
                console.error('Send Error', err);
             }
         }, 3000);
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