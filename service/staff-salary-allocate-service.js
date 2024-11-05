"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');

async function getStaffSalaryAllocate(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.staffSalaryAllocateId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` staff_salary_allocated_id = ${query.staffSalaryAllocateId}`;
      }
    }
    const result = await sequelize.query(`SELECT staff_salary_allocated_id "staffSalaryAllocatedId",
        staff_id "staffId", annual_amount "annualAmount", monthly_amount "monthlyAmount",
        esi_amount "esiAmount", pf_amount "pfAmount", createdAt
        FROM staff_salary_allocateds ${iql}`, {
        type: QueryTypes.SELECT,
        raw: true,
        nest: false
      });
    return result;
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function createStaffSalaryAllocate(postData) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const staffSalaryAllocateResult = await sequelize.models.staff_salary_allocated.create(excuteMethod);
    const req = {
      staffSalaryAllocateId: staffSalaryAllocateResult.staff_salary_allocated_id
    }
    return await getStaffSalaryAllocate(req);
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updateStaffSalaryAllocate(staffSalaryAllocateId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const staffSalaryAllocateResult = await sequelize.models.staff_salary_allocated.update(excuteMethod, { where: { staff_salary_allocated_id: staffSalaryAllocateId } });
    const req = {
      staffSalaryAllocateId: staffSalaryAllocateId
    }
    return await getStaffSalaryAllocate(req);
} catch (error) {
  throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
}
}

module.exports = {
  getStaffSalaryAllocate,
  updateStaffSalaryAllocate,
  createStaffSalaryAllocate
};