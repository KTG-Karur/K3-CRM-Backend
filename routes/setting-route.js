"use strict";

const Validator = require('fastest-validator')
const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const settingServices = require("../service/setting-service");
const _ = require('lodash');


  const schema = {    
    workDayId: { type: "string", optional: false, min: 1 },
    toDay: { type: "string", optional: false, min: 1, max: 100 },
    esiPercentage: { type: "string", optional: false, min: 1, max: 100 },
    pfPercentage: { type: "string", optional: false, min: 1, max: 100 },
    permissionDeduction: { type: "string", optional: false, min: 1, max: 100 },
    leaveDeduction: { type: "string", optional: false, min: 1, max: 100 },
  }


async function getSetting(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await settingServices.getSetting(req.query);
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

async function createSetting(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const validationResponse = await v.validate(req.body, schema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
    responseEntries.data = await settingServices.createSetting(req.body);
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

async function updateSetting(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const filteredSchema = _.pick(schema, Object.keys(req.body));
    const validationResponse = v.validate(req.body, filteredSchema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
      responseEntries.data = await settingServices.updateSetting(req.params.settingId, req.body);
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
    url: '/setting',
    preHandler: verifyToken,
    handler: getSetting
  });

  fastify.route({
    method: 'POST',
    url: '/setting',
    preHandler: verifyToken,
    handler: createSetting
  });

  fastify.route({
    method: 'PUT',
    url: '/setting/:settingId',
    preHandler: verifyToken,
    handler: updateSetting
  });
};