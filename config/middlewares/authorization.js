/**
 * Generic require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
    if (req.user === null || typeof req.user === "undefined") {
        return res.status(401).send({
            error: 'User is not authorized',
            code: 'UNAUTHORIZED'
        });
    }
    next();
};

/**
 * User authorizations routing middleware
 */
exports.user = {
    hasAuthorization: function(req, res, next) {
        if (req.profile.id != req.user.id) {
            return res.status(401).send({
                error: 'User is not authorized',
                code: 'UNAUTHORIZED'
            });
        }
        next();
    }
};

exports.isSRS = function(req, res, next) {
    if (req.user === null || typeof req.user === "undefined" || req.user.type != 2) {
        return res.status(401).send({
            error: 'User is not authorized',
            code: 'UNAUTHORIZED'
        });
    }
    next();
};
exports.isDriver = function(req, res, next) {
    if (req.user === null || typeof req.user === "undefined" || req.user.type != 3) {
        return res.status(401).send({
            error: 'User is not authorized',
            code: 'UNAUTHORIZED'
        });
    }
    next();
};