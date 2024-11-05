'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class setting_benefit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  setting_benefit.init({
    setting_benefit_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    benefit_percentage: DataTypes.STRING,
    benefit_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'setting_benefit',
  });
  return setting_benefit;
};