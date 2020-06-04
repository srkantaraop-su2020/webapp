'use strict';
const db = require("../models");
const Author = db.authors;

/**
 * Saves and returns the new author.
 */
exports.save = function (request, response) {

    const promise = Author.create({
        BookId : request.BookId,
        author_name: request.author_name
    });
    return promise;
}
    
exports.delete = function (request, response) {
    const promise = Author.destroy({
        where: { BookId: request.params.bookId },
        truncate: false
    });
    return promise;
};