module.exports = (sequelize, Sequelize) => {
    Author = sequelize.define("Author", {
        author_name: {
            type: Sequelize.STRING
        }
    });
  
    return Author;
};