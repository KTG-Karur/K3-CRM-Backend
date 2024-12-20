'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class petrol_allowance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  petrol_allowance.init({
    petrol_allowance_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    staff_id: DataTypes.INTEGER,
    allowance_date: DataTypes.DATE,
    from_place: DataTypes.STRING,
    to_place: DataTypes.STRING,
    activity_id: DataTypes.STRING,
    total_km: DataTypes.INTEGER,
    amount: DataTypes.STRING,
    bill_no: DataTypes.STRING,
    bill_image_name: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'petrol_allowance',
  });
  return petrol_allowance;
};