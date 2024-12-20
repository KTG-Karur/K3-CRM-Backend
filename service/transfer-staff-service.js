"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');
const { generateSerialNumber } = require('../utils/utility');

async function getTransferStaff(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.transferStaffId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ts.transfer_staff_id = ${query.transferStaffId}`;
      }
      if (query.staffId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` s.staff_id = ${query.staffId}`;
      }
    }
    const result = await sequelize.query(`SELECT ts.transfer_staff_id "transferStaffId",
      ts.staff_id "staffId",CONCAT(s.first_name,' ',s.last_name) as staffName,
      ts.transfer_code "transferCode", ts.transfer_date "transferDate",
      ts.transfer_from "transferFrom", ts.transfer_to "transferTo",
      ts.transfered_by "transferedById",CONCAT(s.first_name,' ',s.last_name) as transferedBy,
      ts.createdAt
      FROM transfer_staffs ts
      left join staffs s on s.staff_id = ts.staff_id 
      left join staffs s2 on s2.staff_id = ts.transfered_by ${iql}`, {
      type: QueryTypes.SELECT,
      raw: true,
      nest: false
    });
    return result;
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function createTransferStaff(postData) {
  try {

    const countResult = await sequelize.query(`SELECT ts.transfer_code "transferCode"
      FROM transfer_staffs ts ORDER BY ts.transfer_staff_id DESC LIMIT 1`, {
      type: QueryTypes.SELECT,
      raw: true,
      nest: false
    });

    const applicantCodeFormat = `K3-KRR-`
    const count = countResult.length > 0 ? parseInt(countResult[0].transferCode.split("-").pop()) : `00000`
    postData.transferCode = await generateSerialNumber(applicantCodeFormat, count)

    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const transferStaffResult = await sequelize.models.transfer_staff.create(excuteMethod);
    const req = {
      transferStaffId: transferStaffResult.transfer_staff_id
    }
    return await getTransferStaff(req);
  } catch (error) {
    console.log(error)
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updateTransferStaff(transferStaffId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const transferStaffResult = await sequelize.models.transfer_staff.update(excuteMethod, { where: { transfer_staff_id: transferStaffId } });
    const req = {
      transferStaffId: transferStaffId
    }
    return await getTransferStaff(req);
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

module.exports = {
  getTransferStaff,
  updateTransferStaff,
  createTransferStaff
};