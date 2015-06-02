
var users       = require('../app/controllers/users');
var bundles    = require('../app/controllers/bundles');
var cards    = require('../app/controllers/cards');
var transactions    = require('../app/controllers/transactions');
var messages    = require('../app/controllers/messages');
var index       = require('../app/controllers/index');

exports.init = function(app, passport, auth) {

    console.log('Initializing Routes');

    // User Routes
    app.post    ('/api/users/auth', passport.authenticate('local', {
        successRedirect: '/api/users/me',
        failureRedirect: '/api/users/auth/failed'
    }));
    app.get     ('/api/users/forget', users.requestForget);
    app.post    ('/api/users/forget', users.verifyForget);

    app.get     ('/api/users/signout', auth.requiresLogin, users.signout);
    app.get     ('/api/users/me', auth.requiresLogin, users.me);
    app.get     ('/api/users/:userId', auth.requiresLogin, users.me);
    // app.post    ('/api/users', users.create);
    app.put     ('/api/users', auth.requiresLogin, users.update);

    app.get     ('/api/users/auth/failed', users.failed);

    // Finish with setting up the userId param
    app.param('userId', users.user);

    // Order Routes
    // app.get     ('/api/orders', auth.requiresLogin, orders.all);
    // app.post    ('/api/orders', auth.requiresLogin, auth.requiresLogin, orders.create);
    // app.get     ('/api/orders/:bundleId', auth.requiresLogin, orders.show);
    // app.put     ('/api/orders/:bundleId', auth.requiresLogin, orders.update);
    // app.del     ('/api/orders/:bundleId', auth.requiresLogin, orders.destroy);
    // app.param('bundleId', orders.bundle);

    // Home route
    app.get('/', index.render);

};
