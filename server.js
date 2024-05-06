const express = require('express');
const path = require('path');

const app = express();

const messange = [];

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/clients/build/index.html'));
  });

app.use((req, res) => {
  res.status(404);
  res.json({messange: 'Not found...'});
});

app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running on port: 8000');
});