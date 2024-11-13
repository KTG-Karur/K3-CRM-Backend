"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const { QueryTypes } = require('sequelize');

async function getStaffRight(query) {
  try {
    let iql = "";
    let params = [];

    if (query && query.staffId) {
        iql += "WHERE staff_id = ?";
        params.push(query.staffId);
    }

    const result = await sequelize.query(
        `SELECT * FROM staff_rights ${iql}`, 
        { replacements: params, type: QueryTypes.SELECT }
    );
    return result;
  } catch (error) {
    throw new Error(messages.OPERATION_ERROR);
  }
}

async function createStaffRight(postData) {
  try {
    const [existingRight] = await sequelize.query(
      `SELECT staff_id FROM staff_rights WHERE staff_id = ?`,
      { replacements: [postData.staffId], type: QueryTypes.SELECT }
    );

    if (!existingRight) {
      await sequelize.query(
        `INSERT INTO staff_rights (staff_id, staff_right_permission) VALUES (?, ?)`,
        { replacements: [postData.staffId, JSON.stringify(postData.staffPermission)], type: QueryTypes.INSERT }
      );
    } else {
      await sequelize.query(
        `UPDATE staff_rights SET staff_right_permission = ? WHERE staff_id = ?`,
        { replacements: [JSON.stringify(postData.staffPermission), postData.staffId], type: QueryTypes.UPDATE }
      );
    }

    return await getStaffRight({ staffId: postData.staffId });
  } catch (error) {
    console.error("Error in createStaffRight:", error);
    throw new Error(messages.OPERATION_ERROR);
  }
}

module.exports = {
  getStaffRight,
  createStaffRight
};
