'use strict';

const directory = require('./helpers/directory');
const error = require('./controllers/error');
const express = require('express');
const homepage = require('./controllers/homepage');
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
        })
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

    app.all('*', error.code_404);
};

module.exports = function (app) {
    return new routes(app);
};
