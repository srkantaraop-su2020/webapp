const cartService = require('../services/cart.service');
const bookService = require('../services/book.service');

// Create and Save a new Book
exports.addItemToCart = (req, res) => {
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
    };

    const resolveToVerifyQuantity = (book) => {
        noOfBooks = book.quantity 
        if(book.quantity < req.body.quantity) {
            res.status(500);
            res.json({"message": "There are only "+book.quantity+" books available!"})
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

    const resolve = (cart) => {
        res.status(200);
        res.json(cart);
    }

    cartService.getCartItem(req)
        .then(resolve)
        .catch(renderErrorResponse(res, 500, "Failed to retrieve items from cart"))
}

exports.getCartItemsByBuyerId = (req,res) => {

    const resolve = (items) => {
        res.status(200);
        res.json(items);
    }

    cartService.getCartItemsByBuyerId(req)
        .then(resolve)
        .catch(renderErrorResponse(res, 500, "Failed to retrieve cart items by buyer id"))
}

exports.updateCartItem = (req,res) => {

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
    };

    const resolveToVerifyQuantity = (book) => {
        noOfBooks = book.quantity 
        if(book.quantity < req.body.quantity) {
            res.status(500);
            res.json({"message": "There are only "+book.quantity+" books available! Update failed!"})
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