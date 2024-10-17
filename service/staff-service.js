"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');

async function getStaff(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) { 
      iql += `WHERE`;
      if (query.staffId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` st.staff_id = ${query.staffId}`;
      }
      if (query.departmentId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` st.department_id = ${query.departmentId}`;
      }
      if (query.isActive) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` st.is_active = ${query.isActive}`;
      }
    }


    const result = await sequelize.query(`SELECT st.staff_id "staffId",st.surname_id "surnameId", st.staff_code "staffCode", st.first_name "firstName", st.last_name "lastName", st.age "age", st.address "address", st.caste_type_id "casteTypeId", st.contact_no "contactNo", st.alternative_contact_no "alternativeContactNo", st.email_id "emailId", st.profile_image_name "profileImageName", st.designation_id "designationId", st.bank_account_id "bankAccountId", st.branch_id "branchId", st.date_of_joining "dateOfJoining", st.date_of_reliving "dateOfReliving", st.role_id "roleId", st.user_id "userId", st.gender_id "genderId", st.martial_status_id "martialStatusId", st.createdAt "createdAt", st.updatedAt "updatedAt", st.department_id "departmentId",d.department_name "departmentName",sur.status_name "surName",ct.status_name "casteName",deg.designation_name "designationName",ba.bank_name "bankName",b.branch_name "branchName",r.role_name "roleName",u.user_name "userName",g.status_name "genderName",ms.status_name "martialStatusName", st.is_active "isActive", st.createdAt, st.updatedAt
        FROM staff st
        left join department d on d.department_id = st.department_id 
        left join status_lists sur on sur.status_list_id = st.surname_id
        left join status_lists ct on ct.status_list_id = st.caste_type_id
        left join designation deg on deg.designation_id = st.designation_id
        left join bank_accounts ba on ba.bank_account_id = st.bank_account_id
        left join branches b on b.branch_id = st.branch_id
        left join role r on r.role_id = st.role_id
        left join users u on u.user_id = st.user_id
        left join status_lists g on g.status_list_id = st.gender_id
        left join status_lists ms on ms.status_list_id = st.martial_status_id  ${iql}`, {
        type: QueryTypes.SELECT,
        raw: true,
        nest: false
      });
    return result;
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function createStaff(postData) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const staffResult = await sequelize.models.staff.create(excuteMethod);
    const req = {
      staffId: staffResult.staff_id
    }
    return await getStaff(req);
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updateStaff(staffId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const staffResult = await sequelize.models.staff.update(excuteMethod, { where: { staff_id: staffId } });
    const req = {
      staffId: staffId
    }
    return await getStaff(req);
} catch (error) {
  throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
}
}

module.exports = {
  getStaff,
  updateStaff,
  createStaff
};