"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');

async function getDepartment(query) {
  try {
    let iql = {};
    if (query && Object.keys(query).length) {
      if (query.departmentId) {
        iql.department_id = query.departmentId;
      }
      if (query.isActive) {
        iql.is_active = query.isActive;
      }
    }
    const result = await sequelize.models.department.findAll({
      attributes: [['department_id', 'departmentId'], ['department_name', 'departmentName'],
      ['is_active', 'isActive'], ['createdAt', 'createdAt']],
      where: iql,
      order: [['department_id', 'DESC']],
      raw: true,
      nest: false
    });
    return result;
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function createDepartment(postData) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const departmentResult = await sequelize.models.department.create(excuteMethod);
    const req = {
      departmentId: departmentResult.department_id
    }
    return await getDepartment(req);
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updateDepartment(departmentId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const departmentResult = await sequelize.models.department.update(excuteMethod, { where: { department_id: departmentId } });
    const req = {
      departmentId: departmentId
    }
    return await getDepartment(req);
} catch (error) {
  throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
}
}

async function deleteDepartment(departmentId) {
  try {
    const departmentResult = await sequelize.models.department.destroy({ where: { department_id: departmentId } });
    if(departmentResult == 1){
      return "Deleted Successfully...!";
    }else{
      return "Data Not Founded...!";
    }
} catch (error) {
  throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
}
}

module.exports = {
  getDepartment,
  updateDepartment,
  createDepartment,
  deleteDepartment
};