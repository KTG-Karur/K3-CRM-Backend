"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');
const moment = require('moment');

async function getClaim(query) {
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
      if (query.durationId) { // Month and year based for Report
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` c.apply_date BETWEEN '${moment(query.applyDate).startOf(query.durationId == 1 ? 'year' : 'month').format('YYYY-MM-DD')}' AND '${moment(query.applyDate).endOf(query.durationId == 1 ? 'year' : 'month').format('YYYY-MM-DD')}'`;
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
    const result = await sequelize.query(`SELECT c.claim_id "claimId", c.claim_type_id "claimTypeId",ct.claim_type_name "claimTypeName",
        c.requested_by "requestedById",CONCAT(s.first_name,' ',s.last_name) as requestedBy,
        c.bank_account_id "bankAccountId",s.dob "dob",s.date_of_joining "dateOfJoining",
        c.requested_amount "requestedAmount", c.reason, c.branch_id "branchId",b.branch_name "branchName",s.staff_code "staffCode",
        c.recepit_image_name "recepitImageName",sl.status_name "statusName", c.claim_amount "claimAmount",
        c.apply_date "applyDate", c.status_id "statusId", c.mode_of_payment_id "modeOfPaymentId",
        sl2.status_name "paymentModeName", c.approved_date "approvedDate",c.approved_by "approvedById",
        CONCAT(s2.first_name,' ',s2.last_name) as approvedBy, c.createdAt,
        ct.eligible_amount "eligibleAmount",c.recepit_image_name "recepitImageName",
        s.role_id "roleId", rl.role_name "roleName",
      des.designation_name 'designationName',  dep.department_name 'departmentName'
        FROM claims c
        left join claim_types ct on ct.claim_type_id = c.claim_type_id 
        left join staffs s on s.staff_id = c.requested_by 
        left join staffs s2 on s2.staff_id = c.approved_by 
        left join branches b on b.branch_id = c.branch_id 
        left join role rl on rl.role_id = s.role_id
      left join designation des on des.designation_id = s.designation_id
      left join department dep on dep.department_id = s.department_id
        left join status_lists sl on sl.status_list_id = c.status_id 
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