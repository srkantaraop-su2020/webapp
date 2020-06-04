'use strict';
const db = require("../models");
const Cart = db.carts;

/**
 * Saves and returns the new item in the cart.
 */
exports.addToCart = function (request, response) {

    if (request.body.quantity <= 0  ) {
        return Promise.reject(new Error('Please select atleast 1 item to the cart!'));
    }

    const promise = Cart.create({
        buyer_id: request.body.buyerId,
        book_id: request.body.bookId,
        quantity: request.body.quantity,
        price: request.body.price,
        book_name: request.body.title
    });
    return promise;
};

/**
 * Update item in the cart.
 */
exports.updateCartItem = function (request, response) {

    if (request.body.quantity <= 0  ) {
        return Promise.reject(new Error('Please select atleast 1 item!'));
    }

    let updatedCartRequest = {
        quantity: request.body.quantity
    }

    const promise = Cart.update(updatedCartRequest, {
        where: { id: request.params.cartId }
    });
    return promise;
};

/**
 * Get cart item
 */
exports.getCartItem = function (request, response) {

    const promise = Cart.findOne({
        where: {
            book_id: request.params.bookId
        }
    });
    return promise;
};

exports.checkForDuplicateItemInCart = function(request, response) {
    return Cart.count({ where: { 
            book_id: request.body.bookId,
            buyer_id: request.body.buyerId 
        }})
        .then(count => {
            if (count > 0) 
                return Promise.reject(new Error('Item already exists in your cart, Manage the item under View Cart section!'));
            else 
                return Promise.resolve();
        })
}

/**
 * Get cart item
 */
exports.getCartItemsByBuyerId = function (request, response) {

    const promise = Cart.findAll({
        where: {
            buyer_id: request.params.buyerId
        }
    });
    return promise;
};

