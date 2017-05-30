'use strict';

const crypto = require('crypto');
const database = require('./application/helpers/database');
const express = require('express');
const logger = require('./application/helpers/logger');
const process = require('process');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 8000; // Choose application port

app.set('view engine', 'pug'); // Set render engine

const debug = process.env.DEBUG || false; // Debug mode?

const verbose = debug || process.env.VERBOSE || false; // Show all logs on console screen?

try {
    const routes = require('./application/routes')(app);

    database.connect(function (err, db) {
        if (err) {
            throw err;
        }

        logger.log('MongoDB is running (port ' + database.port + ', database ' + database.database + ')', true);

        db.close();
    });

    http.listen(port, function () { // Listen on specified port
        logger.log('Listening on port ' + port, true);
    });
} catch (exception) {
    logger.log('Exception occurred - ' + exception, true);
}

io.on('connection', function(socket) {
    socket.on('connection', function (room_id, user_id) {
        logger.log('Connection event: user -> ' + user_id + ', room -> ' + room_id, verbose);

        io.emit('isanybodyhere', room_id);
    }).on('disconnection', function (room_id, user_id) {
        logger.log('Disconnection event: user -> ' + user_id + ', room -> ' + room_id, verbose);

        io.emit('somebodyisleaving', room_id, user_id);
    }).on('iamhere', function (room_id, user_id) {
        logger.log('Iamhere event: user -> ' + user_id + ', room -> ' + room_id, verbose);

        io.emit('somebodyishere', room_id, user_id);
    }).on('protocol initialization', function(room_id, user_id, random_value) {
        logger.log('Protocol initialization event: random value -> ' + random_value + ', user -> ' + user_id + ', room -> ' + room_id, verbose);

        const hashedValue = crypto.createHash('sha1').update(random_value.toString()).digest('hex');
        console.log(hashedValue);
    });
});
