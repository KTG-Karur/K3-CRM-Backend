"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');
const { generateSerialNumber } = require('../utils/utility');

async function getStaffSalaryHistory(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.staffSalaryHistoryId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ts.staff_salary_history_id = ${query.staffSalaryHistoryId}`;
      }
      if (query.staffId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` s.staff_id = ${query.staffId}`;
      }
    }
    const result = await sequelize.query(`SELECT ts.staff_salary_history_id "staffSalaryHistoryId",
      ts.staff_id "staffId",CONCAT(s.first_name,' ',s.last_name) as staffName,
      ts.salary_amount "salaryAmount", ts.salary_date "salaryDate",
      ts.deduction_amount "deductionAmount", ts.esi_amount "esiAmount",
      ts.pf_amount "pfAmount", ts.incentive "incentive",
      ts.total_salary_amount "totalSalaryAmount",b.branch_name as branchName,
      ts.createdAt
      FROM staff_salary_histories ts
      left join branches b on b.branch_id = ts.branch_id
      left join staffs s on s.staff_id = ts.staff_id32 ${iql}`, {
      type: QueryTypes.SELECT,
      raw: true,
      nest: false
    });
    return result;
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function createStaffSalaryHistory(postData) {
  try {

    const countResult = await sequelize.query(`SELECT ts.transfer_code "transferCode"
      FROM staff_salary_history ts ORDER BY ts.staff_salary_history_id DESC LIMIT 1`, {
      type: QueryTypes.SELECT,
      raw: true,
      nest: false
    });    

    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const staffSalaryHistoryResult = await sequelize.models.staff_salary_history.create(excuteMethod);
    const req = {
      staffSalaryHistoryId: staffSalaryHistoryResult.staff_salary_history_id
    }
    return await getStaffSalaryHistory(req);
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updateStaffSalaryHistory(staffSalaryHistoryId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const staffSalaryHistoryResult = await sequelize.models.staff_salary_history.update(excuteMethod, { where: { staff_salary_history_id: staffSalaryHistoryId } });
    const req = {
      staffSalaryHistoryId: staffSalaryHistoryId
    }
    return await getStaffSalaryHistory(req);
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

module.exports = {
  getStaffSalaryHistory,
  updateStaffSalaryHistory,
  createStaffSalaryHistory
};