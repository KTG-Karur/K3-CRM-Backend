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
        console.log(decrptPasswordData)
        console.log(query.password)
        if(decrptPasswordData === query.password){
            console.log("in---->")
            return result;
        }else{
            console.log("entered--->")
            throw new Error(messages.INCORRECT_PASSWORD);
        }
    } catch (error) {
        throw new Error(error);
    }
}

async function getUserLogin(query) {
    try {
        let iql = "";
        let replacements = [];
        let count = 0;
        
        if (query && Object.keys(query).length) {
            iql += `WHERE`;
            if (query.username) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` u.user_name = ?`;
                replacements.push(query.username);
            }
            if (query.isActive) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` u.is_active = ?`;
                replacements.push(query.isActive);
            }
        }

        const result = await sequelize.query(`SELECT 
            s.*, 
            r.role_name AS role_name, 
            u.password AS password
            FROM staffs s
            LEFT JOIN 
            users u ON u.user_id = s.user_id 
            LEFT JOIN 
            role r ON r.role_id = s.role_id  
            ${iql}`, {
            type: QueryTypes.SELECT,
            raw: true,
            replacements
        });

        if (result.length === 0) {
            throw new Error(messages.INVALID_USER);
        }

        const existingRight = await sequelize.query(
            `SELECT staff_right_permission FROM staff_rights WHERE staff_id = ?`,
            { replacements: [result[0].staff_id], type: QueryTypes.SELECT }
        );
        
        if (existingRight.length > 0) {
            result[0].userRights = JSON.parse(existingRight[0].staff_right_permission);
        }

        const decryptedPassword = await decrptPassword(result[0].password);
        if (decryptedPassword === query.password) {
            return result[0];
        } else {
            throw new Error(messages.INCORRECT_PASSWORD);
        }
    } catch (error) {
        throw new Error(`Error in getUserLogin: ${error.message}`);
    }
}

module.exports = {
    getEmployeeLogin,
    getUserLogin
};