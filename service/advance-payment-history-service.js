"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');
const { generateSerialNumber } = require('../utils/utility');

async function getAdvancePaymentHistory(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.staffAdvanceId) { 
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ts.staff_advance_id = ${query.staffAdvanceId}`;
      }
      if (query.advancePaymentHistoryId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` ts.advance_payment_history_id = ${query.advancePaymentHistoryId}`;
      }
    }
    const result = await sequelize.query(`SELECT ts.advance_payment_history_id "advancePaymentHistoryId",
      sa.staff_id "staffId",
      ts.staff_advance_id "staffAdvanceId", ts.paid_date "paidDate",
      ts.paid_amount "paidAmount", ts.paid_to "paidTo", ts.is_active "isActive",
      ts.createdAt
      FROM advance_payment_histories ts
      left join staff_advances sa on sa.staff_advance_id = ts.staff_advance_id ${iql}`, {
      type: QueryTypes.SELECT,
      raw: true,
      nest: false
    });

    return result;
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function createAdvancePaymentHistory(postData) {
  try {

    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    console.log("excuteMethod");
    console.log(excuteMethod);
    const advancePaymentHistoryResult = await sequelize.models.advance_payment_history.create(excuteMethod);
    const req = {
      advancePaymentHistoryId: advancePaymentHistoryResult.advance_payment_history_id
    }
    return await getAdvancePaymentHistory(req);
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updateAdvancePaymentHistory(advancePaymentHistoryId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const advancePaymentHistoryResult = await sequelize.models.advance_payment_history.update(excuteMethod, { where: { advance_payment_history_id: advancePaymentHistoryId } });
    const req = {
      advancePaymentHistoryId: advancePaymentHistoryId
    }
    return await getAdvancePaymentHistory(req);
  } catch (error) {
    console.log("error")
    console.log(error)
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

module.exports = {
  getAdvancePaymentHistory,
  updateAdvancePaymentHistory,
  createAdvancePaymentHistory
};