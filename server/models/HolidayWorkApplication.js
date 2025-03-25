const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const HolidayWorkApplication = sequelize.define('HolidayWorkApplication', {
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
  workDate: {
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
    defaultValue: 2,
  },
  compensatoryDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  lastUpdatedByUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  tableName: 'holiday_work_applications',
  timestamps: false, // createdAt, updatedAt を無効化
});

module.exports = HolidayWorkApplication;
