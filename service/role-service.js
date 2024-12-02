"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { createRolePermission } = require('./role-permission-service');

async function getRole(query) {
  try {
    let iql = {};
    if (query && Object.keys(query).length) {
      if (query.roleId) {
        iql.role_id = query.roleId;
      }
      if (query.isActive) {
        iql.is_active = query.isActive;
      }
    }
    const result = await sequelize.models.role.findAll({
      attributes: [['role_id', 'roleId'], ['role_name', 'roleName'],
      ['is_active', 'isActive'], ['createdAt', 'createdAt']],
      where: iql,
      raw: true,
      nest: false
    });
    return result;
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function createRole(postData) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const roleResult = await sequelize.models.role.create(excuteMethod);
    const req = {
      roleId: roleResult.role_id,
      accessIds : postData.accessIds
    }
    const rolePermission = createRolePermission(req)
    return await getRole(req);
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updateRole(roleId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const roleResult = await sequelize.models.role.update(excuteMethod, { where: { role_id: roleId } });
    const req = {
      roleId: roleId
    }
    return await getRole(req);
} catch (error) {
  throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
}
}

async function deleteRole(roleId) {
  try {
    const roleResult = await sequelize.models.role.destroy({ where: { role_id: roleId } });
    if(roleResult == 1){
      return "Deleted Successfully...!";
    }else{
      return "Data Not Founded...!";
    }
} catch (error) {
  throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
}
}

module.exports = {
  getRole,
  updateRole,
  createRole,
  deleteRole
};