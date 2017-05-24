'use strict';

const crypto = require('crypto');
const directory = require('./helpers/directory');
const error = require('./controllers/error');
const express = require('express');
const homepage = require('./controllers/homepage');
const room = require('./controllers/room');
const session = require('express-session');

const routes = function (app) {
    this._app = app;

    this._middlewares();

    this._routes();
};

routes.prototype._middlewares = function () {
    const registered = [
        express.static(directory.public()),
        session({
            'cookie': {
                'secure': false
            },
            'name': 'sid',
            'resave': false,
            'saveUninitialized': true,
            'secret': process.env.SECURE || 'secure'
        }),
        function (req, res, next) { // Create rooms array in session
            if (!req.session.rooms) {
                req.session.rooms = [];
            }

            next();
        },
        function (req, res, next) { // Set session hash identifier
            if (!req.session.identifier) {
                req.session.identifier = crypto.createHmac('sha256', req.session.id).digest('hex');

                res.cookie('identifier', req.session.identifier, {});
            }

            next();
        }
    ];

    const app = this._app;

    registered.forEach(function (middleware) {
        app.use(middleware);
    });
};

routes.prototype._routes = function () {
    const app = this._app;

    { // Homepage
        app.get('/', homepage.index_action);
    }

    { // Rooms
        app.post('/create', room.create_action);

        app.get('/room/:uuid', room.show_action);

        app.get('/room/:uuid/:join', room.join_action);
    }

    app.all('*', error.code_404);
};

module.exports = function (app) {
    return new routes(app);
};
