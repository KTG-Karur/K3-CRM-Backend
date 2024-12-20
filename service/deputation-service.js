"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');
const { generateSerialNumber } = require('../utils/utility');

async function getDeputation(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.deputationId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ts.deputation_id = ${query.deputationId}`;
      }
      if (query.staffId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` s.staff_id = ${query.staffId}`;
      }
    }
    const result = await sequelize.query(`SELECT ts.deputation_id "deputationId",
      ts.staff_id "staffId",CONCAT(s.first_name,' ',s.last_name) as staffName,
      ts.deputation_code "deputationCode", ts.deputation_date "deputationDate",
      ts.from_date "fromDate", ts.to_date "toDate", ts.from_place "fromPlace", ts.to_place "toPlace", ts.	reason "reason",ts.deputation_by "deputationById",CONCAT(s.first_name,' ',s.last_name) as deputationBy,
      ts.createdAt
      FROM deputations ts
      left join staffs s on s.staff_id = ts.staff_id 
      left join staffs s2 on s2.staff_id = ts.deputation_by ${iql}`, {
      type: QueryTypes.SELECT,
      raw: true,
      nest: false
    });
    return result;
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function createDeputation(postData) {
  try {

    const countResult = await sequelize.query(`SELECT ts.deputation_code "deputationCode"
      FROM deputations ts ORDER BY ts.deputation_id DESC LIMIT 1`, {
      type: QueryTypes.SELECT,
      raw: true,
      nest: false
    });

    const applicantCodeFormat = `K3-KRR-`
    const count = countResult.length > 0 ? parseInt(countResult[0].deputationCode.split("-").pop()) : `00000`
    postData.deputationCode = await generateSerialNumber(applicantCodeFormat, count)

    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const deputationResult = await sequelize.models.deputation.create(excuteMethod);
    const req = {
      deputationId: deputationResult.deputation_id
    }
    return await getDeputation(req);
  } catch (error) {
    console.log(error)
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updateDeputation(deputationId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const deputationResult = await sequelize.models.deputation.update(excuteMethod, { where: { deputation_id: deputationId } });
    const req = {
      deputationId: deputationId
    }
    return await getDeputation(req);
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

module.exports = {
  getDeputation,
  updateDeputation,
  createDeputation
};