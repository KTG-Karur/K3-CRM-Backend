"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');

async function getUserRights(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.userRightsId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` user_rights_id = ${query.userRightsId}`;
      }
      if (query.staffId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` staff_id = ${query.staffId}`;
      }
    }
    const result = await sequelize.query(`SELECT user_rights_id as "userRightsId",user_permission as "userRightsName",staff_id "staffId",createdAt "createdAt" FROM user_rights ${iql}`, {
      type: QueryTypes.SELECT,
      raw: true,
      nest: false
    });
    return result;
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function createUserRights(postData) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    console.log("excuteMethod")
    console.log(excuteMethod)
    const userRightsResult = await sequelize.models.user_rights.create(excuteMethod);
    const req = {
      userRightsId: userRightsResult.userRights_id
    }
    return await getUserRights(req);
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updateUserRights(userRightsId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const userRightsResult = await sequelize.models.user_rights.update(excuteMethod, { where: { userRights_id: userRightsId } });
    const req = {
      userRightsId: userRightsId
    }
    return await getUserRights(req);
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

module.exports = {
  getUserRights,
  updateUserRights,
  createUserRights,
};