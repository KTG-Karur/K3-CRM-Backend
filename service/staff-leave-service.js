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
    }
    const result = await sequelize.query(
      `SELECT sl.staff_leave_id "staffLeaveId", sl.staff_id "staffId",
        sl.leave_type_id "leaveTypeId",sl3.status_name "leaveTypeName",CONCAT(s.first_name,' ',s.last_name) as staffName,
        sl.day_count "dayCount", sl.reason, sl.from_date "fromDate",
        sl.to_date "toDate", sl.approved_by "approvedBy", sl.leave_status_id "leaveStatusId",
        sl2.status_name "statusName", sl.createdAt, sl.updatedAt
        FROM staff_leaves sl
        left join staffs s on s.staff_id = sl.staff_id 
        left join status_lists sl2 on sl2.status_list_id = sl.leave_status_id 
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
          AND '${postData.toDate}' >= sl.from_date AND sl.staff_id = ${postData.staffId} AND sl.leave_status_id != 30
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
    if (putData.leaveStatusId != 28) {
      const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key));
      const staffLeaveResult = await sequelize.models.staff_leave.update(
        excuteMethod,
        { where: { staff_leave_id: staffLeaveId } }
      );
      const req = {
        staffLeaveId: staffLeaveId,
      };
      return await getStaffLeave(req);
    } else {
      const checkPerviousApplyLeave = await sequelize.query(
        `SELECT sl.staff_leave_id "staffLeaveId"
          FROM staff_leaves sl
          WHERE (
             '${putData.fromDate}' <= sl.to_date 
              AND '${putData.toDate}' >= sl.from_date AND sl.staff_id = ${putData.staffId} AND sl.leave_status_id != 30
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
        console.log("excuteMethod");
        console.log(excuteMethod);
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
