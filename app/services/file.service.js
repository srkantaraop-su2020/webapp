'use strict';
const db = require("../models");
const File = db.files;

/**
 * Saves and returns the new user.
 */
exports.save = function (request, response) {

    const promise = File.create({
        file_name: request.body.fileName,
        owner_id: request.body.ownerId,
        book_id: request.body.bookId
    });
    console.log(promise)
    return promise;
};

exports.get = function (request, response) {

    const promise = File.findAll({
        where: {
            owner_id: request.params.sellerId,
            book_id: request.params.bookId
        }
    });
    console.log(promise)
    return promise;
};

exports.deleteImagefromDB = function (request, response) {
    const promise = File.destroy({
        where: { 
            file_name: request.params.fileName,
            book_id: request.params.bookId
         }
    });
    return promise;
}

