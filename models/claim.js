'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class claim extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  claim.init({
    claim_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    claim_type_id: DataTypes.INTEGER,
    requested_by: DataTypes.INTEGER,
    requested_amount: DataTypes.STRING,
    reason: DataTypes.STRING,
    branch_id: DataTypes.INTEGER,
    recepit_image_name: DataTypes.STRING,
    claim_amount: DataTypes.STRING,
    apply_date: DataTypes.DATE,
    claim_status: DataTypes.INTEGER,
    mode_of_payment_id: DataTypes.INTEGER,
    approved_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'claim',
  });
  return claim;
};