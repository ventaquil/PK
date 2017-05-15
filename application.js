'use strict';

const express = require('express');
const logger = require('./application/helpers/logger');

const app = express();
const http = require('http').Server(app);

const port = process.env.PORT || 8000; // Choose application port

app.set('view engine', 'pug'); // Set render engine

const routes = require('./application/routes')(app);

http.listen(port, function () { // Listen on specified port
    logger.log('Listening on port ' + port, true);
});
