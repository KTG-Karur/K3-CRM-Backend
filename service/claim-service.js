"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');

async function getClaim(query, auth) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.claimId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` c.claim_id = ${query.claimId}`;
      }
      if (query.approvedBy) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` c.approved_by = ${query.approvedBy}`;
      }
      if (query.requestedBy) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` c.requested_by = ${query.requestedBy}`;
      }
      if (query.requestedDate) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` DATE(c.apply_date) = '${query.requestedDate}'`;
      }
      if (query.approvedDate) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` DATE(c.approved_date) = '${query.approvedDate}'`;
      }
    }

    if (auth.branch_id && auth.role_id === 3) {
      iql += count >= 1 ? ` AND` : `WHERE`;
      iql += ` c.branch_id = ${auth.branch_id}`;
    }

    const result = await sequelize.query(`SELECT c.claim_id "claimId", c.claim_type_id "claimTypeId",ct.claim_type_name "claimTypeName",
        c.requested_by "requestedById",CONCAT(s.first_name,' ',s.last_name) as requestedBy,
        c.requested_amount "requestedAmount", c.reason, c.branch_id "branchId",b.branch_name "branchName",
        c.recepit_image_name "recepitImageName",sl.status_name "claimStatusName", c.claim_amount "claimAmount",
        c.apply_date "applyDate", c.claim_status "claimStatusId", c.mode_of_payment_id "modeOfPaymentId",
        sl2.status_name "paymentModeName", c.approved_date "approvedDate",c.approved_by "approvedById",
        CONCAT(s2.first_name,' ',s2.last_name) as approvedBy, c.createdAt
        FROM claims c
        left join claim_types ct on ct.claim_type_id = c.claim_type_id 
        left join staffs s on s.staff_id = c.requested_by 
        left join staffs s2 on s2.staff_id = c.approved_by 
        left join branches b on b.branch_id = c.branch_id 
        left join status_lists sl on sl.status_list_id = c.claim_status 
        left join status_lists sl2 on sl2.status_list_id = c.mode_of_payment_id ${iql}`, {
        type: QueryTypes.SELECT,
        raw: true,
        nest: false
      });
    return result;
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function createClaim(postData) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const claimResult = await sequelize.models.claim.create(excuteMethod);
    const req = {
      claimId: claimResult.claim_id
    }
    return await getClaim(req);
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updateClaim(claimId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const claimResult = await sequelize.models.claim.update(excuteMethod, { where: { claim_id: claimId } });
    const req = {
      claimId: claimId
    }
    return await getClaim(req);
} catch (error) {
  throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
}
}

module.exports = {
  getClaim,
  updateClaim,
  createClaim
};