"use strict";

const Validator = require('fastest-validator')
const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const settingBenefitServices = require("../service/setting-benefit-service");
const _ = require('lodash');

const schema = {
    
    benefitPercentage: { type: "string", optional: false, min: 1, max: 100 },
    benefitName: { type: "string", optional: false, min: 1, max: 100 },
    //activityId: { type: "string", optional: false, min: 1, max: 100 },
    // totalKm: { type: "string", optional: false, min: 1, max: 100 },
    // amount: { type: "string", optional: false, min: 1, max: 100 },
    // billNo: { type: "string", optional: false, min: 1, max: 100 },
}

async function getSettingBenefit(req, res) {
    const responseEntries = new ResponseEntry();
    try {
        responseEntries.data = await settingBenefitServices.getSettingBenefit(req.query);
        if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
    } catch (error) {
        responseEntries.error = true;
        responseEntries.message = error.message ? error.message : error;
        responseEntries.code = responseCode.BAD_REQUEST;
        res.status(responseCode.BAD_REQUEST);
    } finally {
        res.send(responseEntries);
    }
}

async function createSettingBenefit(req, res) {
    const responseEntries = new ResponseEntry();
    const v = new Validator()
    try {
        const validationResponse = await v.validate(req.body, schema)
        if (validationResponse != true) {
            throw new Error(messages.VALIDATION_FAILED);
        } else {
            responseEntries.data = await settingBenefitServices.createSettingBenefit(req.body);
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

async function updateSettingBenefit(req, res) {
    const responseEntries = new ResponseEntry();
    const v = new Validator()
    try {
        const filteredSchema = _.pick(schema, Object.keys(req.body));
        const validationResponse = v.validate(req.body, filteredSchema)
        if (validationResponse != true) {
            throw new Error(messages.VALIDATION_FAILED);
        } else {
            responseEntries.data = await settingBenefitServices.updateSettingBenefit(req.params.settingBenefitId, req.body);
            if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
        }
    } catch (error) {
        responseEntries.error = true;
        responseEntries.message = error.message ? error.message : error;
        responseEntries.code = error.code ? error.code : responseCode.BAD_REQUEST;
        res.status(responseCode.BAD_REQUEST);
    } finally {
        res.send(responseEntries);
    }
}


module.exports = async function (fastify) {
    fastify.route({
        method: 'GET',
        url: '/setting-benefit',
        preHandler: verifyToken,
        handler: getSettingBenefit
    });

    fastify.route({
        method: 'POST',
        url: '/setting-benefit',
        preHandler: verifyToken,
        handler: createSettingBenefit
    });

    fastify.route({
        method: 'PUT',
        url: '/setting-benefit/:settingBenefitId',
        preHandler: verifyToken,
        handler: updateSettingBenefit
    });
};