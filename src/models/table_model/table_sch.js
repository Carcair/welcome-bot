module.exports = (connection, Sequelize) => {
    const sch = connection.define('schedule', {
      message: {
        type: Sequelize.STRING(255)
      },
      run_date: {
        type: Sequelize.STRING(255)
      },
      repeat_range: {
        type: Sequelize.STRING(255)
      }
    });
  
    return sch;
  };
  