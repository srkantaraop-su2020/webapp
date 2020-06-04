const userService = require('../services/user.service');
let passport = require('passport');
let userId;
// Create and Save a new User
exports.createUser = (req, res) => {
    const resolve = (user) => {
        res.status(200);
        delete user.dataValues.password;//deleting the password in the response
        res.json(user);
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

    console.log("*****Check if request is authenticated on arrival to profile page: "+req.isAuthenticated()+"***********");
    const resolve = (user) => {
        res.status(200);
        delete user.dataValues.password;//deleting the password in the response
        res.json(user);
    };

    userService.get(req, res)
        .then(resolve)
        .catch(renderErrorResponse(res, 500, "Error occured while retrieving User"));

  };

// Find a single User with userName
exports.authenticateUser = (req, res) => {

  const resolve = (user) => {
      res.status(200);
      userId = user.dataValues.id;
      req.login(userId, function(err) {
        console.log("*****Check if request is authenticated after login: "+req.isAuthenticated()+req.user+"***********");
        delete user.dataValues.password;//deleting the password in the response
        res.json(user);
      })      
  };

  userService.authenticate(req, res)
      .then(resolve)
      .catch(renderErrorResponse(res, 500, "Error occured while retrieving User"));

};

// Update a User by the userName in the request
exports.updateUser = (req, res) => {
    const resolve = (user) => {
        res.status(200);
        res.send({
          message: "User was updated successfully."
        })
    };

    userService.update(req, res)
      .then(resolve)
      .catch(renderErrorResponse(res, 500, "Cannot update User, Maybe User was not found or req.body is empty!"));
  };

exports.logoutUser = (req, res) => {
    req.logout();
    req.session.destroy();
    req.session = null;  
    res.status(200);
    res.send({
      message: "Logged out successfully."
    })
}
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