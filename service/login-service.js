"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');
const { decrptPassword } = require('../utils/utility');
const { getRolePermission } = require('./role-permission-service');
const { getPage } = require('./page-service');

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
            //     iql += ` u.password = '${decrptPassword}'`;
            // }
            if (query.isActive) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` s.is_active = ${query.isActive}`;
            }
        }
        const result = await sequelize.query(`SELECT u.user_id "userId", user_name "userName", password,s.staff_id "staffId", s.staff_code "staffCode",CONCAT(s.first_name,' ',s.last_name) as staffName,
            r.role_name "roleName",r.role_id "roleId"
            FROM users u
            left join staffs s on s.user_id = u.user_id 
            left join role r on r.role_id = s.role_id  ${iql}`, {
            type: QueryTypes.SELECT,
            raw: true,
            nest: false
        });
        if (result.length > 0) {
            const decrptPasswordData = await decrptPassword(result[0]?.password)
            if (decrptPasswordData === query.password) {
                const queryReq = {
                    roleId: result[0].roleId
                }
                const rolePermission = await getRolePermission(queryReq)
                const pagesList = await getPage()

                const rolePermissionData = JSON.parse(rolePermission[0].accessIds)
                const rolePermissionArr = rolePermissionData.access
                const pagesData = [];
                let titleReq = {}
                const filterData = pagesList.map((page, index) => {
                    if (page.isTitle === 1) {
                        titleReq = {
                            pageId: page.pageId,
                            label: page.title,
                            isTitle: true
                        }
                    }
                    const permissionPage = _.filter(
                        rolePermissionArr, function (o) {

                            const titlePushed = pagesData.find(obj => {
                                return obj.pageId === titleReq.pageId;
                            });

                            if (o.pageId === page.pageId) {
                                if (!titlePushed) {
                                    pagesData.push(titleReq)
                                }
                                if (page.parentId) {
                                    let parentChecker = {}
                                    const resultData = pagesData.find((obj,index) => {
                                        if (obj.pageId === page.parentId) {
                                            parentChecker = {
                                                status: true,
                                                object: obj,
                                                indexData : index
                                            }
                                        } else {
                                            parentChecker = {
                                                status: false,
                                                object: obj
                                            }
                                        }
                                    });
                                    if (parentChecker.status) {
                                        const parentObject = parentChecker.object
                                        const childrenObj= {
                                            label: page.pageName,
                                            url: page.pageUrl,
                                            parentKey: parentObject.label,
                                        }
                                        const childrenArr = pagesData[parentChecker.indexData].children
                                        childrenArr.push(childrenObj)
                                        pagesData[parentChecker.indexData].children = childrenArr
                                    } else {
                                        let parentObject = _.filter(pagesList, (e) => {
                                            return e.pageId == page.parentId;
                                        });
                                        let data = {
                                            pageId: parentObject[0].pageId,
                                            label: parentObject[0].pageName,
                                            isTitle: false,
                                            icon: parentObject[0].iconName,
                                            children: []
                                        }
                                        data.children = [{
                                            label: page.pageName, 
                                            url: page.pageUrl,
                                            parentKey: parentObject[0].pageName,
                                        }]
                                        pagesData.push(data);
                                    }
                                } else if(page.pageUrl) {
                                    const requestData = {
                                        "pageId": page.pageId,
                                        "label": page.pageName,
                                        "isTitle": false,
                                        "icon": page.iconName,
                                        "url": page.pageUrl,
                                        "access": o.accessPermission.join(', ')
                                    };
                                    pagesData.push(requestData);
                                }
                            }
                        }
                    )
                })
                const returnRes=[
                    {
                        userId : result[0].userId,
                        staffId : result[0].staffId,
                        staffCode : result[0].staffCode,
                        staffName : result[0].staffName,
                        roleId : result[0].roleId,
                        roleName : result[0].roleName,
                        pagePermission: pagesData
                    }
                ]
                return returnRes;
            } else {
                throw new Error(messages.INCORRECT_PASSWORD);
            }
        } else {
            throw new Error(messages.INVALID_USER);
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
        if (result.length > 0) {
            const decrptPasswordData = await decrptPassword(result[0].password)
            if (decrptPasswordData === query.password) {
                return result;
            } else {
                throw new Error(messages.INCORRECT_PASSWORD);
            }
        } else {
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