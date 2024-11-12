"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');
const { generateSerialNumber } = require('../utils/utility');

async function getStaffAdvance(query, auth) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.staffAdvanceId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ts.staff_advance_id = ${query.staffAdvanceId}`;
      }
      if (query.staffId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` s.staff_id = ${query.staffId}`;
      }
    }

    if (auth.branch_id && auth.role_id === 3) {
      iql += count >= 1 ? ` AND` : `WHERE`;
      iql += ` s.branch_id = ${auth.branch_id}`;
    }

    const result = await sequelize.query(`SELECT ts.staff_advance_id "staffAdvanceId",
      ts.staff_id "staffId",CONCAT(s.first_name,' ',s.last_name) as staffName,
      ts.apply_date "applyDate", ts.approved_date "approvedDate",
      ts.amount "amount", ts.reason "reason", ts.paid_amount "paidAmount", ts.balance_amount "balanceAmount", ts.advance_status "advanceStatus",
      ts.approved_by "	approvedById",CONCAT(s.first_name,' ',s.last_name) as 	approvedBy,
      ts.createdAt
      FROM staff_advances ts
      left join staffs s on s.staff_id = ts.staff_id 
      left join staffs s2 on s2.staff_id = ts.approved_by ${iql}`, {
      type: QueryTypes.SELECT,
      raw: true,
      nest: false
    });
    return result;
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function createStaffAdvance(postData) {
  try {       
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const staffAdvanceResult = await sequelize.models.staff_advance.create(excuteMethod);
    console.log(staffAdvanceResult);
    const req = {
      staffAdvanceId: staffAdvanceResult.staff_advance_id
    }
    return await getStaffAdvance(req);
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updateStaffAdvance(staffAdvanceId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const staffAdvanceResult = await sequelize.models.staff_advances.update(excuteMethod, { where: { staff_advance_staff_id: staffAdvanceId } });
    const req = {
      staffAdvanceId: staffAdvanceId
    }
    return await getStaffAdvance(req);
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

module.exports = {
  getStaffAdvance,
  updateStaffAdvance,
  createStaffAdvance
};