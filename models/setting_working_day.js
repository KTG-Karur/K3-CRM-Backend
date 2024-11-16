'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class setting_working_day extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  setting_working_day.init({
    setting_working_day_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    work_day: DataTypes.STRING,
    logo_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'setting_working_day',
  });
  return setting_working_day;
};