"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');
const { generateSerialNumber } = require('../utils/utility');

async function getSettingBenefit(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.settingBenefitId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ts.setting_benefit_id = ${query.settingBenefitId}`;
      }
    }
    const result = await sequelize.query(`SELECT ts.setting_benefit_id "settingBenefitId",
      ts.benefit_percentage "benefitPercentage", ts.benefit_name "benefitName",
      ts.createdAt
      FROM setting_benefits ts ${iql}`, {
      type: QueryTypes.SELECT,
      raw: true,
      nest: false
    });
    return result;
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function createSettingBenefit(postData) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const settingBenefitResult = await sequelize.models.setting_benefit.create(excuteMethod);
    const req = {
      settingBenefitId: settingBenefitResult.setting_benefit_id
    }
    return await getSettingBenefit(req);
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updateSettingBenefit(settingBenefitId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const settingBenefitResult = await sequelize.models.setting_benefit.update(excuteMethod, { where: { setting_benefit_id: settingBenefitId } });
    const req = {
      settingBenefitId: settingBenefitId
    }
    return await getSettingBenefit(req);
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

module.exports = {
  getSettingBenefit,
  updateSettingBenefit,
  createSettingBenefit
};