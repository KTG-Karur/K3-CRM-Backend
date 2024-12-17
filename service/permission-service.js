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
      ts.staff_id "staffId",CONCAT(sur.status_name,'.',s.first_name,' ',s.last_name) as staffName,
      ts.branch_id "branchId",
      s.branch_id "staffBranchId",
      ts.spoken_date "spokenDate",
      ts.spoken_time "spokenTime",
      ts.spoken_staff_id "spokenStaffId",
      CONCAT(sur_sp.status_name,'.',sp.first_name,' ',sp.last_name) as "spokenStaffName",
      ts.permission_date "permissionDate", ts.reason "reason", sl.status_name "permissionTypeName",
      ts.createdAt,ts.status_id "statusId",
      des.designation_name 'designationName',  dep.department_name 'departmentName',
      des_sp.designation_name 'spokenDesignationName',  dep_sp.department_name 'spokenDepartmentName'
      FROM  permissions ts
      left join staffs s on s.staff_id = ts.staff_id
      left join staffs sp on sp.staff_id = ts.spoken_staff_id
      left join designation des on des.designation_id = s.designation_id
      left join department dep on dep.department_id = s.department_id
      left join designation des_sp on des_sp.designation_id = sp.designation_id
      left join department dep_sp on dep_sp.department_id = sp.department_id
      left join status_lists sur on sur.status_list_id = s.surname_id 
      left join status_lists sur_sp on sur_sp.status_list_id = sp.surname_id 
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
    if (excuteMethod?.permission_date || false && excuteMethod?.staff_id || false) {
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

    if (excuteMethod?.permission_date || false && excuteMethod?.staff_id || false) {
      const duplicatePermission = await sequelize.models.permission.findOne({
        where: sequelize.literal(`staff_id = '${excuteMethod.staff_id}' AND permission_date = '${excuteMethod.permission_date}' AND permission_id != ${permissionId}`)
      });
      if (duplicatePermission) {
        throw new Error(messages.DUPLICATE_ENTRY);
      }
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