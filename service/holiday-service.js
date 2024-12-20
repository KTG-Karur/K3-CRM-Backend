"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');

async function getHoliday(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.holidayId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` de.holiday_id = ${query.holidayId}`;
      }
      if (query.departmentId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` de.department_id = ${query.departmentId}`;
      }
      if (query.isActive) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` de.is_active = ${query.isActive}`;
      }
    }
    const result = await sequelize.query(`SELECT holiday_id "holidayId", holiday_date "holidayDate", reason, createdAt FROM holidays ${iql}`, {
        type: QueryTypes.SELECT,
        raw: true,
        nest: false
      });
    return result;
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function createHoliday(postData) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const holidayResult = await sequelize.models.holiday.create(excuteMethod);
    const req = {
      holidayId: holidayResult.holiday_id
    }
    return await getHoliday(req);
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updateHoliday(holidayId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const holidayResult = await sequelize.models.holiday.update(excuteMethod, { where: { holiday_id: holidayId } });
    const req = {
      holidayId: holidayId
    }
    return await getHoliday(req);
} catch (error) {
  throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
}
}

module.exports = {
  getHoliday,
  updateHoliday,
  createHoliday
};