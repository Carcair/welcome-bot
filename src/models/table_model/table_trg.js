module.exports = (connection, Sequelize) => {
    const trg = connection.define('trigger', {
      message: {
        type: Sequelize.STRING(255)
      },
      trigger_word: {
        type: Sequelize.STRING(255)
      },
      channel: {
        type: Sequelize.STRING(255)
      },
      active: {
        type: Sequelize.STRING(255)
      }
    });
  
    return trg;
  };
  