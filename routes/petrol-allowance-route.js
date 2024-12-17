"use strict";

const Validator = require('fastest-validator')
const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const petrolAllowanceServices = require("../service/petrol-allowance-service");
const _ = require('lodash');

const schema = {
    staffId: "number|required|integer|positive",
    fromPlace: { type: "string", optional: false, min: 1, max: 100 },
    toPlace: { type: "string", optional: false, min: 1, max: 100 },
    activityId: { type: "string", optional: false, min: 1, max: 100 },
    // totalKm: { type: "string", optional: false, min: 1, max: 100 },
    // amount: { type: "string", optional: false, min: 1, max: 100 },
    // billNo: { type: "string", optional: false, min: 1, max: 100 },
}

async function getPetrolAllowance(req, res) {
    const responseEntries = new ResponseEntry();
    try {
        responseEntries.data = await petrolAllowanceServices.getPetrolAllowance(req.query);
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

async function getPetrolReportAllowance(req, res) {
    const responseEntries = new ResponseEntry();
    try {
        responseEntries.data = await petrolAllowanceServices.getPetrolReportAllowance(req.query);
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

async function createPetrolAllowance(req, res) {
    const responseEntries = new ResponseEntry();
    const v = new Validator()
    try {
        const validationResponse = await v.validate(req.body, schema)
        if (validationResponse != true) {
            throw new Error(messages.VALIDATION_FAILED);
        } else {
            responseEntries.data = await petrolAllowanceServices.createPetrolAllowance(req.body);
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

async function updatePetrolAllowance(req, res) {
    const responseEntries = new ResponseEntry();
    const v = new Validator()
    try {
        const filteredSchema = _.pick(schema, Object.keys(req.body));
        const validationResponse = v.validate(req.body, filteredSchema)
        if (validationResponse != true) {
            throw new Error(messages.VALIDATION_FAILED);
        } else {
            responseEntries.data = await petrolAllowanceServices.updatePetrolAllowance(req.params.petrolAllowanceId, req.body);
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
        url: '/petrol-allowance',
        preHandler: verifyToken,
        handler: getPetrolAllowance
    });

    fastify.route({
        method: 'GET',
        url: '/petrol-allowance-report',
        preHandler: verifyToken,
        handler: getPetrolReportAllowance
    });

    fastify.route({
        method: 'POST',
        url: '/petrol-allowance',
        preHandler: verifyToken,
        handler: createPetrolAllowance
    });

    fastify.route({
        method: 'PUT',
        url: '/petrol-allowance/:petrolAllowanceId',
        preHandler: verifyToken,
        handler: updatePetrolAllowance
    });
};