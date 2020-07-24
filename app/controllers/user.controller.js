const userService = require('../services/user.service');
const awsService = require('../services/aws.service')
const statsClient = require('statsd-client');
const stats = new statsClient({ host: 'localhost', port: 8125 });
const logger = require('../config/winston-logger.config');

let passport = require('passport');
let userId;
// Create and Save a new User
exports.createUser = (req, res) => {

  var timer = new Date();
  stats.increment('Create User');
  logger.info("POST request for user");

    const resolve = (user) => {
        res.status(200);
        delete user.dataValues.password;//deleting the password in the response
        res.json(user);
        stats.timing('Post User Time', timer);
    };

    const resolveDuplicateUserCheck = () => {
      // Proceed to save user post duplicate check
      userService.save(req, res)
          .then(resolve)
          .catch(renderErrorResponse(res, 500, "Error occured while creating User"));
    };

    userService.duplicateEmailCheck(req)
        .then(resolveDuplicateUserCheck)
        .catch(renderErrorResponse(res, 500, "Duplicate Email"));
  };

// Find a single User with userName
exports.getUser = (req, res) => {

  var timer = new Date();
  stats.increment('Get User');
  logger.info("Get request for User");

    const resolve = (user) => {
        res.status(200);
        delete user.dataValues.password;//deleting the password in the response
        res.json(user);
        stats.timing('Get User Time', timer);
    };

    userService.get(req, res)
        .then(resolve)
        .catch(renderErrorResponse(res, 500, "Error occured while retrieving User"));

  };

// Find a single User with userName
exports.authenticateUser = (req, res) => {

  var timer = new Date();
  stats.increment('Login User');
  logger.info("POST request for user login");

  const resolve = (user) => {
      res.status(200);
      userId = user.dataValues.id;
      req.login(userId, function(err) {
        delete user.dataValues.password;//deleting the password in the response
        user.dataValues.token = Math.random();
        res.json(user);
        stats.timing('Login User Time', timer);
      })      
  };

  userService.authenticate(req, res)
      .then(resolve)
      .catch(renderErrorResponse(res, 500, "Error occured while retrieving User"));

};

// Update a User by the userName in the request
exports.updateUser = (req, res) => {

  var timer = new Date();
  stats.increment('Update User');
  logger.info("PUT request for User");

    const resolve = (user) => {
        res.status(200);
        res.send({
          message: "User was updated successfully."
        })
        stats.timing('Update User Time', timer);
    };

    userService.update(req, res)
      .then(resolve)
      .catch(renderErrorResponse(res, 500, "Cannot update User, Maybe User was not found or req.body is empty!"));
  };

exports.logoutUser = (req, res) => {

  var timer = new Date();
  stats.increment('Logout User');
  logger.info("Get request for user logout");

    req.logout();
    req.session.destroy();
    req.session = null;  
    res.status(200);
    res.send({
      message: "Logged out successfully."
    })
    stats.timing('Logout User Time', timer);
}

exports.resetPassword = (req, res) => {

  var timer = new Date();
  stats.increment('Reset Password');
  logger.info("Reset password request for User");

    const resolve = () => {
        res.status(200);
        res.json("bla bla");
        stats.timing('Reset Password Time', timer);
    };

    const resolveToSendEmail = () => {
      awsService.snsSendPasswordResetEmail(req, res)
      .then(resolve)
      .catch(renderErrorResponse(res, 500, "Error occured while sending Email"));
    }

    userService.authenticate(req, res)
      .then(resolveToSendEmail)
      .catch(renderErrorResponse(res, 500, "Error occured while retrieving User"));

  };

  /**
 * Function for rendering the error on the screen
 */
let renderErrorResponse = (response, code, message) => {
    
  const errorCallback = (error) => {
      console.log(error);
      if (error) {
          response.status(code);
          response.json({
              message: error.message ? error.message : message
          });
      } else {
          response.status(code);
          response.json({
              message: message ? message : ""
          });
      }
  }
  return errorCallback;
};

passport.serializeUser(function(userId, done) {
    done(null, userId);
});
  
passport.deserializeUser(function(userId, done) {
      done(null, userId);
});