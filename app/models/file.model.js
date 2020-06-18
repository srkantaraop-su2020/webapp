module.exports = (sequelize, Sequelize) => {
    let File = sequelize.define("File", {
        file_name: {
            type: Sequelize.STRING
        },
        owner_id: {
            type: Sequelize.STRING
        },
        book_id: {
            type: Sequelize.STRING
        }
    });
  
    return File;
};