'use strict';

const database = require('./../helpers/database');
const uuid = require('uuid');

module.exports = {
    'create_action': function (req, res) {
        if (req.session.id) {

            database.connect(function (err, db) {
                if (err) {
                    throw err;
                }

                db.collection('rooms', function (err, collection) {
                    if (err) {
                        throw err;
                    }

                    var roomId;

                    do {
                        roomId = uuid.v1();
                    } while (false); // @TODO

                    collection.insertOne({
                        'id': roomId,
                        'timestamp': new Date().getTime(),
                        'users': [
                            req.session.id
                        ]
                    });

                    req.session.rooms.push(roomId);

                    db.close();

                    return res.json({
                        'href': roomId,
                        'success': true
                    });
                });
            });
        } else {
            return res.json({
                'success': false
            });
        }
    },
    'show_action': function (req, res) {
        if (req.params.uuid && (req.session.rooms.indexOf(req.params.uuid) !== false)) {
            database.connect(function (err, db) {
                if (err) {
                    throw err;
                }

                db.collection('rooms', function (err, collection) {
                    if (err) {
                        throw err;
                    }

                    collection.findOne({'id': req.params.uuid}, function (err, picture) {
                        db.close();

                        if (picture === null) {
                            return req.next();
                        }

                        return res.render('room/show', {'title': 'Your private room'});
                    });
                });
            });
        } else {
            return req.next();
        }
    }
};
