'use strict';

module.exports = {
    'index_action': function (req, res) {
        res.render('homepage/index', {'title': 'Welcome to Throw a coin'});
    }
};
