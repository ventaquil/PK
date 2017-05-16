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

                    var roomId;

                    do {
                        roomId = uuid.v1();
                    } while (false); // @TODO

                    collection.insertOne({
                        'id': roomId,
                        'timestamp': new Date().getTime(),
                        'users': [
                            req.session.id
                        ],
                        'join': crypto.createHmac('sha256', roomId).digest('hex').substr(5, random(4, 16))
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
                            if (room === null) {
                                return req.next();
                            }

                            req.session.rooms.push(room.id);

                            room.users.push(req.session.id);

                            console.log(room, req.session.id);

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
