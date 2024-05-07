const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

const messages = [];

app.use(express.static(path.join(__dirname, '/clients')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/clients/build/index.html'));
  });

app.use((req, res) => {
  res.status(404);
  res.json({messange: 'Not found...'});
});

const server = app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id - ' + socket.id);
  socket.on('message', (message) => { 
    console.log('Oh, I\'ve got something from ' + socket.id) 
    messages.push(message);
    socket.broadcast.emit('message', message);
  });

  socket.on('disconnect', () => { console.log('Oh, socket ' + socket.id + ' has left') });
  console.log('I\'ve added a listener on message event \n');
});