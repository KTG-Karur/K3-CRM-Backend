"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');
const { generateSerialNumber } = require('../utils/utility');

async function getStaffAttendance(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.staffAttendanceId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ts.staff_attendance_id = ${query.staffAttendanceId}`;
      }
      if (query.staffId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` s.staff_id = ${query.staffId}`;
      }
    }
    const result = await sequelize.query(`SELECT ts.staff_attendance_id "staffAttendanceId",
      ts.staff_id "staffId",CONCAT(s.first_name,' ',s.last_name) as staffName,
      ts.transfer_code "transferCode", ts.transfer_date "transferDate",
      b.branch_id "transferFrom", b2.branch_id "transferTo",
      b.branch_name "transferFromName", b2.branch_name "transferToName",
      ts.transfered_by "transferedById",CONCAT(s.first_name,' ',s.last_name) as transferedBy,
      ts.createdAt
      FROM staff_attendances ts
      left join branches b on b.branch_id = ts.transfer_from
      left join branches b2 on b2.branch_id = ts.transfer_to
      left join staffs s on s.staff_id = ts.staff_id 
      left join staffs s2 on s2.staff_id = ts.transfered_by ${iql}`, {
      type: QueryTypes.SELECT,
      raw: true,
      nest: false
    });
    return result;
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function createStaffAttendance(postData) {
  try {

    const countResult = await sequelize.query(`SELECT ts.transfer_code "transferCode"
      FROM staff_attendances ts ORDER BY ts.staff_attendance_id DESC LIMIT 1`, {
      type: QueryTypes.SELECT,
      raw: true,
      nest: false
    });

    const applicantCodeFormat = `K3-KRR-`
    const count = countResult.length > 0 ? parseInt(countResult[0].transferCode.split("-").pop()) : `00000`
    postData.transferCode = await generateSerialNumber(applicantCodeFormat, count)

    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const staffAttendanceResult = await sequelize.models.staff_attendance.create(excuteMethod);
    const req = {
      staffAttendanceId: staffAttendanceResult.staff_attendance_id
    }
    return await getStaffAttendance(req);
  } catch (error) {
    console.log(error)
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updateStaffAttendance(staffAttendanceId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const staffAttendanceResult = await sequelize.models.staff_attendance.update(excuteMethod, { where: { staff_attendance_id: staffAttendanceId } });
    const req = {
      staffAttendanceId: staffAttendanceId
    }
    return await getStaffAttendance(req);
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

module.exports = {
  getStaffAttendance,
  updateStaffAttendance,
  createStaffAttendance
};