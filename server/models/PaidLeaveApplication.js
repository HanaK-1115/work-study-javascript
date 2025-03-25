const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PaidLeaveApplication = sequelize.define('PaidLeaveApplication', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  submissionDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  approvalStatus: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2, // 承認待ち
  },
  lastUpdatedByUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  tableName: 'paid_leave_applications',
  timestamps: false,
});

module.exports = PaidLeaveApplication;
