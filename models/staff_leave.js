"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class staff_leave extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  staff_leave.init(
    {
      staff_leave_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      staff_id: DataTypes.INTEGER,
      leave_type_id: DataTypes.INTEGER,
      day_count: DataTypes.INTEGER,
      reason: DataTypes.STRING,
      cancel_reason: DataTypes.STRING,
      from_date: DataTypes.DATE,
      to_date: DataTypes.DATE,
      approved_by: DataTypes.INTEGER,
      branch_id: DataTypes.INTEGER,
      status_id: {
        type: DataTypes.INTEGER,
        defaultValue: 28,
      },
    },
    {
      sequelize,
      modelName: "staff_leave",
    }
  );
  return staff_leave;
};
