module.exports = (sequelize, Sequelize) => {
    let Cart = sequelize.define("Cart", {
        book_id: {
            type: Sequelize.INTEGER
        },
        book_name: {
            type: Sequelize.STRING
        },
        buyer_id: {
            type: Sequelize.INTEGER
        },
        quantity: {
            type: Sequelize.INTEGER
        },
        price: {
            type: Sequelize.DOUBLE
        }
    });
  
    return Cart;
};