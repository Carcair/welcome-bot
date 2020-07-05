/**
 * Load .env
 */
require('dotenv').config();

/**
 * Load SEQUELIZE
 */
const Sequelize = require('sequelize');



/**
 * Load connection obj
 */
const connection = new Sequelize( process.env.DATABASE_NAME,  process.env.DATABASE_USERNAME,  process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_URL,
  dialect: process.env.DATABASE_DIALECT,
  logging : false, 
  define: {
      timestamps: false
    },

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  
  }
});

// checking connection
connection
 .authenticate()
 .then(() => {
  console.info('INFO - Database connected.')
 })
 .catch(err => {
  console.error('ERROR - Unable to connect to the database:', err)
 });


const db = {};

db.Sequelize = Sequelize;
db.connection = connection;

db.msg = require('../models/table_model/table_msg')(connection, Sequelize);
db.sch = require('../models/table_model/table_sch')(connection, Sequelize);
db.trg = require('../models/table_model/table_trg')(connection, Sequelize);

module.exports = db;





/*
 // Load mysql
 
const mysql = require('mysql');


 //Load connection obj
 
const DBConfig = require('../models/assets/DBConfig');

const connection = {
  crConn() {
    // Create connection
    var db = mysql.createConnection(new DBConfig());

    // Connect
    db.connect((err) => {
      if (err) throw err;
      console.log('MySQL connected.');
    });

    return db;
  },
};

module.exports = connection;
*/