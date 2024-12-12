"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');

async function getRolePermission(query) {
console.log(query)
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.rolePermissionId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` rp.role_permission_id = ${query.rolePermissionId}`;
      }
      if (query.roleId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` rp.role_id = ${query.roleId}`;
      }
    }
    console.log(iql)
    const result = await sequelize.query(`SELECT rp.role_permission_id "rolePermissionId", rp.access_ids "accessIds",
      rp.role_id "roleId",r.role_name "roleName" 
      FROM role_permission rp
      left join role r on r.role_id = rp.role_id  ${iql}`, {
      type: QueryTypes.SELECT,
      raw: true,
      nest: false
    });
    return result;
  } catch (error) {

    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function createRolePermission(postData) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const rolePermissionResult = await sequelize.models.role_permission.create(excuteMethod);
    return true;
  } catch (error) {
    throw new Error(error?.message ? error.message : error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updateRolePermission(rolePermissionId, putData) {
  try {
    const selectedId = putData.rolePermissionId
    delete putData.rolePermissionId
    console.log(putData)
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key));
    const rolePermissionResult = await sequelize.models.role_permission.update(excuteMethod, { where: { role_permission_id: selectedId } });
    return true;
  } catch (error) {
    console.log(error)
    throw new Error(error?.message ? error.message : error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

module.exports = {
  getRolePermission,
  updateRolePermission,
  createRolePermission
};