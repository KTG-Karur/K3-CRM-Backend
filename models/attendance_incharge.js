'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class attendance_incharge extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  attendance_incharge.init({
    attendance_incharge_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    department_id: DataTypes.INTEGER,
    staff_id: DataTypes.INTEGER,
    branch_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'attendance_incharge',
  });
  return attendance_incharge;
};