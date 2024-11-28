'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_rights extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user_rights.init({
    user_rights_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    staff_id: DataTypes.INTEGER,
    user_permission: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user_rights',
  });
  return user_rights;
};