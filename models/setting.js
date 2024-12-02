'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class setting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  setting.init({
    setting_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    from_day: DataTypes.STRING,
    to_day: DataTypes.STRING,
    esi_percentage: DataTypes.STRING,
    pf_percentage: DataTypes.STRING,
    permission_deduction: DataTypes.STRING,
    leave_deduction: DataTypes.STRING,
    image_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'setting',
  });
  return setting;
};