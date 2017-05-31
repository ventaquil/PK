'use strict';

const crypto = require('crypto');
const database = require('./../helpers/database');
const uuid = require('uuid');

function random(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

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

                    var room_id;

                    const makeAction = function () { // Make evil function to hack do..while
                        room_id = crypto.createHmac('sha256', uuid.v1()).digest('hex').substr(0, random(8, 16));

                        collection.count({'id': room_id}, null, function (err, count) {
                            if (err) {
                                throw err;
                            }

                            if (count > 0) { // Oh, generate another identifier
                                makeAction(); // Evil recursive call - because of async
                            } else {
                                collection.insertOne({
                                    'id': room_id,
                                    'timestamp': new Date().getTime(),
                                    'users': [
                                        req.session.id
                                    ],
                                    'join': crypto.createHmac('sha256', room_id).digest('hex').substr(0, random(4, 8))
                                });

                                req.session.rooms.push(room_id);

                                db.close();

                                return res.json({
                                    'href': room_id,
                                    'success': true
                                });
                            }
                        });
                    };

                    makeAction(); // Evil recursive call
                });
            });
        } else {
            return res.json({
                'success': false
            });
        }
    },
    'join_action': function (req, res) {
        if (req.params.uuid) {
            if (req.session.rooms.indexOf(req.params.uuid) >= 0) {
                return res.redirect(['', 'room', req.params.uuid].join('/'));
            } else if (req.params.join) {
                database.connect(function (err, db) {
                    if (err) {
                        throw err;
                    }

                    db.collection('rooms', function (err, collection) {
                        if (err) {
                            throw err;
                        }

                        collection.findOne({'id': req.params.uuid, 'join': req.params.join}, function (err, room) {
                            if (err) {
                                throw err;
                            }

                            if ((room === null) || (room.users.length === 2)) {
                                return req.next();
                            }

                            req.session.rooms.push(room.id);

                            room.users.push(req.session.id);

                            collection.update({'id' : room.id}, room, null, function (err) {
                                if (err) {
                                    throw err;
                                }

                                db.close();

                                return res.redirect(['', 'room', req.params.uuid].join('/'));
                            });
                        });
                    });
                });
            } else {
                return req.next();
            }
        } else {
            return req.next();
        }
    },
    'show_action': function (req, res) {
        if (req.params.uuid && (req.session.rooms.indexOf(req.params.uuid) >= 0)) {
            database.connect(function (err, db) {
                if (err) {
                    throw err;
                }

                db.collection('rooms', function (err, collection) {
                    if (err) {
                        throw err;
                    }

                    collection.findOne({'id': req.params.uuid}, function (err, room) {
                        if (err) {
                            throw err;
                        }

                        db.close();

                        if (room === null) {
                            return req.next();
                        }

                        const join_url = [req.protocol + '://' + req.get('host'), 'room', room.id, room.join].join('/');

                        return res.render('room/show', {
                            'join_url': join_url,
                            'room': room,
                            'title': 'Your private room'
                        });
                    });
                });
            });
        } else {
            return req.next();
        }
    }
};
