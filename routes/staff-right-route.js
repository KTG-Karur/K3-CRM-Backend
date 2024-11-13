"use strict";

const Validator = require('fastest-validator');
const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const staffRightServices = require("../service/staff-right-service");

const schema = {
    staffId: { type: "number", positive: true, integer: true },
    staffPermission: { type: "object", optional: true } 
};

async function getStaffRight(req, res) {
    const responseEntries = new ResponseEntry();
    try {
        responseEntries.data = await staffRightServices.getStaffRight(req.query);
        if (!responseEntries.data.length) responseEntries.message = messages.DATA_NOT_FOUND;
    } catch (error) {
        responseEntries.error = true;
        responseEntries.message = error.message || messages.OPERATION_ERROR;
        responseEntries.code = responseCode.BAD_REQUEST;
    } finally {
        res.send(responseEntries);
    }
}

async function createStaffRight(req, res) {
    const responseEntries = new ResponseEntry();
    const v = new Validator();
    try {
        const validationResponse = v.validate(req.body, schema);
        if (validationResponse !== true) {
            throw new Error(messages.VALIDATION_FAILED);
        }

        responseEntries.data = await staffRightServices.createStaffRight(req.body);
        if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
    } catch (error) {
        responseEntries.error = true;
        responseEntries.message = error.message || messages.OPERATION_ERROR;
        responseEntries.code = responseCode.BAD_REQUEST;
        res.status(responseCode.BAD_REQUEST);
    } finally {
        res.send(responseEntries);
    }
}

module.exports = async function (fastify) {
    fastify.route({
        method: 'GET',
        url: '/staff-right',
        preHandler: verifyToken,
        handler: getStaffRight
    });

    fastify.route({
        method: 'POST',
        url: '/staff-right',
        preHandler: verifyToken,
        handler: createStaffRight
    });
};
