"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');
const moment = require("moment")

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
        iql += ` MONTH(pa.allowance_date) = '${query.dateFilter}'`;
      }
      if (query.isActive) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` pa.is_active = ${query.isActive}`;
      }
    }

    const result = await sequelize.query(`SELECT pa.petrol_allowance_id "petrolAllowanceId", pa.staff_id "staffId",CONCAT(sur.status_name,'.',s.first_name,' ',s.last_name) as staffName,
      des.designation_name 'designationName',  dep.department_name 'departmentName',
        pa.allowance_date "allowanceDate", pa.from_place "fromPlace", pa.to_place "toPlace",
        pa.activity_id "activityId",pa.is_active "isActive",
        pa.branch_id "branchId",
        b.branch_name "branchName",
        s.staff_code "staffCode",
        GROUP_CONCAT(a.activity_name SEPARATOR ' & ') AS activityName,
        pa.total_km "totalKm", pa.total_amount "totalAmount", pa.bill_no "billNo",
        pa.name_of_dealer "nameOfDealer",
       pa.bill_image_name "billImageName", pa.createdAt,pa.date_of_purchase "dateOfPurchase",pa.price_per_litre "pricePerLitre", pa.qty_per_litre "qtyPerLitre"
        FROM petrol_allowances pa
        LEFT join staffs s on s.staff_id = pa.staff_id 
        LEFT join branches b on b.branch_id = s.branch_id  
        LEFT join designation des on des.designation_id = s.designation_id 
        LEFT join department dep on dep.department_id = s.department_id
        LEFT join status_lists sur on sur.status_list_id = s.surname_id
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

async function getPetrolReportAllowance(query) {
  console.log("first")
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.staffId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` pa.staff_id = ${query.staffId} `;
      }

      if (query.dateFilter) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` MONTH(pa.allowance_date) = '${moment(query.dateFilter).format("MM")}'`;
        console.log(iql);
      }
    }

    const result = await sequelize.query(`
      SELECT DISTINCT 
          pa.staff_id AS "staffId",
          CONCAT(sur.status_name, '.', s.first_name, ' ', s.last_name) AS staffName,
          des.designation_name AS "designationName",  
          dep.department_name AS "departmentName",  
          b.branch_name AS "branchName",  
          s.staff_code AS "staffCode",  
          GROUP_CONCAT(DISTINCT a.activity_name SEPARATOR ' & ') AS "activityName",
          CONCAT('[', GROUP_CONCAT(DISTINCT
              CONCAT(
                  '{"billNo":"', IFNULL(pa.bill_no, ''), '",',
                  '"dateOfPurchase":"', IFNULL(pa.date_of_purchase, ''), '",',
                  '"nameOftheDealer":"', REPLACE(IFNULL(pa.name_of_dealer, ''), '"', '\\"'), '",',
                  '"billImageName":"', IFNULL(pa.bill_image_name, ''), '",', 
                  '"pricePerLitir":"', IFNULL(pa.price_per_litre, '0'), '",', 
                  '"qtyPerLitre":"', IFNULL(pa.qty_per_litre, '0'), '",', 
                  '"totalAmount":', IFNULL(pa.total_amount, 0), '}'
              )
              SEPARATOR ','
          ), ']') AS billDetails,
         CONCAT('[', GROUP_CONCAT(
         CONCAT(
              '{"bill_no":"', IFNULL(pa.bill_no, ''), '",',
            '"dateOfPurchase":"', IFNULL(pa.date_of_purchase, ''), '",',
            '"fromPlace":"', IFNULL(pa.from_place, ''), '",',
            '"toPlace":"', REPLACE(IFNULL(pa.to_place, ''), '"', '\\"'), '",',
            '"activityName":"', a.activity_name, '",',
            '"totalKm":"', IFNULL(pa.total_km, '0'), '",',
            '"totalAmount":', IFNULL(pa.total_amount, 0), '}'
        )
        SEPARATOR ','
    ), ']') AS petrolPurchase
      FROM petrol_allowances pa
      LEFT JOIN staffs s ON s.staff_id = pa.staff_id
      LEFT JOIN designation des ON des.designation_id = s.designation_id
      LEFT JOIN branches b ON b.branch_id = s.branch_id
      LEFT JOIN status_lists sur ON sur.status_list_id = s.surname_id
      LEFT JOIN department dep ON dep.department_id = s.department_id
      LEFT JOIN activities a ON FIND_IN_SET(a.activity_id, pa.activity_id)
      ${iql} AND pa.bill_no IS NOT NULL
      GROUP BY pa.staff_id, staffName, designationName, departmentName, branchName, staffCode;
  `, {
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
  getPetrolReportAllowance,
  updatePetrolAllowance,
  createPetrolAllowance
};