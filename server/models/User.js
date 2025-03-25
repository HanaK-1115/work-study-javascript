const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const PaidLeaveApplication = require('./PaidLeaveApplication'); // PaidLeaveApplicationモデルをインポート

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  department: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: true // createdAtとupdatedAtを自動管理
});

User.hasMany(PaidLeaveApplication, { foreignKey: 'userId' });
PaidLeaveApplication.belongsTo(User, { foreignKey: 'userId' });

module.exports = User;
