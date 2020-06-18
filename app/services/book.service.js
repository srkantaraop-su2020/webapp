'use strict';
const db = require("../models");
const Book = db.books;

/**
 * Saves and returns the new user.
 */
exports.save = function (request, response) {

    if (!request.body.isbn || !request.body.title || !request.body.quantity || !request.body.price || !request.body.sellerId || !request.body.publicationDate ) {
        return Promise.reject(new Error('All fields are mandatory!'));
    }
    
    if (request.body.quantity && (request.body.quantity < 1  || request.body.quantity > 999)) {
        return Promise.reject(new Error('Quantity should be between 1 and 999!'));
    }

    if (request.body.price && (request.body.price < 0.01  || request.body.price > 9999.99)) {
        return Promise.reject(new Error('Price should be between 0.01 and 9999.99!'));
    }

    const promise = Book.create({
        isbn: request.body.isbn,
        title: request.body.title,
        publication_date: request.body.publicationDate,
        quantity: request.body.quantity,
        price: request.body.price,
        seller_id: request.body.sellerId
    });
    console.log(promise)
    return promise;
};

/**
 * Returns all books.
 */
exports.getAllBooks = function (request, response) {
    const promise = Book.findAll({
        include: ["authors"],
        order: [['price','ASC']]
    });
    return promise;
};

/**
 * Returns book by Id.
 */
exports.getBook = function (bookId, response) {
    const promise = Book.findByPk(bookId, { include: ["authors"] });
    return promise;
};

/**
 * Updates and returns the book object.
 */
exports.update = function (request, response) {
    const promise = Book.update(request.body, {
        where: { id: request.body.id }
    })
    return promise;
};

/**
 * Delete a book
 */
exports.delete = function (request, response) {
    const promise = Book.destroy({
        where: { id: request.params.bookId }
    });
    return promise;
};


exports.duplicateBookCheckBySameSeller = function(request, response) {
    return Book.count({
        where: { 
            title: request.body.title,
            seller_id: request.body.sellerId,
            isbn: request.body.isbn
        }
    })
    .then(count => {
        if (count > 0) 
            return Promise.reject(new Error("You've already added this book. Please modify it if any changes are to be made."));
        else 
            return Promise.resolve();
    })
}
