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
      if (query.salaryDate) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ts.salary_date = ${query.salaryDate}`;
      }
    }
    const result = await sequelize.query(`SELECT ts.staff_salary_history_id "staffSalaryHistoryId",
      s.staff_id "staffId",CONCAT(s.first_name,' ',s.last_name) as staffName,
      ts.salary_amount "salaryAmount", ts.salary_date "salaryDate",
      ts.deduction_amount "deductionAmount", ts.esi_amount "esiAmount",
      ts.pf_amount "pfAmount", ts.incentive "incentive",
      ts.total_salary_amount "totalSalaryAmount",b.branch_name as branchName,ssa.annual_amount as annualAmount,ssa.monthly_amount as monthlyAmount,ssa.esi_amount as esiAmount,ssa.pf_amount as pfAmount,
      ts.createdAt
      FROM staffs s
      left join branches b on b.branch_id = s.branch_id
      left join staff_leaves sl on sl.staff_id = s.staff_id
      left join staff_attendances sa on sa.staff_id = s.staff_id
      left join staff_salary_allocateds ssa on ssa.staff_id = s.staff_id
      left join staff_salary_histories ts on ts.staff_id = s.staff_id  ${iql} group by s.staff_id`, {
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

    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const staffSalaryHistoryResult = await sequelize.models.staff_salary_history.create(excuteMethod);
    const req = {
      staffSalaryHistoryId: staffSalaryHistoryResult.staff_salary_history_id
    }
    return await getStaffSalaryHistory(req);
  } catch (error) {
    console.log(error)
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