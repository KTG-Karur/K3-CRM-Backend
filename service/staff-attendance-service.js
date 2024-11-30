"use strict";

const sequelize = require("../models/index").sequelize;
const messages = require("../helpers/message");
const _ = require("lodash");
const { QueryTypes } = require("sequelize");
const { generateSerialNumber } = require("../utils/utility");
const moment = require('moment');

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
      if (query.branchId || query.branchId == '') {
        if (query.branchId !== '') {
          iql += count >= 1 ? ` AND` : ``;
          count++;
          iql += ` ts.branch_id = ${query.branchId}`;
        }
      }
      if (query.departmentId || query.departmentId == '') {
        if (query.departmentId !== '') {
          iql += count >= 1 ? ` AND` : ``;
          count++;
          iql += ` ts.department_id = ${query.departmentId}`;
        }
      }
    }

    const result = await sequelize.query(
      `SELECT ts.staff_attendance_id "staffAttendanceId",       
      ts.staff_id "staffId",CONCAT(s.first_name,' ',s.last_name) as staffName,
      s.staff_code "staffCode",
      ts.attendance_status_id "attendanceStatusId",
      ts.attendance_incharge_id  "attendanceInchargeId",
      ts.attendance_date "attendanceDate",
      b.branch_id "branchId",
      b.branch_name "branchName",
      d.department_id "departmentId",
      d.department_name "departmentName"
      FROM staffs s
      left join branches b on b.branch_id = s.branch_id
      left join department d on d.department_id = s.department_id
      left join staff_attendances ts on ts.staff_id = s.staff_id or ( ts.attendance_date is null and ts.staff_id is null )  ${iql}`,

      // const result = await sequelize.query(
      //   `SELECT ts.staff_attendance_id "staffAttendanceId",
      //   ts.staff_id "staffId",CONCAT(s.first_name,' ',s.last_name) as staffName,
      //   s.staff_code "staffCode",
      //   ts.attendance_status_id "attendanceStatusId",
      //   ts.attendance_incharge_id	 "attendanceInchargeId",
      //   ts.attendance_date "attendanceDate",
      //   b.branch_id "branchId",
      //   b.branch_name "branchName", 
      //   d.department_id "departmentId",
      //   d.department_name "departmentName"
      //   FROM staff_attendances ts
      //   left join branches b on b.branch_id = ts.branch_id
      //   left join department d on d.department_id = ts.department_id
      //   left join staffs s on s.staff_id = ts.staff_id ${iql}`,
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

async function getStaffAttendanceReport(query) {
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
      if (query.attendanceDate && query.durationId == 0) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ts.attendance_date = '${query.attendanceDate}'`;
      }
      if (query.durationId) {
        if (query.durationId) { // Month and year based
          iql += count >= 1 ? ` AND` : ``;
          count++;
          iql += ` ts.attendance_date BETWEEN '${moment(query.attendanceDate).startOf(query.durationId == 2 ? 'year' : 'month').format('YYYY-MM-DD')}' AND '${moment(query.attendanceDate).endOf(query.durationId == 2 ? 'year' : 'month').format('YYYY-MM-DD')}'`;
        }
      }
      if (query.branchId || query.branchId == '') {
        if (query.branchId !== '') {
          iql += count >= 1 ? ` AND` : ``;
          count++;
          iql += ` ts.branch_id = ${query.branchId}`;
        }
      }
      if (query.departmentId || query.departmentId == '') {
        if (query.departmentId !== '') {
          iql += count >= 1 ? ` AND` : ``;
          count++;
          iql += ` ts.department_id = ${query.departmentId}`;
        }
      }
    }

    const result = await sequelize.query(
      `SELECT ts.staff_attendance_id "staffAttendanceId",
      ts.staff_id "staffId",CONCAT(s.first_name,' ',s.last_name) as staffName,
      s.staff_code "staffCode",
      ts.attendance_status_id "attendanceStatusId",
      ts.attendance_incharge_id  "attendanceInchargeId",
      ts.attendance_date "attendanceDate",
      b.branch_id "branchId",
      b.branch_name "branchName",
      d.department_id "departmentId",
      d.department_name "departmentName",
    	SUM(CASE WHEN ts.attendance_status_id = 0 AND per.permission_type_id IS NULL THEN 1 ELSE 0 END) AS "absentDays",
    	SUM(CASE WHEN ts.attendance_status_id = 1 AND per.permission_type_id IS NULL THEN 1 ELSE 0 END) AS "presentDays",
    	SUM(CASE WHEN per.permission_type_id = 39 THEN 1 ELSE 0 END) AS "halfDays"
      FROM staffs s
      left join branches b on b.branch_id = s.branch_id
      left join department d on d.department_id = s.department_id
      left join staff_attendances ts on ts.staff_id = s.staff_id or ( ts.attendance_date is null and ts.staff_id is null )
      left join permissions per on per.staff_id = s.staff_id and per.permission_date = ts.attendance_date and per.status_id = 29 and per.is_active = 1
       ${iql}
      GROUP BY 
        s.staff_id, s.first_name, s.last_name, s.staff_code, b.branch_name, d.department_name
      ORDER BY 
        s.staff_id`,
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

async function updateStaffAttendance(putData) {
  try {
    const staffAttendanceId = 1;
    const excuteMethod = _.map(putData.staffAttendance, (item) =>
      _.mapKeys(item, (value, key) => _.snakeCase(key))
    );

    const staffAttendanceResult = excuteMethod.map(excuteData => {
      return sequelize.models.staff_attendance.update(excuteData, {
        where: { staff_attendance_id: excuteData.staff_attendance_id },
      })
    })
    const req = {
      attendanceDate: putData.staffAttendance[0].attendanceDate,
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
  getStaffAttendanceReport,
};
