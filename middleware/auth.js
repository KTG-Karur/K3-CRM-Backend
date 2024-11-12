const { UNAUTHORIZED } = require("../helpers/status-code");
const sequelize = require('../models/index').sequelize;
const { QueryTypes } = require('sequelize');

// Token verification middleware
async function verifyToken(req, reply) {
    try {
        const decoded = await req.jwtVerify();
        console.log('decoded', decoded);

        const result = await sequelize.query(`SELECT 
            s.*, 
            r.role_name AS role_name, 
            u.password AS password
            FROM staffs s
            left join 
            users u on u.user_id = s.user_id 
            left join 
            role r on r.role_id = s.role_id  
            where u.user_id = ${decoded.user_id}`, {
            type: QueryTypes.SELECT,
            raw: true,
            nest: false
        });
        if (result.length > 0) {
            req.auth = result[0];
            return { success: true };
        } else {
            return reply.code(401).send({
                code: UNAUTHORIZED,
                message: "Invalid Token!"
            });
        }
    } catch (error) {
        return reply.code(401).send({
            code: UNAUTHORIZED,
            message: "Access Denied!",
            error: error.message || error
        });
    }
}

module.exports = {
    verifyToken,
};