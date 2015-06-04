var users       = require('../app/controllers/users');
var orders      = require('../app/controllers/orders');
var index       = require('../app/controllers/index');

exports.init = function(app, passport, auth) {

    console.log('Initializing Routes');

    // User Routes
    // app.post    ('/api/users/auth', passport.authenticate('local', {
    //     successRedirect: '/api/users/me',
    //     failureRedirect: '/api/users/auth/failed'
    // }));

    //SESSION middleware

    app.post    ('/api/users/auth', users.auth);

    app.get     ('/api/users/forget', users.requestForget);
    app.post    ('/api/users/forget', users.verifyForget);

    app.get     ('/api/users/signout', auth.requiresLogin, users.signout);
    app.get     ('/api/users/me', auth.requiresLogin, users.me);
    app.get     ('/api/users/:userId', auth.requiresLogin, users.me);
    // app.post    ('/api/users', users.create);
    app.put     ('/api/users', auth.requiresLogin, users.update);
    app.post    ('/api/users/location', auth.requiresLogin, users.updateLocation);
    app.post    ('/api/users/status', auth.requiresLogin, users.updateStatus);

    // app.get     ('/api/users/auth/failed', users.failed);

    // Finish with setting up the userId param
    app.param('userId', users.user);

    // Order Routes
    app.get     ('/api/orders', auth.requiresLogin, orders.all);
    app.post    ('/api/orders', auth.requiresLogin, auth.requiresLogin, auth.isSRS, orders.create);
    app.get     ('/api/orders/:orderId', auth.requiresLogin, orders.show);
    app.put     ('/api/orders/:orderId', auth.requiresLogin, orders.update);
    app.del     ('/api/orders/:orderId', auth.requiresLogin, auth.isSRS, orders.destroy);
    app.post    ('/api/orders/:orderId/request', auth.requiresLogin, auth.isSRS, orders.requestDriver);
    app.post    ('/api/orders/:orderId/accept', auth.requiresLogin, auth.isDriver, orders.acceptOrder);
    app.post    ('/api/orders/:orderId/deny', auth.requiresLogin, auth.isDriver, orders.denyOrder);
    app.param   ('orderId', orders.order);

    // Home route
    app.get('/', index.render);

};
