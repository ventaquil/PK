'use strict';

const database = require('./application/helpers/database');
const express = require('express');
const logger = require('./application/helpers/logger');
const process = require('process');

const app = express();
const http = require('http').Server(app);

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
