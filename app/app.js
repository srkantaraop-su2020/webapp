'use strict';
module.exports = function (app) {
    //Initialize models
    let userModel = require('./models');

    //Initialize routes
    let userRoutes = require('./routes/user.route');
    userRoutes(app);
};