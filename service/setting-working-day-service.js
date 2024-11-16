"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');
const { generateSerialNumber } = require('../utils/utility');

async function getSettingWorkingDay(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.settingWorkingDayId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ts.setting_working_day_id = ${query.settingWorkingDayId}`;
      }
    }
    const result = await sequelize.query(`SELECT ts.setting_working_day_id "settingWorkingDayId",
      ts.work_day "workDay", ts.logo_name "logoName",
      ts.createdAt
      FROM setting_working_days ts ${iql}`, {
      type: QueryTypes.SELECT,
      raw: true,
      nest: false
    });
   
    return result;
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function createSettingWorkingDay(postData) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const settingWorkingDayResult = await sequelize.models.setting_working_day.create(excuteMethod);
    const req = {
      settingWorkingDayId: settingWorkingDayResult.setting_working_day_id
    }
    return await getSettingWorkingDay(req);
  } catch (error) {
    console.log(error)
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updateSettingWorkingDay(settingWorkingDayId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const settingWorkingDayResult = await sequelize.models.setting_working_day.update(excuteMethod, { where: { setting_working_day_id: settingWorkingDayId } });
    const req = {
      settingWorkingDayId: settingWorkingDayId
    }
    return await getSettingWorkingDay(req);
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

module.exports = {
  getSettingWorkingDay,
  updateSettingWorkingDay,
  createSettingWorkingDay
};