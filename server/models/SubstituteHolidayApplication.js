const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SubstituteHolidayApplication = sequelize.define('SubstituteHolidayApplication', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  holidayWorkApplicationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'holiday_work_applications',
      key: 'id',
    },
  },
  workDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  substituteDate: {
    type: DataTypes.DATE,
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
    references: {
      model: 'users',
      key: 'id',
    },
  }
}, {
  tableName: 'substitute_holiday_applications',
  timestamps: false,
});

module.exports = SubstituteHolidayApplication;
