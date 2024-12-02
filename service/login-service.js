"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');
const { decrptPassword } = require('../utils/utility');

async function getEmployeeLogin(query) {
    try {
        let iql = "";
        let count = 0;
        if (query && Object.keys(query).length) {
            iql += `WHERE`;
            if (query.userName) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` u.user_name = '${query.userName}'`;
            }
            // if (query.password) {
            //     iql += count >= 1 ? ` AND` : ``;
            //     count++;
            //     const decrptPassword = await decrptPassword(query.password)
            //     console.log(decrptPassword)
            //     iql += ` u.password = '${decrptPassword}'`;
            // }
            if (query.isActive) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` emp.is_active = ${query.isActive}`;
            }
        }
        const result = await sequelize.query(`SELECT emp.employee_id, emp.employee_code, emp.user_id, u.password
            FROM employee emp
            left join users u on u.user_id = emp.user_id ${iql}`, {
            type: QueryTypes.SELECT,
            raw: true,
            nest: false
        });
        const decrptPasswordData = await decrptPassword(result[0].password)
        if(decrptPasswordData === query.password){
            return result;
        }else{
            throw new Error(messages.INCORRECT_PASSWORD);
        }
    } catch (error) {
        throw new Error(error);
    }
}

async function getUserLogin(query) {
    try {
        let iql = "";
        let count = 0;
        if (query && Object.keys(query).length) {
            iql += `WHERE`;
            if (query.userName) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` u.user_name = '${query.userName}'`;
            }
            if (query.isActive) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` u.is_active = ${query.isActive}`;
            }
        }
        const result = await sequelize.query(`SELECT a.applicant_id "applicantId", a.applicant_code "applicantCode",
            CONCAT(a.first_name,' ',a.last_name) as userName,a.contact_no "contactNo",
            a.user_id "userId",u.password "password"
            FROM applicants a
            left join users u on u.user_id = a.user_id  ${iql}`, {
            type: QueryTypes.SELECT,
            raw: true,
            nest: false
        });
        if(result.length > 0){
            const decrptPasswordData = await decrptPassword(result[0].password)
            if(decrptPasswordData === query.password){
                return result;
            }else{
                throw new Error(messages.INCORRECT_PASSWORD);
            }
        }else{
            throw new Error(messages.INVALID_USER);
        }
      
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    getEmployeeLogin,
    getUserLogin
};