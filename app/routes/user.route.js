/**
 * Todo endpoint route definitions.
 */

'use strict';
module.exports = function (app) {

    const userController = require('../controllers/user.controller');
    const bookController = require('../controllers/book.controller');
    const authorController = require('../controllers/author.controller');
    const cartController = require('../controllers/cart.controller');
    const fileController = require('../controllers/file.controller');
    const fileConfig = require('../config/file.config');

    app.route('/v1/user')
        .post(userController.createUser)
        .put(userController.updateUser)
        .get(userController.getUser);
    app.route('/v1/user/login')
        .post(userController.authenticateUser);
    app.route('/v1/user/logout')
        .get(userController.logoutUser)

    app.route('/v1/book')
        .post(bookController.createBook)
        .get(bookController.getBooks)
        .put(bookController.updateBook);
        
    app.route('/v1/book/:bookId')
        .get(bookController.getBookById)
        .delete(bookController.deleteBook);

    app.route('/v1/author')
        .post(authorController.createAuthor);
    app.route('/v1/author/:bookId')
        .put(authorController.updateAuthor);

    app.route('/v1/addToCart')
        .post(cartController.addItemToCart);

    app.route('/v1/getCartItems/:buyerId')
        .get(cartController.getCartItemsByBuyerId);

    app.route('/v1/updateCartItem/:cartId')
        .put(cartController.updateCartItem)

    app.route('/v1/image')
        .post(fileController.uploadImageToS3)
    app.route('/v1/bookImage')
        .post(fileController.createBookImage)
    app.route('/v1/images/seller/:sellerId/book/:bookId')
        .get(fileController.getImages)
    app.route('/v1/image/fileName/:fileName/bookId/:bookId')
        .delete(fileController.deleteFile)

    // app.post('/v1/image2', fileConfig.upload.single('bookImage'),fileController.createBookImage)

};

function authenticationMiddleware() {
    return (req,res,next) => {
        console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);
        if(req.isAuthenticated()) return next();
        res.status(401);
        res.json({
            message: "Unauthorized to access this page"
        })
    }
}