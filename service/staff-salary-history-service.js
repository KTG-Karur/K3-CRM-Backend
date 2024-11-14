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
    const result = await sequelize.query(`SELECT 
    ts.staff_salary_history_id AS staffSalaryHistoryId, 
    s.staff_id AS staffId,
    CONCAT(s.first_name, ' ', s.last_name) AS staffName, 
    ts.salary_amount AS salaryAmount, 
    ts.salary_date AS salaryDate, 
    ts.deduction_amount AS deductionAmount, 
    ts.esi_amount AS esiAmount,
    ts.pf_amount AS pfAmount, 
    ts.incentive AS incentive, 
    ts.total_salary_amount AS totalSalaryAmount,
    b.branch_name AS branchName,
    ssa.annual_amount AS annualAmount, 
    ssa.monthly_amount AS monthlyAmount,
    ssa.esi_amount AS ssaEsiAmount,  
    ssa.pf_amount AS ssaPfAmount,  
    SUM(sl.day_count) AS leaveCount, 
    ts.createdAt
FROM 
    staffs s
LEFT JOIN 
    branches b ON b.branch_id = s.branch_id
LEFT JOIN 
    staff_leaves sl ON sl.staff_id = s.staff_id  
LEFT JOIN 
    staff_attendances sa ON sa.staff_id = s.staff_id
LEFT JOIN 
    staff_salary_allocateds ssa ON ssa.staff_id = s.staff_id
LEFT JOIN 
    staff_salary_histories ts ON ts.staff_id = s.staff_id
   
    ${iql} GROUP BY 
    s.staff_id

ORDER BY 
    s.staff_id `, {
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