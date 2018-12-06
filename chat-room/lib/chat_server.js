const socketio = require('socket.io');
let io, guestNumber = 1;
const nickNames = {},
  namesUsed = [],
  currentRoom = {};

// 分配昵称
function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
  const name = 'Guest' + guestNumber;
  nickNames[socket.id] = name;
  socket.emit('nameResult', {
    success: true,
    text: name
  });
  namesUsed.push(name);
  return guestNumber + 1;
}

// 加入聊天室
function joinRoom(socket, room) {
  socket.join(room);
  currentRoom[socket.id] = room;
  socket.emit('joinResult', {room: room});
  socket.broadcast.to(room).emit('message', {
    text: nickNames[socket.id] + ' has joined ' + room + '.'
  })

  const usersInRoom = io.of('/').in(room).clients;
  let usersInRoomSummary = '';
  if(usersInRoom.length > 1) {
    usersInRoomSummary += 'Users currently in ' + room + ': ';
    for(let index in usersInRoom) {
      const userSocketId = usersInRoom[index].id;
      if(index > 0) {
        usersInRoomSummary += ', ';
      }
      usersInRoomSummary += nickNames[userSocketId];
    }
  }
  usersInRoomSummary += '.';
  socket.emit('message', {text: usersInRoomSummary});
}

// 更名请求
function handleNameChangeAttempts(socket, nickNames, namesUsed) {
  socket.on('nameAttempt', function(name) {
    if(name.indexOf('Guest') === 0) {
      socket.emit('nameResult', {
        success: false,
        text: 'Names cannot begin with "Guest".'
      })
    } else {
      if (namesUsed.indexOf(name) === -1) {
        const previousName = nickNames[socket.id];
        const previousNameIndex = namesUsed.indexOf(previousName);
        namesUsed.push(name);
        nickNames[socket.id] = name;
        delete namesUsed[previousNameIndex];
        
        socket.emit('nameResult', {
          success: true,
          text: previousName + ' is now known as ' + name + '.'
        })
      } else {
        socket.emit('nameResult', {
          success: true,
          text: 'That name is already in use.'
        })
      }
    }
  });
}

// 发送聊天消息
function handleMessageBoradcasting(socket) {
  socket.on('message', function (message) {
    // 别的聊天室的消息，在默认聊天室可以看到，反之不行
    socket.broadcast.to(message.room).emit('message', {
      text: nickNames[socket.id] + ': ' + message.text
    })
  })
}

// 创建房间
function handleRoomJoining(socket) {
  socket.on('join', function(room) {
    socket.leave(currentRoom[socket.id]);
    joinRoom(socket, room.newRoom);
  });
}

// 用户断开链接
function handleClientDisconnection(socket) {
  socket.on('disconnect', function() {
    const nameIndex = namesUsed.indexOf(nickNames[socket.id]);
    delete namesUsed[nameIndex];
    delete nickNames[socket.id];
  })
}

exports.listen = function(server) {
  io = socketio.listen(server);
  io.set('log level', 1);
  io.sockets.on('connection', function(socket) {
    guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
    joinRoom(socket, 'Lobby');
    handleMessageBoradcasting(socket, nickNames, namesUsed);
    handleNameChangeAttempts(socket, nickNames, namesUsed);
    handleRoomJoining(socket);

    socket.on('rooms', function() {
      console.log(io.of('/').adapter.rooms)
      socket.emit('rooms', io.of('/').adapter.rooms);
    })

    handleClientDisconnection(socket, nickNames, namesUsed);
  })
}