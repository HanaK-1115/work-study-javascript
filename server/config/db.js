const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('tds_db', 'root', 'root', {
  host: 'localhost',
  dialect: 'mariadb',
  timezone: '+09:00'
});

module.exports = sequelize;
