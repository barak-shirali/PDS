var users       = require('../app/controllers/users');
var orders      = require('../app/controllers/orders');
var index       = require('../app/controllers/index');
var bam       = require('../app/controllers/bam');

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
    // app.get     ('/api/users/:userId', auth.requiresLogin, users.me);
    // app.post    ('/api/users', users.create);
    app.put     ('/api/users', auth.requiresLogin, users.update);
    app.post    ('/api/users/location', auth.requiresLogin, users.updateLocation);
    app.get     ('/api/users/:userId/location', auth.requiresLogin, auth.isSRS, users.getLocation);
    app.post    ('/api/users/status', auth.requiresLogin, users.updateStatus);
    app.get     ('/api/users/stats', auth.requiresLogin, users.userStats);


    // app.get     ('/api/users/auth/failed', users.failed);

    // Finish with setting up the userId param
    app.param('userId', users.user);

    // Order Routes
    app.get     ('/api/orders', auth.requiresLogin, orders.all);
    app.post    ('/api/orders', auth.requiresLogin, auth.requiresLogin, auth.isSRS, orders.create);
    app.get     ('/api/orders/:orderId', auth.requiresLogin, orders.show);
    // app.put     ('/api/orders/:orderId', auth.requiresLogin, orders.update);
    app.del     ('/api/orders/:orderId', auth.requiresLogin, auth.isSRS, orders.destroy);
    app.post    ('/api/orders/:orderId/request', auth.requiresLogin, auth.isSRS, orders.requestDriver);
    app.post    ('/api/orders/:orderId/accept', auth.requiresLogin, auth.isDriver, orders.acceptOrder);
    app.post    ('/api/orders/:orderId/deny', auth.requiresLogin, auth.isDriver, orders.denyOrder);
    app.post    ('/api/orders/:orderId/cancel', auth.requiresLogin, auth.isDriver, orders.cancelOrder);
    app.post    ('/api/orders/:orderId/pickup', auth.requiresLogin, orders.pickupOrder);
    app.post    ('/api/orders/:orderId/2minaway', auth.requiresLogin, auth.isDriver, orders.almostThereOrder);
    app.post    ('/api/orders/:orderId/dropoff', auth.requiresLogin, auth.isDriver, orders.dropoffOrder);
    app.post    ('/api/orders/:orderId/complete', auth.requiresLogin, auth.isSRS, orders.completeOrder);
    app.post    ('/api/orders/:orderId/review', auth.requiresLogin, auth.isSRS, orders.reviewDriver);
    app.param   ('orderId', orders.order);


    // BAM only
    app.get     ('/bam/users', auth.isAdmin, bam.users_index);
    app.post    ('/bam/users', auth.isAdmin, bam.users_create);
    app.put     ('/bam/users/:id', auth.isAdmin, bam.users_update);
    app.get     ('/bam/users/:id', auth.isAdmin, bam.users_get);
    app.get     ('/bam/payments', auth.requiresLogin, bam.payments_index);
    app.get     ('/bam/payments/:id', auth.requiresLogin, bam.payments_get);
    app.get     ('/bam/payments/braintree/token', auth.requiresLogin, bam.payments_braintree_token);
    app.get     ('/bam/payments/braintree/webhook', bam.braintree_webhook);
    app.get     ('/bam/payments/paypal/card', auth.requiresLogin, bam.payments_paypal_get_card);
    app.post    ('/bam/payments/paypal/card', auth.requiresLogin, bam.payments_paypal_save_card);
    app.get     ('/bam/payments/paypal/webhook/cancel', bam.payments_paypal_webhook_cancel);
    app.get     ('/bam/payments/paypal/webhook/success', bam.payments_paypal_webhook_success);
    app.post     ('/bam/payments/paypal/webhook/ipn', bam.payments_paypal_webhook_ipn);

    // Home route
    app.get('/', index.render);

};
