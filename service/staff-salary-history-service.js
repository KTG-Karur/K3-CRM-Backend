"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const moment = require('moment');
const { QueryTypes } = require('sequelize');
const { generateSerialNumber } = require('../utils/utility');

async function getStaffSalaryHistory(query) {
  try {
    let iql = "";
    let count = 0;

    const year = moment(query.salaryDate).format('YYYY');
    const month = moment(query.salaryDate).format('MM');
    if (query && Object.keys(query).length) {
      iql += "WHERE";
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
        iql += ` (ts.salary_date LIKE '${moment(query.salaryDate).format('YYYY-MM')}%' OR ( ts.salary_date is null )) AND s.date_of_joining <= LAST_DAY(DATE_SUB('${moment(query.salaryDate).format('YYYY-MM-DD')}', INTERVAL -1 MONTH))`;
      }
      if (query.branchId || query.branchId == '') {
        if (query.branchId !== '') {
          iql += count >= 1 ? ` AND` : ``;
          count++;
          iql += ` s.branch_id = ${query.branchId}`;
        }
      }
      if (query.departmentId || query.departmentId == '') {
        if (query.departmentId !== '') {
          iql += count >= 1 ? ` AND` : ``;
          count++;
          iql += ` s.department_id = ${query.departmentId}`;
        }
      }
    }

    const result = await sequelize.query(`SELECT
    ts.staff_salary_history_id AS staffSalaryHistoryId,

    s.staff_id AS staffId,
    
    s.staff_code AS staffCode,

    CONCAT(s.first_name, ' ', s.last_name) AS staffName,

    ts.monthly_amount AS monthlyAmount,

    ts.incentive_amount AS incentiveAmount,

    ts.bonus_amount AS bonusAmount,
    
    ts.deduction_amount AS deductionAmount,
    
    ts.total_salary_amount AS totalSalaryAmount,

    ts.salary_date AS salaryDate,

    ssa.monthly_amount AS monthlyAmount,

    (select COALESCE(SUM(amount), 0) as advanceAmt from staff_advances where staff_id = staffId ) AS advanceAmount,

    b.branch_name as branchName,

    b.branch_id as branchId,

    d.department_name as departmentName,

    d.department_id as departmentId,

    ssa.esi_amount AS esiAmount,
    ssa.pf_amount AS pfAmount,

    (select COALESCE(SUM(day_count),0) as day_count from staff_leaves  where staff_id=staffId and leave_type_id='27' and (YEAR(from_date) = '${year}' AND MONTH(from_date) = '${month}') or ( from_date is null ) ) AS sickLeaveCount,

    (select COALESCE(SUM(day_count),0) as day_count from staff_leaves  where staff_id=staffId and leave_type_id='26' and  (YEAR(from_date) = '${year}' AND MONTH(from_date) = '${month}') or ( from_date is null ) ) AS casualLeaveCount,

     (
        (
            SELECT COALESCE(SUM(day_count), 0) 
            FROM staff_leaves  
            WHERE staff_id = staffId 
              AND leave_type_id = '27' 
              AND (
                  (YEAR(from_date) = '${year}' AND MONTH(from_date) = '${month}') 
                  OR (from_date IS NULL)
              )
        ) +
        (
            SELECT COALESCE(SUM(day_count), 0) 
            FROM staff_leaves  
            WHERE staff_id = staffId 
              AND leave_type_id = '26' 
              AND (
                  (YEAR(from_date) = '${year}' AND MONTH(from_date) = '${month}') 
                  OR (from_date IS NULL)
              )
        )
    ) AS totalLeave,

    (select COALESCE(SUM(adv_his.paid_amount),0) as paidAmount from advance_payment_histories as adv_his left join staff_advances as st_adv on 
    st_adv.staff_advance_id = adv_his.staff_advance_id where st_adv.staff_id = staffId ) AS paidAdvanceAmount,

    ts.createdAt,DAY(LAST_DAY('${moment(query.salaryDate).format('YYYY-MM-DD')}')) AS workingDays

FROM
    staffs s
LEFT JOIN
    staff_salary_histories ts ON ts.staff_id = s.staff_id or ( ts.staff_id is null ) 
LEFT JOIN
        branches b ON b.branch_id = s.branch_id
LEFT JOIN
        department d ON d.department_id  = s.department_id 
LEFT JOIN
    staff_attendances sa ON sa.staff_id = s.staff_id or ( sa.staff_id is null ) 
LEFT JOIN
    staff_salary_allocateds ssa ON ssa.staff_id = s.staff_id or ( ssa.staff_id is null ) 
LEFT JOIN
    staff_advances saa ON saa.staff_id = s.staff_id or ( saa.staff_id is null ) 
    ${iql}  GROUP BY 
    s.staff_id, 
    YEAR(ts.salary_date), 
    MONTH(ts.salary_date)
ORDER BY 
    s.staff_id`, {
      type: QueryTypes.SELECT,
      raw: true,
      nest: false
    });
    return result;
  } catch (error) {
    console.log(error)
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function getStaffSalaryHistoryDetails(query) {
  try {
    let iql = "";
    let count = 0;

    const year = moment(query.salaryDate).format('YYYY');
    const month = moment(query.salaryDate).format('MM');
    if (query && Object.keys(query).length) {
      iql += "WHERE";
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
        iql += ` (ts.salary_date LIKE '${moment(query.salaryDate).format('YYYY-MM')}%' OR ( ts.salary_date is null )) AND s.date_of_joining <= LAST_DAY(DATE_SUB('${moment(query.salaryDate).format('YYYY-MM-DD')}', INTERVAL -1 MONTH))`;
      }
      if (query.branchId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` s.branch_id = ${query.branchId}`;
      }
      if (query.departmentId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` s.department_id = ${query.departmentId}`;
      }
    }

    const result = await sequelize.query(`SELECT
        ts.staff_salary_history_id AS staffSalaryHistoryId,
        s.staff_id AS staffId,
        s.staff_code AS staffCode,
        CONCAT(s.first_name, ' ', s.last_name) AS staffName,
        ts.monthly_amount AS monthlyAmount,
        ts.salary_date AS salaryDate,
        ts.deduction_amount AS deductionAmount,
        ts.esi_amount AS esiAmount,
        b.branch_name as branchName,
        b.branch_id as branchId,
        d.department_name as departmentName,
        d.department_id as departmentId,
        ts.incentive_amount AS incentiveAmount,
        ts.bonus_amount AS bonusAmount,
        ts.deduction_amount AS deductionAmount,
        ts.total_salary_amount AS totalSalaryAmount,
        ssa.annual_amount AS annualAmount,
        ssa.monthly_amount AS monthlyAmount,
        ssa.esi_amount AS esiAmount,
        ssa.pf_amount AS pfAmount,
        (select COALESCE(SUM(day_count),0) as day_count from staff_leaves  where staff_id=staffId and leave_type_id='27' and (YEAR(from_date) = '${year}' AND MONTH(from_date) = '${month}') or ( from_date is null ) ) AS sickLeaveCount,
        (select COALESCE(SUM(day_count),0) as day_count from staff_leaves  where staff_id=staffId and leave_type_id='26' and  (YEAR(from_date) = '${year}' AND MONTH(from_date) = '${month}') or ( from_date is null ) ) AS casualLeaveCount,
        (select COALESCE(SUM(amount), 0) as advanceAmt from staff_advances where staff_id = staffId ) AS advanceAmount,
        (select COALESCE(SUM(adv_his.paid_amount),0) as paidAmount from advance_payment_histories as adv_his left join staff_advances as st_adv on 
        st_adv.staff_advance_id = adv_his.staff_advance_id where st_adv.staff_id = staffId ) AS paidAdvanceAmount,
        ts.createdAt,DAY(LAST_DAY('${moment(query.salaryDate).format('YYYY-MM-DD')}')) AS workingDays
    FROM
        staffs s
    LEFT JOIN
        staff_salary_histories ts ON ts.staff_id = s.staff_id or ( ts.staff_id is null ) 
    LEFT JOIN
        branches b ON b.branch_id = s.branch_id
    LEFT JOIN
        department d ON d.department_id  = s.department_id 
    LEFT JOIN
        staff_attendances sa ON sa.staff_id = s.staff_id or ( sa.staff_id is null ) 
    LEFT JOIN
        staff_salary_allocateds ssa ON ssa.staff_id = s.staff_id or ( ssa.staff_id is null ) 
    LEFT JOIN
        staff_advances saa ON saa.staff_id = s.staff_id or ( saa.staff_id is null ) 
        ${iql}  GROUP BY 
        s.staff_id, 
        YEAR(ts.salary_date), 
        MONTH(ts.salary_date)
    ORDER BY 
        s.staff_id`, {
      type: QueryTypes.SELECT,
      raw: true,
      nest: false
    });

    return result;
  } catch (error) {
    console.log(error)
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function createStaffSalaryHistory(postData) {
  try {

    let excuteMethod = '';
    let staffSalaryHistoryResult = [];

    if (postData.staffSalary.length == 1) {
      excuteMethod = _.mapKeys(postData.staffSalary[0], (value, key) => _.snakeCase(key))
      staffSalaryHistoryResult = await sequelize.models.staff_salary_history.create(excuteMethod);
      const req = {
        salaryDate: staffSalaryHistoryResult?.salary_date,
        staffId: staffSalaryHistoryResult?.staff_id
      }
      return await getStaffSalaryHistoryDetails(req);

    } else {
      // Bulk Submit
      excuteMethod = _.map(postData.staffSalary, (item) =>
        _.mapKeys(item, (value, key) => _.snakeCase(key))
      );
      for (const excuteData of excuteMethod) {
        if (excuteData?.staff_salary_history_id) {
          await sequelize.models.staff_salary_history.update(excuteData, {
            where: { staff_salary_history_id: excuteData.staff_salary_history_id },
          });
        } else {
          await sequelize.models.staff_salary_history.create(excuteData);
        }
      }
      const req = {
        salaryDate: excuteMethod[0]?.salary_date,
      }

      return await getStaffSalaryHistory(req);
    }
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updateStaffSalaryHistory(staffSalaryHistoryId, putData) {
  try {
    if (putData.staffSalary.length == 1) {
      const excuteMethod = _.mapKeys(putData.staffSalary[0], (value, key) => _.snakeCase(key))
      const staffSalaryHistoryResult = await sequelize.models.staff_salary_history.update(excuteMethod, { where: { staff_salary_history_id: staffSalaryHistoryId } });
      const req = {
        salaryDate: staffSalaryHistoryResult?.salary_date,
        staffSalaryHistoryId: staffSalaryHistoryId
      }
      return await getStaffSalaryHistoryDetails(req);
    } else {
      // Bulk Update
      console.log("bulk update called");
    }
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function deleteStaffSalaryHistory(salaryDate) {
  try {
    console.log("deleteStaffSalaryHistory salaryDate")
    console.log(salaryDate)
    const staffSalaryHistoryResult = await sequelize.models.staff_salary_history.destroy({ where: { salary_date: salaryDate } });
    console.log("deleteStaffSalaryHistory staffSalaryHistoryResult")
    console.log(staffSalaryHistoryResult)
    if (staffSalaryHistoryResult >= 1) {
      return true;
    } else {
      return false;
    }

  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

module.exports = {
  getStaffSalaryHistory,
  getStaffSalaryHistoryDetails,
  updateStaffSalaryHistory,
  createStaffSalaryHistory
};