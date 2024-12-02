"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');

async function getClaimType(query) {
  try {
    let iql = {};
    if (query && Object.keys(query).length) {
      if (query.claimTypeId) {
        iql.claim_type_id = query.claimTypeId;
      }
      if (query.isActive) {
        iql.is_active = query.isActive;
      }
    }
    const result = await sequelize.models.claim_type.findAll({
      attributes: [['claim_type_id', 'claimTypeId'], ['claim_type_name', 'claimTypeName'],
      ['is_active', 'isActive'], ['createdAt', 'createdAt']],
      where: iql,
      order: [['claim_type_id', 'DESC']],
      raw: true,
      nest: false
    });
    return result;
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function createClaimType(postData) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const claimTypeResult = await sequelize.models.claim_type.create(excuteMethod);
    const req = {
      claimTypeId: claimTypeResult.claim_type_id
    }
    return await getClaimType(req);
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updateClaimType(claimTypeId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const claimTypeResult = await sequelize.models.claim_type.update(excuteMethod, { where: { claim_type_id: claimTypeId } });
    const req = {
      claimTypeId: claimTypeId
    }
    return await getClaimType(req);
} catch (error) {
  throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
}
}

module.exports = {
  getClaimType,
  updateClaimType,
  createClaimType,
};