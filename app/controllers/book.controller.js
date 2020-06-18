const bookService = require('../services/book.service');
const authorService = require('../services/author.service');

// Create and Save a new Book
exports.createBook = (req, res) => {
    const resolve = (book) => {
        res.status(200);
        res.json(book);
    };

    const resolveToSaveBook = (book) => {
        bookService.save(req)
            .then(resolve)
            .catch(renderErrorResponse(res, 500, "Failed to create Book"));
    }
    
    bookService.duplicateBookCheckBySameSeller(req)
        .then(resolveToSaveBook)
        .catch(renderErrorResponse(res, 500, "You've already added this book. Please modify it if any changes are to be made."))
};

// Update a Book
exports.updateBook = (req, res) => {
    const resolve = (book) => {
        res.status(200);
        res.json(book);
    };

    bookService.update(req)
        .then(resolve)
        .catch(renderErrorResponse(res, 500, "Failed to update Book"));
};

// Get all books
exports.getBooks = (req, res) => {
    const resolve = (book) => {
        res.status(200);
        res.json(book);
    };

    bookService.getAllBooks(req)
        .then(resolve)
        .catch(renderErrorResponse(res, 500, "Failed to retrieve Books"));
};

// Get book by Id
exports.getBookById = (req, res) => {
    const resolve = (book) => {
        res.status(200);
        res.json(book);
    };

    bookService.getBook(req.params.bookId)
        .then(resolve)
        .catch(renderErrorResponse(res, 500, "Failed to retrieve Book by Id"));
};

// Delete a book
exports.deleteBook = (req, res) => {

    const resolveOnBookDeletion = (book) => {
        res.status(200);
        res.json({"message":"Successfully deleted Booka and its Authors"});
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