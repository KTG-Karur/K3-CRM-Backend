"use strict";

const sequelize = require("../models/index").sequelize;
const messages = require("../helpers/message");
const _ = require("lodash");
const { QueryTypes } = require("sequelize");

async function getStaffLeave(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.staffLeaveId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` sl.staff_leave_id = ${query.staffLeaveId}`;
      }
      if (query.statusId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` sl.status_id = ${query.statusId}`;
      }
      if (query.attendanceDate) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` sl.from_date <= '${query.attendanceDate}' AND '${query.attendanceDate}' <= sl.to_date`;
      }
    }
    const result = await sequelize.query(
      `SELECT sl.staff_leave_id "staffLeaveId", sl.staff_id "staffId",
        sl.leave_type_id "leaveTypeId",sl3.status_name "leaveTypeName",CONCAT(sur.status_name,'.',s.first_name,' ',s.last_name) as staffName,
        sl.day_count "dayCount", sl.reason, sl.from_date "fromDate",
         s.staff_code "staffCode",
         sl.branch_id "branchId",
          sl.spoken_date "spokenDate",
      sl.spoken_time "spokenTime",
      sl.spoken_staff_id "spokenStaffId",
      CONCAT(sur_sp.status_name,'.',sp.first_name,' ',sp.last_name) as "spokenStaffName",
        sl.to_date "toDate", sl.approved_by "approvedBy", sl.status_id "statusId",
        sl2.status_name "statusName", sl.createdAt, sl.updatedAt,
        
      des.designation_name 'designationName',  dep.department_name 'departmentName',
      des_sp.designation_name 'spokenDesignationName',  dep_sp.department_name 'spokenDepartmentName'

        FROM staff_leaves sl
        left join staffs s on s.staff_id = sl.staff_id 
      left join staffs sp on sp.staff_id = sl.spoken_staff_id
        left join status_lists sl2 on sl2.status_list_id = sl.status_id 

      left join designation des on des.designation_id = s.designation_id
      left join department dep on dep.department_id = s.department_id
      
      left join designation des_sp on des_sp.designation_id = sp.designation_id
      left join department dep_sp on dep_sp.department_id = sp.department_id

      left join status_lists sur on sur.status_list_id = s.surname_id 
      left join status_lists sur_sp on sur_sp.status_list_id = sp.surname_id 
        left join status_lists sl3 on sl3.status_list_id = sl.leave_type_id  ${iql}`,
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

async function createStaffLeave(postData) {
  try {
    const checkPerviousApplyLeave = await sequelize.query(
      `SELECT sl.staff_leave_id "staffLeaveId"
      FROM staff_leaves sl
      WHERE (
         '${postData.fromDate}' <= sl.to_date 
          AND '${postData.toDate}' >= sl.from_date AND sl.staff_id = ${postData.staffId} AND sl.status_id != 30
      )`,
      {
        type: QueryTypes.SELECT,
        raw: true,
        nest: false,
      }
    );

    if (checkPerviousApplyLeave.length <= 0) {
      const excuteMethod = _.mapKeys(postData, (value, key) =>
        _.snakeCase(key)
      );
      const staffLeaveResult = await sequelize.models.staff_leave.create(
        excuteMethod
      );
      const req = {
        staffLeaveId: staffLeaveResult.staff_leave_id,
      };
      return await getStaffLeave(req);
    } else {
      throw new Error(messages.LEAVE_APPLIED_BEFORE);
    }
  } catch (error) {
    throw new Error(error);
  }
}

async function updateStaffLeave(staffLeaveId, putData) {
  try {
    // check is cancelled or not
    if (putData.statusId == 28) {
      const checkPerviousApplyLeave = await sequelize.query(
        `SELECT sl.staff_leave_id "staffLeaveId"
          FROM staff_leaves sl
          WHERE (
             '${putData.fromDate}' <= sl.to_date 
              AND '${putData.toDate}' >= sl.from_date AND sl.staff_id = ${putData.staffId} AND sl.status_id != 30 AND sl.staff_leave_id <> ${staffLeaveId}
          )`,
        {
          type: QueryTypes.SELECT,
          raw: true,
          nest: false,
        }
      );


      if (checkPerviousApplyLeave.length <= 0) {
        const excuteMethod = _.mapKeys(putData, (value, key) =>
          _.snakeCase(key)
        );

        const staffLeaveResult = await sequelize.models.staff_leave.update(
          excuteMethod,
          { where: { staff_leave_id: staffLeaveId } }
        );
        const req = {
          staffLeaveId: staffLeaveId,
        };
        return await getStaffLeave(req);
      } else {
        throw new Error(messages.LEAVE_APPLIED_BEFORE);
      }
    } else {
      const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key));
      const staffLeaveResult = await sequelize.models.staff_leave.update(
        excuteMethod,
        { where: { staff_leave_id: staffLeaveId } }
      );
      const req = {
        staffLeaveId: staffLeaveId,
      };
      return await getStaffLeave(req);
    }
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  getStaffLeave,
  updateStaffLeave,
  createStaffLeave,
};
