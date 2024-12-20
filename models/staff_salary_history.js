'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class staff_salary_history extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  staff_salary_history.init({
    staff_salary_history_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    staff_id: DataTypes.INTEGER,
    salary_date: DataTypes.DATE,
    salary_amount: DataTypes.STRING,
    deduction_amount: DataTypes.STRING,
    esi_amount: DataTypes.STRING,
    pf_amount: DataTypes.STRING,
    incentive: DataTypes.STRING,
    total_salary_amount: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'staff_salary_history',
  });
  return staff_salary_history;
};