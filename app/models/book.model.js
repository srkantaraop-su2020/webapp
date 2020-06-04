module.exports = (sequelize, Sequelize) => {
    let Book = sequelize.define("Book", {
        isbn: {
            type: Sequelize.STRING
        },
        title: {
            type: Sequelize.STRING
        },
        publication_date: {
            type: Sequelize.DATE
        },
        quantity: {
            type: Sequelize.INTEGER
        },
        price: {
            type: Sequelize.DOUBLE
        },
        seller_id: {
            type: Sequelize.INTEGER
        }
    });
  
    return Book;
};