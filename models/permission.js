'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  permission.init({
    permission_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    staff_id: DataTypes.INTEGER,
    permission_type_id: DataTypes.INTEGER,
    permission_date: DataTypes.DATE,
    reason: DataTypes.STRING,
    approved_by: DataTypes.INTEGER,
    permission_status_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'permission',
  });
  return permission;
};