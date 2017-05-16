'use strict';

const mongodb = require('mongodb').MongoClient;
const process = require('process');

const database = function () {
    this.port = process.env.MONGODB_PORT || 27017;

    this.database = process.env.MONGODB_DATABASE || 'pk';

    this.url = 'mongodb://localhost:' + this.port + '/' + this.database;
};

database.prototype.connect = function (callback) {
    mongodb.connect(this.url, callback);
};

module.exports = new database;
