"use strict";

const Validator = require('fastest-validator')
const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const bankAccountServices = require("../service/bank-account-service");
const _ = require('lodash');

const schema = {
  accountHolderName: { type: "string", optional: false, min:1, max: 100 },
  bankName: { type: "string", optional: false, min:1, max: 100 },
  branchName: { type: "string", optional: false, min:1, max: 100 },
  accountNo: { type: "string", optional: false, min:1, max: 100 },
  ifscCode: { type: "string", optional: false, min:1, max: 100 },
}

async function getBankAccount(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await bankAccountServices.getBankAccount(req.query);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = responseCode.BAD_REQUEST;
  } finally {
    res.send(responseEntries);
  }
}

async function createBankAccount(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const validationResponse = await v.validate(req.body, schema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
    responseEntries.data = await bankAccountServices.createBankAccount(req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
    }
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = responseCode.BAD_REQUEST;
  } finally {
    res.send(responseEntries);
  }
}

async function updateBankAccount(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const filteredSchema = _.pick(schema, Object.keys(req.body));
    const validationResponse = v.validate(req.body, filteredSchema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
      responseEntries.data = await bankAccountServices.updateBankAccount(req.params.bankAccountId, req.body);
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

async function deleteBankAccount(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await bankAccountServices.deleteBankAccount(req.params.bankAccountId);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
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
    url: '/bank-account',
    preHandler: verifyToken,
    handler: getBankAccount
  });

  fastify.route({
    method: 'POST',
    url: '/bank-account',
    preHandler: verifyToken,
    handler: createBankAccount
  });

  fastify.route({
    method: 'PUT',
    url: '/bank-account/:bankAccountId',
    preHandler: verifyToken,
    handler: updateBankAccount
  });

  fastify.route({
    method: 'DELETE',
    url: '/bank-account/:bankAccountId',
    preHandler: verifyToken,
    handler: deleteBankAccount
  });
};