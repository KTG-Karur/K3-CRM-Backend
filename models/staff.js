'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class staff extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  staff.init({
    staff_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    surname_id: DataTypes.INTEGER,
    staff_code: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    age: DataTypes.INTEGER,
    address: DataTypes.STRING,
    caste_type_id: DataTypes.INTEGER,
    contact_no: DataTypes.STRING,
    alternative_contact_no: DataTypes.STRING,
    email_id: DataTypes.STRING,
    profile_image_name: DataTypes.STRING,
    department_id: DataTypes.INTEGER,
    designation_id: DataTypes.INTEGER,
    bank_account_id: DataTypes.INTEGER,
    branch_id: DataTypes.INTEGER,
    date_of_joining: DataTypes.DATE,
    date_of_reliving: DataTypes.DATE,
    dob: DataTypes.DATE,
    role_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    gender_id: DataTypes.INTEGER,
    martial_status_id: DataTypes.INTEGER,
    status_id: {
      type: DataTypes.INTEGER,
      defaultValue: 28,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: 1
    }
  }, {
    sequelize,
    modelName: 'staff',
  });
  return staff;
};