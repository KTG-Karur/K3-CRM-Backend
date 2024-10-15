"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');

async function getDesignation(query) {
  try {
    let iql = {};
    if (query && Object.keys(query).length) {
      if (query.designationId) {
        iql.designation_id = query.designationId;
      }
      if (query.isActive) {
        iql.is_active = query.isActive;
      }
    }
    const result = await sequelize.models.designation.findAll({
      attributes: [['designation_id', 'designationId'], ['designation_name', 'designationName'],
      ['is_active', 'isActive'], ['createdAt', 'createdAt']],
      where: iql,
      order: [['designation_id', 'DESC']],
      raw: true,
      nest: false
    });
    return result;
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function createDesignation(postData) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const designationResult = await sequelize.models.designation.create(excuteMethod);
    const req = {
      designationId: designationResult.designation_id
    }
    return await getDesignation(req);
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updateDesignation(designationId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const designationResult = await sequelize.models.designation.update(excuteMethod, { where: { designation_id: designationId } });
    const req = {
      designationId: designationId
    }
    return await getDesignation(req);
} catch (error) {
  throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
}
}

async function deleteDesignation(designationId) {
  try {
    const designationResult = await sequelize.models.designation.destroy({ where: { designation_id: designationId } });
    if(designationResult == 1){
      return "Deleted Successfully...!";
    }else{
      return "Data Not Founded...!";
    }
} catch (error) {
  throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
}
}

module.exports = {
  getDesignation,
  updateDesignation,
  createDesignation,
  deleteDesignation
};