const express = require('express');
const http = require('http');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Troque 'COM3' pela porta do seu HC-05 (ex: COM4, /dev/ttyUSB0, etc.)
const port = new SerialPort({ path: 'COM5', baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

app.use(express.static('public'));

parser.on('data', data => {
  console.log('pH recebido:', data);
  io.emit('arduinoData', data);  // Envia para o navegador
});

server.listen(3000, () => {
  console.log('Acesse http://localhost:3000 para ver os dados.');
});
