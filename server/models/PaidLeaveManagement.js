const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const PaidLeaveManagement = sequelize.define('PaidLeaveManagement', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  joinDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  remainingLeaveDays: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'paid_leaves_management',
  timestamps: false
});

User.hasOne(PaidLeaveManagement, { foreignKey: 'userId', as: 'paidLeaveManagement' });
PaidLeaveManagement.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = PaidLeaveManagement;
