const bookService = require('../services/book.service');
const authorService = require('../services/author.service');
const statsClient = require('statsd-client');
const stats = new statsClient({ host: 'localhost', port: 8125 });
const logger = require('../config/winston-logger.config');

// Create and Save a new Book
exports.createBook = (req, res) => {

    var timer = new Date();
    stats.increment('Create Book');
    logger.info("POST request for book");

    const resolve = (book) => {
        res.status(200);
        res.json(book);
        stats.timing('Post Book Time', timer);
    };

    const resolveToSaveBook = (book) => {
        bookService.save(req)
            .then(resolve)
            .catch(renderErrorResponse(res, 500, "Failed to create Book"));
    }
    
    if(req.body.token == "" || req.body.token == null || !req.body.token) {
        res.status(403);
        res.json("You don't have permission to create book, Please login!")
    }
    else {
        bookService.duplicateBookCheckBySameSeller(req)
        .then(resolveToSaveBook)
        .catch(renderErrorResponse(res, 500, "You've already added this book. Please modify it if any changes are to be made."))
    }
};

// Update a Book
exports.updateBook = (req, res) => {

    var timer = new Date();
    stats.increment('Update Book');
    logger.info("PUT request for book");

    const resolve = (book) => {
        res.status(200);
        res.json(book);
        stats.timing('Update Book Time', timer);
    };

    bookService.update(req)
        .then(resolve)
        .catch(renderErrorResponse(res, 500, "Failed to update Book"));
};

// Get all books
exports.getBooks = (req, res) => {

    var timer = new Date();
    stats.increment('Get Books');
    logger.info("GET request for books");

    const resolve = (book) => {
        res.status(200);
        res.json(book);
        stats.timing('Get Books Time', timer);
    };

    bookService.getAllBooks(req)
        .then(resolve)
        .catch(renderErrorResponse(res, 500, "Failed to retrieve Books"));
};

// Get book by Id
exports.getBookById = (req, res) => {

    var timer = new Date();
    stats.increment('Get Book by Id');
    logger.info("Get request for book by Id");

    const resolve = (book) => {
        res.status(200);
        res.json(book);
        stats.timing('Get Book Time', timer);
    };

    bookService.getBook(req.params.bookId)
        .then(resolve)
        .catch(renderErrorResponse(res, 500, "Failed to retrieve Book by Id"));
};

// Delete a book
exports.deleteBook = (req, res) => {

    var timer = new Date();
    stats.increment('Delete Book');
    logger.info("Delete request for book");

    const resolveOnBookDeletion = (book) => {
        res.status(200);
        res.json({"message":"Successfully deleted Booka and its Authors"});
        stats.timing('Delete Book Time', timer);
    };
    
    const resolveOnAuthorDeletion = () => {
        bookService.delete(req)
        .then(resolveOnBookDeletion)
        .catch(renderErrorResponse(res, 500, "Failed to delete Book"));
    };
    
    authorService.delete(req)
        .then(resolveOnAuthorDeletion)
        .catch(renderErrorResponse(res, 500, "Failed to delete Authors"))
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