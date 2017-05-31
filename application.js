'use strict';

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

var numbers = [];

io.on('connection', function(socket) {
    socket.on('connection', function (room_id, user_id) {
        logger.log('Connection event: room -> ' + room_id + ', user -> ' + user_id, verbose);

        io.emit('is anybody here', room_id);

        logger.log('Is anybody here emit: room -> ' + room_id, verbose);
    }).on('disconnection', function (room_id, user_id) {
        logger.log('Disconnection event: room -> ' + room_id + ', user -> ' + user_id, verbose);

        io.emit('somebody is leaving', room_id, user_id);

        logger.log('Somebody is leaving emit: room -> ' + room_id + ', user -> ' + user_id, verbose);
    }).on('i am here', function (room_id, user_id) {
        logger.log('I am here event: room -> ' + room_id + ', user -> ' + user_id, verbose);

        io.emit('somebody is here', room_id, user_id);

        logger.log('Somebody is here emit: room -> ' + room_id + ', user -> ' + user_id, verbose);
    }).on('protocol initialization', function (room_id, user_id, random_value, hashed_value) {
        logger.log('Protocol initialization event: room -> ' + room_id + ', user -> ' + user_id + ', random value -> ' + random_value + ', hashed value -> ' + hashed_value, verbose);

        numbers[room_id] = random_value;

        io.emit('protocol hashed value', room_id, user_id, hashed_value);

        logger.log('Protocol hashed value emit: room -> ' + room_id + ', user -> ' + user_id + ', hashed value -> ' + hashed_value, verbose);
    }).on('protocol parity', function (room_id, user_id, parity) {
        logger.log('Protocol parity event: room -> ' + room_id + ', user -> ' + user_id + ', parity -> ' + parity, verbose);

        io.emit('protocol parity check', room_id, user_id, parity);

        logger.log('Protocol parity check emit: room -> ' + room_id + ', user -> ' + user_id + ', parity -> ' + parity, verbose);

        io.emit('protocol original number', room_id, user_id, numbers[room_id]);

        logger.log('Protocol original number emit: room -> ' + room_id + ', user -> ' + user_id + ', original number -> ' + numbers[room_id], verbose);

        delete numbers[room_id];
    });
});
