'use strict';

module.exports = {
    'code_404': function (req, res) {
        res.status(404).render('error/code404', {'title': 'Code 404'});
    }
};
