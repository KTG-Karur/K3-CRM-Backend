"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const { QueryTypes } = require('sequelize');
const _ = require('lodash');

async function getSetting(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.settingId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ts.setting_id = ${query.settingId}`;
      }
    }
    const result = await sequelize.query(`SELECT ts.setting_id "settingId",ts.from_day "fromDay",
      ts.to_day "toDay", ts.esi_percentage "esiPercentage", ts.pf_percentage "pfPercentage", ts.permission_deduction "permissionDeduction", ts.leave_deduction "leaveDeduction", ts.image_name "imageName", ts.createdAt
      FROM  settings ts  ${iql}`, {
      type: QueryTypes.SELECT,
      raw: true,
      nest: false
    });
    return result;
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function createSetting(postData) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))    
    const settingResult = await sequelize.models.setting.create(excuteMethod);    
    const req = {
      settingId: settingResult.setting_id
    }    
    return await getSetting(req);
  } catch (error) {    
    
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updateSetting(settingId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const settingResult = await sequelize.models.setting.update(excuteMethod, { where: { setting_id: settingId } });
    const req = {
      settingId: settingId
    }
    return await getSetting(req);
} catch (error) {
  throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
}
}

module.exports = {
  getSetting,
  updateSetting,
  createSetting,
};