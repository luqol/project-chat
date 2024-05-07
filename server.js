const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

const users = [];
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

  socket.on('newUser', (user) => {
    console.log('New user: ' + user);
    users.push({name: user, id: socket.id});
    if (users.length > 1){
      socket.broadcast.emit('message', {author: 'Chat Bot', content: `${user} has joined the conversation!`});
    }

  });

  socket.on('message', (message) => { 
    console.log('Oh, I\'ve got something from ' + socket.id) 
    messages.push(message);
    socket.broadcast.emit('message', message);
  });

  socket.on('disconnect', () => { 
    console.log('Oh, socket ' + socket.id + ' has left');
    const index = users.findIndex(user => user.id === socket.id);

    if (index !== -1){
      console.log('User ' + users[index].name + ' has left');
      socket.broadcast.emit('message', {author: 'Chat Bot', content: `${users[index].name} has left the conversation... :( `});
      users.splice(index, 1);
      
    } 
  });

});