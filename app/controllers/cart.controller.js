const cartService = require('../services/cart.service');
const bookService = require('../services/book.service');
const statsClient = require('statsd-client');
const stats = new statsClient({ host: 'localhost', port: 8125 });
const logger = require('../config/winston-logger.config');

// Create and Save a new Book
exports.addItemToCart = (req, res) => {

    var timer = new Date();
    stats.increment('Add Item to cart');
    logger.info("POST request for cart item");

    let noOfBooks;
    const resolveOnAdditionToCart = (book) => {

        let updatedBookReq = {
            body: {
                id: req.body.bookId,
                quantity: noOfBooks - req.body.quantity
            }
        }
        bookService.update(updatedBookReq, res)
            .then()
            .catch(renderErrorResponse(res, 500, "Failed to update the quantity of the item"));

        res.status(200);
        res.json(book);
        stats.timing('Post Cart item Time', timer);
    };

    const resolveToVerifyQuantity = (book) => {
        noOfBooks = book.quantity 
        if(book.quantity < req.body.quantity) {
            res.status(500);
            res.json({"message": "There are only "+book.quantity+" books available!"})
            stats.timing('Post Cart item Time', timer);
            return
        }

        else {
            req.body.title = book.title;
            cartService.addToCart(req)
            .then(resolveOnAdditionToCart)
            .catch(renderErrorResponse(res, 500, "Failed to add item to cart"));
        }
    }

    const resolveToAddBookToCart = (book) => {
        bookService.getBook(req.body.bookId)
        .then(resolveToVerifyQuantity)
        .catch(renderErrorResponse(res, 500, "Book not available anymore"))
    }
    
    cartService.checkForDuplicateItemInCart(req)
        .then(resolveToAddBookToCart)
        .catch(renderErrorResponse(res, 500, "Item already exists in your cart!"))
};

exports.getCartItem = (req,res) => {

    var timer = new Date();
    stats.increment('Get Cart Item');
    logger.info("Get request for cart item");

    const resolve = (cart) => {
        res.status(200);
        res.json(cart);
        stats.timing('Get Cart item Time', timer);
    }

    cartService.getCartItem(req)
        .then(resolve)
        .catch(renderErrorResponse(res, 500, "Failed to retrieve items from cart"))
}

exports.getCartItemsByBuyerId = (req,res) => {

    var timer = new Date();
    stats.increment('Get Cart items by Buyer Id');
    logger.info("Get request for Cart items by Buyer Id");

    const resolve = (items) => {
        res.status(200);
        res.json(items);
        stats.timing('Get cart items Time', timer);
    }

    cartService.getCartItemsByBuyerId(req)
        .then(resolve)
        .catch(renderErrorResponse(res, 500, "Failed to retrieve cart items by buyer id"))
}

exports.updateCartItem = (req,res) => {

    var timer = new Date();
    stats.increment('Update Cart item');
    logger.info("PUT request for cart item");

    let noOfBooks;
    const resolveToUpdateItemQuantity = (book) => {

        let updatedBookReq = {
            body: {
                id: req.body.bookId,
                quantity: noOfBooks + parseInt(req.body.oldQty) - parseInt(req.body.quantity)
            }
        }
        
        bookService.update(updatedBookReq, res)
            .then()
            .catch(renderErrorResponse(res, 500, "Failed to update the quantity of the item"));

        res.status(200);
        res.json(book);
        stats.timing('Update Cart Item', timer);
    };

    const resolveToVerifyQuantity = (book) => {
        noOfBooks = book.quantity 
        if(book.quantity < req.body.quantity) {
            res.status(500);
            res.json({"message": "There are only "+book.quantity+" books available! Update failed!"})
            stats.timing('Update Cart Item', timer);
            return
        }
    
        else {
            req.body.title = book.title;
            cartService.updateCartItem(req)
                .then(resolveToUpdateItemQuantity)
                .catch(renderErrorResponse(res, 500, "Failed to update an item in the cart"))
        }
    }
    
    bookService.getBook(req.body.bookId)
        .then(resolveToVerifyQuantity)
        .catch(renderErrorResponse(res, 500, "Book not available anymore"))
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