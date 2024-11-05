"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');
const { generateSerialNumber, encrptPassword } = require('../utils/utility');
const { createBankAccount, updateBankAccount } = require('./bank-account-service');
const { createUser } = require('./user-service');
const { createStaffWorkExperience, updateStaffWorkExperience } = require('./staff-work-experience-service');
const { createStaffKnownLanguage, updateStaffKnownLanguage } = require('./staff-known-language-service');
const { createStaffQualification, updateStaffQualification } = require('./staff-qualification-service');
const { createStaffRelation, updateStaffRelation } = require('./staff-relation-service');
const { createStaffProof, updateStaffProof } = require('./staff-proof-id-service');
const { createStaffSalaryAllocate, updateStaffSalaryAllocate } = require('./staff-salary-allocate-service');

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
    const result = await sequelize.query(`SELECT st.staff_id "staffId",CONCAT(sur.status_name,'.',st.first_name,' ',st.last_name) as staffName, st.staff_code "staffCode", st.contact_no "contactNo", st.branch_id "branchId", st.role_id "roleId", 
        st.department_id "departmentId",d.department_name "departmentName",r.role_name "roleName"
        FROM staffs st
        left join department d on d.department_id = st.department_id 
        left join status_lists sur on sur.status_list_id = st.surname_id
        left join role r on r.role_id = st.role_id  ${iql}`, {
      type: QueryTypes.SELECT,
      raw: true,
      nest: false
    });
    return result;
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function getStaffDetails(query) {
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
    }
    const personalInfoData = await sequelize.query(`
      SELECT st.staff_id "staffId",st.surname_id "surnameId", st.staff_code "staffCode",
      st.first_name "firstName", st.last_name "lastName", st.age "age", st.address "address", 
      st.caste_type_id "casteTypeId", st.contact_no "contactNo", st.dob,
      st.alternative_contact_no "alternativeContactNo", st.email_id "emailId",
      st.gender_id "genderId", st.martial_status_id "martialStatusId"
      FROM staffs st
      left join status_lists sur on sur.status_list_id = st.surname_id
      left join status_lists g on g.status_list_id = st.gender_id
      left join status_lists ms on ms.status_list_id = st.martial_status_id  ${iql}`, {
      type: QueryTypes.SELECT,
      raw: true,
      nest: false
    });

    const jobRoleDetails = await sequelize.query(`
      SELECT st.staff_id "staffId",st.date_of_joining "dateOfJoining",st.branch_id "branchId",
      st.department_id "departmentId",d.department_name "departmentName", 
      st.designation_id "designationId" ,d2.designation_name "designationName",
      st.role_id "roleId" , r.role_name "roleName",st.bank_account_id "bankAccountId",
      ba.account_holder_name "accountHolderName",ba.bank_name "bankName", ba.branch_name "branchName",
      ba.account_no "accountNo", ba.ifsc_code "ifscCode",
      st.user_id "userId" ,ssa.staff_salary_allocated_id "staffSalaryAllocatedId", ssa.annual_amount "annualAmount", ssa.monthly_amount "monthlyAmount"
      FROM staffs st
      left join department d on d.department_id = st.department_id 
      left join designation d2 on d2.designation_id = st.designation_id 
      left join role r on r.role_id = st.role_id  
      left join bank_accounts ba on ba.bank_account_id = st.bank_account_id 
      left join staff_salary_allocateds ssa on ssa.staff_id = st.staff_id  ${iql}`, {
      type: QueryTypes.SELECT,
      raw: true,
      nest: false
    });

    const idProof = await sequelize.query(`
      SELECT st.staff_proof_id "staffProofId", st.staff_id "staffId", 
      st.proof_type_id "proofTypeId", st.proof_number "proofNumber",
      pt.proof_type_name "proofTypeName", st.proof_image_name "proofImageName", st.createdAt
      FROM staff_proofs st
      left join proof_types pt on pt.proof_type_id = st.proof_type_id ${iql}`, {
      type: QueryTypes.SELECT,
      raw: true,
      nest: false
    });

    const workExperience = await sequelize.query(`
      SELECT st.work_experience_id "workExperienceId", st.staff_id "staffId",
      st.organization_name "organizationName", st.position, st.years_of_experience "yearsOfExperience",
      st.from_date "fromDate", st.to_date "toDate", st.gross_pay "grossPay", st.work_location "workLocation",
      st.reason_for_leaving "reasonForLeaving", st.createdAt
      FROM work_experiences st ${iql}`, {
      type: QueryTypes.SELECT,
      raw: true,
      nest: false
    });

    const staffDetails = await sequelize.query(`
      SELECT st.staff_relation_details_id "staffRelationDetailsId", st.staff_id "staffId",
      st.relation_id "relationId", sl.status_name "relationTypeName", st.contact_no "contactNo", 
      st.qualification_id "qualificationId", sl2.status_name "qualificationName",
      st.occupation, st.createdAt, st.relation_name "relationName"
      FROM staff_relation_details st
      left join status_lists sl on sl.status_list_id = st.relation_id 
      left join status_lists sl2 on sl2.status_list_id = st.qualification_id  ${iql}`, {
      type: QueryTypes.SELECT,
      raw: true,
      nest: false
    });

    const staffQualification = await sequelize.query(`
      SELECT staff_qualification_id "staffQualificationId", staff_id "staffId",
      qualification_id "qualificationId", sl.status_name "qualificationName", passing_year "passingYear", university_name "universityName",
      percentage, stream, st.createdAt
      FROM staff_qualifications st
      left join status_lists sl on sl.status_list_id = st.qualification_id ${iql}`, {
      type: QueryTypes.SELECT,
      raw: true,
      nest: false
    });

    const language = await sequelize.query(`
      SELECT staff_known_language_id "staffKnownLanguageId",
      staff_id "staffId", language_id "languageId",
      CASE WHEN language_speak = '1' THEN 'true' ELSE 'false' end as 'speak',
      CASE WHEN language_read = '1' THEN 'true'  ELSE 'false' end as 'read',
      CASE WHEN language_write = '1' THEN 'true' ELSE 'false' end as 'write',
      st.createdAt, sl.status_name "languageName"
      FROM staff_known_languages st
      left join status_lists sl on sl.status_list_id = st.language_id  ${iql}`, {
      type: QueryTypes.SELECT,
      raw: true,
      nest: false
    });

    const result = {
      personalInfo: personalInfoData[0],
      jobRoleDetails: jobRoleDetails[0],
      idProof : idProof,
      workExperience : workExperience,
      staffQualification : staffQualification,
      staffDetails : staffDetails,
      language :language
    }
    return result;
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function createStaff(postData) {
  try {
    const applicantCodeFormat = `K3-STAFF-`
    const personalInfoData = postData.personalInfoData

    const userCreditial = postData?.jobRoleDetails?.userCreditial || false
    if (userCreditial) {
      const userLogin = {
        userName: postData.jobRoleDetails?.userName || "",
        password: postData.jobRoleDetails?.password || "",
      }
      //User Creation
      const userResult = await createUser(userLogin)
      personalInfoData.userId = userResult[0].userId
    }
    //Bank Creation
    const bankRes = await createBankAccount(postData.jobRoleDetails)
    personalInfoData.bankAccountId = bankRes[0].bankAccountId

    const countResult = await sequelize.query(
      `SELECT staff_code "staffCode" FROM staffs
      ORDER BY staff_id DESC LIMIT 1`,
      {
        type: QueryTypes.SELECT,
        raw: true,
        nest: false
      });

    const count = countResult.length > 0 ? parseInt(countResult[0].staffCode.split("-").pop()) : `00000`
    personalInfoData.staffCode = await generateSerialNumber(applicantCodeFormat, count)

    //  Staff Creation
    const excuteMethod = _.mapKeys(personalInfoData, (value, key) => _.snakeCase(key))
    const staffResult = await sequelize.models.staff.create(excuteMethod);

    //work experience Creation
    const workExperienceData = postData.workExperience.map(v => ({ ...v, staffId: staffResult.staff_id }))
    const workExperience = await createStaffWorkExperience(workExperienceData)

    // Language Known
    const languageData = postData.language.map(v => ({ ...v, staffId: staffResult.staff_id, languageSpeak: v?.speak === true ? 1 : 0 || 0, languageRead: v?.read === true ? 1 : 0 || 0, languageWrite: v?.write === true ? 1 : 0 || 0 }))
    const language = await createStaffKnownLanguage(languageData)

    // Staff Qualification
    const staffQualificationData = postData.staffQualification.map(v => ({ ...v, staffId: staffResult.staff_id }))
    const staffQualification = await createStaffQualification(staffQualificationData)

    // Relation Details
    const staffRelationData = postData.staffDetails.map(v => ({ ...v, staffId: staffResult.staff_id, qualificationId: v.realtionQualificationId }))
    const staffRelation = await createStaffRelation(staffRelationData)

    // Id Proofs 
    const proofInfoData = postData.idProof.map((v, i) => ({ ...v, staffId: staffResult.staff_id, proofImageName: `${personalInfoData.staffCode}-${v?.imageName || "Dummy"}-0${i}` }))
    const proofResult = await createStaffProof(proofInfoData)

    //salary Allocate
    const salaryAllocate = postData.jobRoleDetails
    salaryAllocate.staffId = staffResult.staff_id
    const salaryAllocateRes = await createStaffSalaryAllocate(salaryAllocate)

    const req = {
      staffId: staffResult.staff_id
    }
    console.log(req)
    return await getStaff(req);
  } catch (error) {
    console.log(error)
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updateStaff(staffId, putData) {
  try {
    const personalInfoData = putData.personalInfoData
    const staffIdVal = personalInfoData.staffId
    //Staff Updation
    const excuteMethod = _.mapKeys(personalInfoData, (value, key) => _.snakeCase(key))
    const staffResult = await sequelize.models.staff.update(excuteMethod, { where: { staff_id: staffIdVal } });

    //bank update
    const BankDetails = putData.jobRoleDetails
    const bankDetailsReq ={
      bankName : BankDetails.bankName,
      branchName : BankDetails.branchName,
      accountHolderName : BankDetails.accountHolderName,
      accountNo : BankDetails.accountNo,
      ifscCode : BankDetails.ifscCode
    } 
    console.log(bankDetailsReq)
    console.log(BankDetails.bankAccountId)
    const bankUpdateRes = await updateBankAccount(BankDetails.bankAccountId, bankDetailsReq)

    //job Salary Allocate Details
    const jobRoleDetails = putData.jobRoleDetails 
    const salaryAllocateRes = await updateStaffSalaryAllocate(jobRoleDetails.staffSalaryAllocatedId, jobRoleDetails)

    // workExperience
    const workExperience = putData.workExperience 
    const workExperienceRes = await updateStaffWorkExperience(staffId, workExperience)

    //language
    const languageData = putData.language 
    const languageRes = await updateStaffKnownLanguage(staffId, languageData)

    //qualificationData
    const qualificationData = putData.staffQualification 
    const qualificationRes = await updateStaffQualification(staffId, qualificationData)

    // Proof Details
    const proofData = putData.idProof 
    const proofRes = await updateStaffProof(staffId, proofData)

    // Relation Details
    const relationData = putData.staffDetails 
    const relationRes = await updateStaffRelation(staffId, relationData)

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
  createStaff,
  getStaffDetails
};