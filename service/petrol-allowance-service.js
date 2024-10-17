"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');

async function getPetrolAllowance(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.petrolAllowanceId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` pa.petrol_allowance_id = ${query.petrolAllowanceId}`;
      }
      if (query.branchId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` s.branch_id = ${query.branchId}`;
      }
      if (query.staffId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` pa.staff_id = ${query.staffId}`;
      }
      if (query.dateFilter) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` DATE(pa.allowance_date) = '${query.dateFilter}'`;
      }
      if (query.isActive) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` pa.is_active = ${query.isActive}`;
      }
    }
    console.log(iql)
    const result = await sequelize.query(`SELECT pa.petrol_allowance_id "petrolAllowanceId", pa.staff_id "staffId",CONCAT(s.first_name,' ',s.last_name) as staffName,
        pa.allowance_date "allowanceDate", pa.from_place "fromPlace", pa.to_place "toPlace",
        pa.activity_id "activityId",pa.is_active "isActive",
        GROUP_CONCAT(a.activity_name SEPARATOR ' & ') AS activityName,
        pa.total_km "totalKm", pa.amount, pa.bill_no "billNo",
        pa.bill_image_name "billImageName", pa.createdAt
        FROM petrol_allowances pa
        LEFT join staffs s on s.staff_id = pa.staff_id 
        LEFT join branches b on b.branch_id = s.branch_id 
        LEFT join activities a ON FIND_IN_SET(a.activity_id, pa.activity_id) ${iql}
        GROUP BY pa.petrol_allowance_id`, {
        type: QueryTypes.SELECT,
        raw: true,
        nest: false
      });
    return result;
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function createPetrolAllowance(postData) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const petrolAllowanceResult = await sequelize.models.petrol_allowance.create(excuteMethod);
    const req = {
      petrolAllowanceId: petrolAllowanceResult.petrol_allowance_id
    }
    return await getPetrolAllowance(req);
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updatePetrolAllowance(petrolAllowanceId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const petrolAllowanceResult = await sequelize.models.petrol_allowance.update(excuteMethod, { where: { petrol_allowance_id: petrolAllowanceId } });
    const req = {
      petrolAllowanceId: petrolAllowanceId
    }
    return await getPetrolAllowance(req);
} catch (error) {
  throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
}
}

module.exports = {
  getPetrolAllowance,
  updatePetrolAllowance,
  createPetrolAllowance
};