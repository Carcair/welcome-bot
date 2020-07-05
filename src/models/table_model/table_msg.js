module.exports = (connection, Sequelize) => {
    const msg = connection.define('message', {
      title: {
        type: Sequelize.STRING(255)
      },
      text: {
        type: Sequelize.TEXT
      },
      cr_date: {
        type: Sequelize.STRING(255)
      }
    });
  
    return msg;
  };
  