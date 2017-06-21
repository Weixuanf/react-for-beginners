//import express from 'express';

//const app = express();

//app.use('/', express.static('public'));
//
//app.listen(process.env.PORT || 3000);
//console.log('listening at 3000');

var server = require('./src/app');
var port = 3001;

server.listen(port, function() {
  // eslint-disable-next-line
  console.log('Server running on port: %d', port);
});
