/**
 * Todo endpoint route definitions.
 */

'use strict';
module.exports = function (app) {
    const userController = require('../controllers/user.controller');
    // Todo Routes for search and create.
    app.route('/v1/user')
        .post(userController.createUser)
        .put(userController.updateUser)
        .get(userController.getUser);
    app.route('/v1/user/login')
        .post(userController.authenticateUser);
    app.route('/v1/user/logout')
        .get(userController.logoutUser)
};

function authenticationMiddleware() {
    return (req,res,next) => {
        console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);
        if(req.isAuthenticated()) return next();
        res.status(401);
        res.json({
            message: "Unauthorized to access this page"
        })
    }
}