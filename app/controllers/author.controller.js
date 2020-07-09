const authorService = require('../services/author.service');
const statsClient = require('statsd-client');
const stats = new statsClient({ host: 'localhost', port: 8125 });
const logger = require('../config/winston-logger.config');

// Create and Save a new Author
exports.createAuthor = (req, res) => {

    var timer = new Date();
    stats.increment('Create Author');
    logger.info("POST request for Author");

    var count =0;
    const resolveMultipleAuthors = (author) => {
        let authorList = req.body.authorNames.split(',');
        count++;
        if(count == authorList.length){
            res.status(200);
            res.json("Added Multiple Authors");
            stats.timing('Post Multiple Authors Time', timer);
        }
    };
    const resolve = (author) => {
        res.status(200);
        res.json(author);
        stats.timing('Post Author Time', timer);
    };

    if(req.body.authorNames && req.body.authorNames.includes(',')) {
        let authorList = req.body.authorNames.split(',')
        authorList.forEach(author => {
            const authorReq = {
                BookId : req.body.bookId,
                author_name: author
            };
            authorService.save(authorReq, res)
            .then(resolveMultipleAuthors)
            .catch(renderErrorResponse(res, 500, "Failed to create Author"));
        });
    }
    else {
        const authorReq = {
            BookId : req.body.bookId,
            author_name: req.body.authorNames
        };
        authorService.save(authorReq, res)
        .then(resolve)
        .catch(renderErrorResponse(res, 500, "Error occured while adding the Author"));

    }
    
};

// Update the Author by deleting current authors associated with book and adding new authors
exports.updateAuthor = (req, res) => {

    var timer = new Date();
    stats.increment('Update Author');
    logger.info("PUT request for author");

    const resolveOnDeletion = () => {
        this.createAuthor(req,res)
        stats.timing('Update Author Time', timer);
    };

    authorService.delete(req, res)
        .then(resolveOnDeletion)
        .catch(renderErrorResponse(res, 500, "Error occured while deleting the Authors before updating"));

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