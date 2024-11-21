"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');

async function getBranch(query) {

  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.branchId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` branch_id = ${query.branchId}`;
      }
    }
    const result = await sequelize.query(`SELECT branch_id "branchId", branch_name "branchName", address "address", city "city", pincode "pincode", email "email", contact_no "contactNo",
        branch_admin_id "branchAdminId", createdAt, updatedAt
        FROM branches ${iql}`, {
      type: QueryTypes.SELECT,
      raw: true,
      nest: false
    });
    return result;
  } catch (error) {

    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function createBranch(postData) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const existingBranch = await sequelize.models.branch.findOne({
      where: {
        branch_name: excuteMethod.branch_name
      }
    });
    if (existingBranch) {
      throw new Error(messages.DUPLICATE_ENTRY);
    }

    const branchResult = await sequelize.models.branch.create(excuteMethod);
    const req = {
      branchId: branchResult.branch_id
    }


    return await getBranch(req);
  } catch (error) {
    throw new Error(error?.message ? error.message : error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updateBranch(branchId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key));

    const duplicateBranch = await sequelize.models.branch.findOne({
      where: sequelize.literal(`branch_name = '${excuteMethod.branch_name}' AND branch_id != ${branchId}`)
    });
    if (duplicateBranch) {
      throw new Error(messages.DUPLICATE_ENTRY);
    }
    const branchResult = await sequelize.models.branch.update(excuteMethod, { where: { branch_id: branchId } });
    const req = {
      branchId: branchId
    }
    return await getBranch(req);
  } catch (error) {
    throw new Error(error?.message ? error.message : error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

module.exports = {
  getBranch,
  updateBranch,
  createBranch
};