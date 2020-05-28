'use strict';
const bcrypt = require('bcrypt');
const db = require("../models");
const User = db.users;
var emailValidator = require("email-validator");
var passwordValidator = require('password-validator');
const Op = db.Sequelize.Op;
// var auth = require('basic-auth');

// Create a schema
var schema = new passwordValidator();
    
// Add properties to it
schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits()                                 // Must have digits
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123'])  // Blacklist these values
    .has().symbols();                               

/**
 * Saves and returns the new user.
 */
exports.save = function (request, response) {

    if (!request.body.userName || !request.body.password  || !request.body.firstName  || !request.body.lastName  ) {
        return Promise.reject(new Error('All fields are mandatory!'));
    }

    if(!emailValidator.validate(request.body.userName)){
        return Promise.reject(new Error('Incorrect username format!'));
    }

    if(!schema.validate(request.body.password)){
        return Promise.reject(new Error("Password should comply to all of the following rules: * Minimum length - 8 * Maximum length - 100 * Atleast 1 Upper case * Atleast 1 Lower case * Atleast 1 digit * No Spaces * Should not be Passw0rd or Password123 * Atleast 1 symbol"));
    }

    const promise = User.create({
        first_name: request.body.firstName,
        last_name: request.body.lastName,
        password: bcrypt.hashSync(request.body.password, 10),
        user_name: request.body.userName
    });
    return promise;
};

/**
 * Returns the user object matching the username.
 */
exports.get = function (request, response) {
    const userName = request.query.userName
    var condition = { user_name: { [Op.like]: `%${userName}%` } };
    
    if (!userName) {
        return Promise.reject(new Error('Username cannot be empty'));
    }

    const promise = User.findOne({ where: condition })
    return promise;
};

exports.authenticate = function (request, response) {

    if(!emailValidator.validate(request.body.userName)){
        return Promise.reject(new Error('Incorrect username format!'));
    }

    return User.findOne({
        where: {
            user_name: request.body.userName,
        }
    }).then((user) =>{

        if(!user){
            return Promise.reject(new Error('User does not exist!'));
        } 

        if (bcrypt.compareSync(request.body.password, user.password)) {
            return user;
        }
        
        return Promise.reject(new Error("Incorrect password!"));
    });
}

exports.duplicateEmailCheck = function (request, response) {
    return User.count({ where: { user_name: request.body.userName }})
        .then(count => {
            if (count > 0) 
                return Promise.reject(new Error('Username already exists, choose a different EmailId!'));
            else 
                return Promise.resolve();
        })
}

/**
 * Updates and returns the user object.
 */
exports.update = function (request, response) {

    const userName = request.query.userName;
    if (request.body.userName) {
        return Promise.reject(new Error('User name cannot be updated!'));
    }

    if(request.body.password){
        request.body.password = bcrypt.hashSync(request.body.password, 10)
        if(!schema.validate(request.body.password)) {
            return Promise.reject(new Error("Password should comply to all of the following rules: * Minimum length - 8 * Maximum length - 100 * Atleast 1 Upper case * Atleast 1 Lower case * Atleast 1 digit * No Spaces * Should not be Passw0rd or Password123 * Atleast 1 symbol"));
        }
    }

    const promise = User.update(request.body, {
        where: { user_name: userName }
    })
    return promise;
};
