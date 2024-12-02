"use strict";

const Validator = require('fastest-validator')
const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const settingWorkingDayServices = require("../service/setting-working-day-service");
const _ = require('lodash');

const schema = {
    //workDay: { type: "string", optional: false, min: 1 },
}

async function getSettingWorkingDay(req, res) {
    const responseEntries = new ResponseEntry();
    try {
        responseEntries.data = await settingWorkingDayServices.getSettingWorkingDay(req.query);
        if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
    } catch (error) {
        responseEntries.error = true;
        responseEntries.message = error.message ? error.message : error;
        responseEntries.code = responseCode.BAD_REQUEST;
    } finally {
        res.send(responseEntries);
    }
}

async function createSettingWorkingDay(req, res) {
    const responseEntries = new ResponseEntry();
    const v = new Validator()
    try {
        const validationResponse = await v.validate(req.body, schema)
        if (validationResponse != true) {
            throw new Error(messages.VALIDATION_FAILED);
        } else {
            responseEntries.data = await settingWorkingDayServices.createSettingWorkingDay(req.body);
            if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
        }
    } catch (error) {
        responseEntries.error = true;
        responseEntries.message = error.message ? error.message : error;
        responseEntries.code = responseCode.BAD_REQUEST;
        res.status(responseCode.BAD_REQUEST);
    } finally {
        res.send(responseEntries);
    }
}

async function updateSettingWorkingDay(req, res) {
    const responseEntries = new ResponseEntry();
    const v = new Validator()
    try {
        const filteredSchema = _.pick(schema, Object.keys(req.body));
        const validationResponse = v.validate(req.body, filteredSchema)
        if (validationResponse != true) {
            throw new Error(messages.VALIDATION_FAILED);
        } else {
            responseEntries.data = await settingWorkingDayServices.updateSettingWorkingDay(req.params.settingWorkingDayId, req.body);
            if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
        }
    } catch (error) {
        responseEntries.error = true;
        responseEntries.message = error.message ? error.message : error;
        responseEntries.code = error.code ? error.code : responseCode.BAD_REQUEST;
    } finally {
        res.send(responseEntries);
    }
}


module.exports = async function (fastify) {
    fastify.route({
        method: 'GET',
        url: '/setting-working-day',
        preHandler: verifyToken,
        handler: getSettingWorkingDay
    });

    fastify.route({
        method: 'POST',
        url: '/setting-working-day',
        preHandler: verifyToken,
        handler: createSettingWorkingDay
    });

    fastify.route({
        method: 'PUT',
        url: '/setting-working-day/:settingWorkingDayId',
        preHandler: verifyToken,
        handler: updateSettingWorkingDay
    });
};