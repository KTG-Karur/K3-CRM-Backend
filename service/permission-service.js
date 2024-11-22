"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const { QueryTypes } = require('sequelize');
const _ = require('lodash');

async function getPermission(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.permissionId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ts.permission_id = ${query.permissionId}`;
      }
      if (query.staffId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` s.staff_id = ${query.staffId}`;
      }
    }
    const result = await sequelize.query(`SELECT ts.permission_id "permissionId",ts.permission_type_id "permissionTypeId",
      ts.staff_id "staffId",CONCAT(s.first_name,' ',s.last_name) as staffName,
      ts.branch_id "branchId",
      s.branch_id "staffBranchId",
      ts.permission_date "permissionDate", ts.reason "reason", sl.status_name "permissionTypeName",
      ts.createdAt,ts.status_id "statusId"
      FROM  permissions ts
      left join staffs s on s.staff_id = ts.staff_id
      left join status_lists sl on sl.status_list_id = ts.permission_type_id  ${iql}`, {
      type: QueryTypes.SELECT,
      raw: true,
      nest: false
    });
    return result;
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function createPermission(postData) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const existingPermission = await sequelize.models.permission.findOne({
      where: {
        staff_id: excuteMethod.staff_id,
        permission_date: sequelize.where(
          sequelize.fn('DATE', sequelize.col('permission_date')),
          excuteMethod.permission_date
        )
      }
    });
    if (existingPermission) {
      throw new Error(messages.DUPLICATE_ENTRY);
    }

    const permissionResult = await sequelize.models.permission.create(excuteMethod);
    const req = {
      permissionId: permissionResult.permission_id
    }
    return await getPermission(req);
  } catch (error) {
    throw new Error(error?.message ? error.message : error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updatePermission(permissionId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const duplicatePermission = await sequelize.models.permission.findOne({
      where: sequelize.literal(`staff_id = '${excuteMethod.staff_id}' AND permission_date = '${excuteMethod.permission_date}' AND permission_id != ${permissionId}`)
    });
    if (duplicatePermission) {
      throw new Error(messages.DUPLICATE_ENTRY);
    }

    const permissionResult = await sequelize.models.permission.update(excuteMethod, { where: { permission_id: permissionId } });
    const req = {
      permissionId: permissionId
    }
    return await getPermission(req);
  } catch (error) {
    throw new Error(error?.message ? error.message : error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

module.exports = {
  getPermission,
  updatePermission,
  createPermission,
};