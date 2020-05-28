module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("User", {
        user_name: {
            type: Sequelize.STRING
        },
        first_name: {
            type: Sequelize.STRING
        },
        last_name: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        }
    });
  
    return User;
  };