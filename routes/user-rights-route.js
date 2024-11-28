"use strict";

const Validator = require('fastest-validator')
const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const userRightsServices = require("../service/user-rights-service");
const _ = require('lodash');

const schema = {
  // userRightsName: { type: "string", optional: false, min: 1, max: 100 }
}

async function getUserRights(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await userRightsServices.getUserRights(req.query);
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

async function createUserRights(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const validationResponse = await v.validate(req.body, schema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    } else {
      responseEntries.data = await userRightsServices.createUserRights(req.body);
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

async function updateUserRights(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const filteredSchema = _.pick(schema, Object.keys(req.body));
    const validationResponse = v.validate(req.body, filteredSchema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    } else {
      responseEntries.data = await userRightsServices.updateUserRights(req.params.userRightsId, req.body);
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
    url: '/user-rights',
    preHandler: verifyToken,
    handler: getUserRights
  });

  fastify.route({
    method: 'POST',
    url: '/user-rights',
    preHandler: verifyToken,
    handler: createUserRights
  });

  fastify.route({
    method: 'PUT',
    url: '/user-rights/:userRightsId',
    preHandler: verifyToken,
    handler: updateUserRights
  });
};