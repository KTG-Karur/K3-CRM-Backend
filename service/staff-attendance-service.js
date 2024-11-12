"use strict";

const sequelize = require("../models/index").sequelize;
const messages = require("../helpers/message");
const _ = require("lodash");
const { QueryTypes } = require("sequelize");
const { generateSerialNumber } = require("../utils/utility");

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
      if (query.attendanceDate) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ts.attendance_date = '${query.attendanceDate}'`;
      }
    }
    const result = await sequelize.query(
      `SELECT ts.staff_attendance_id "staffAttendanceId",
      ts.staff_id "staffId",CONCAT(s.first_name,' ',s.last_name) as staffName,
      b.branch_id "branchId",
      b.branch_name "branchName", 
      d.department_id "departmentId",
      d.department_name "departmentName",
      ts.createdAt
      FROM staff_attendances ts
      left join branches b on b.branch_id = ts.branch_id
      left join department d on d.department_id = ts.department_id
      left join staffs s on s.staff_id = ts.staff_id ${iql}`,
      {
        type: QueryTypes.SELECT,
        raw: true,
        nest: false,
      }
    );
    return result;
  } catch (error) {
    throw new Error(
      error.errors[0].message
        ? error.errors[0].message
        : messages.OPERATION_ERROR
    );
  }
}

async function createStaffAttendance(postData) {
  try {
    // const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))

    const excuteMethod = _.map(postData.staffAttendance, (item) =>
      _.mapKeys(item, (value, key) => _.snakeCase(key))
    );
    const staffAttendanceResult =
      await sequelize.models.staff_attendance.bulkCreate(excuteMethod);
    // const staffAttendanceResult = await sequelize.models.staff_attendance.create(excuteMethod);

    const req = {
      attendanceDate: postData.staffAttendance[0].attendanceDate,
    };
    return await getStaffAttendance(req);
  } catch (error) {
    throw new Error(
      error.errors[0].message
        ? error.errors[0].message
        : messages.OPERATION_ERROR
    );
  }
}

async function updateStaffAttendance(staffAttendanceId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key));
    const staffAttendanceResult =
      await sequelize.models.staff_attendance.update(excuteMethod, {
        where: { staff_attendance_id: staffAttendanceId },
      });
    const req = {
      staffAttendanceId: staffAttendanceId,
    };
    return await getStaffAttendance(req);
  } catch (error) {
    throw new Error(
      error.errors[0].message
        ? error.errors[0].message
        : messages.OPERATION_ERROR
    );
  }
}

module.exports = {
  getStaffAttendance,
  updateStaffAttendance,
  createStaffAttendance,
};
