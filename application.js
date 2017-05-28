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
    socket.on('connection', function (msg) {
        console.log("connection user " + msg.user_id + " to room " + msg.room_id);
        io.emit('isanybodyhere', 'is anybody here');
    }).on('disconnection', function (msg) {
        console.log("disconnection user " + msg.user_id + " from room " + msg.room_id);
        io.emit('somebodyisleaving', msg);
    }).on('iamhere', function (msg) {
        //console.log(msg);
        io.emit('somebodyishere', msg);
    });
});
