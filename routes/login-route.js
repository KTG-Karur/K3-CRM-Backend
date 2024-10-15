"use strict";

const fastify = require("../app");
const { verifyToken } = require("../middleware/auth");
const Validator = require('fastest-validator')
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const _ = require('lodash');
const loginServices = require("../service/login-service");


async function getEmployeeLogin(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await loginServices.getEmployeeLogin(req.query);
    const data  = req.query
    const token = fastify.jwt.sign({email : data.email})
    responseEntries.token = token
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message;
    responseEntries.code = responseCode.UNAUTHORIZED;
    responseEntries.token = null
  } finally {
    res.send(responseEntries);
  }
}

async function getUserLogin(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await loginServices.getUserLogin(req.query);
    const data  = req.query
    const token = fastify.jwt.sign({email : data.userName})
    responseEntries.token = token
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message;
    responseEntries.code = responseCode.UNAUTHORIZED;
    responseEntries.token = null
  } finally {
    res.send(responseEntries);
  }
}

function getEmployee(req, res){
    console.log("login---<>"+req)
    const email = "vensrini0414@gmail.com"
    // const token = fastify.jwt.sign({email : email}, { expiresIn: '1h' })
    const token = fastify.jwt.sign({email : email}, { expiresIn: '1h' })
    res.send({ hello: 'world',token : token })
}

function createEmployee(req, res){
  res.send({ hello: 'world'})
}


module.exports = async function (fastify) {
    fastify.route({
      method: 'GET',
      url: '/login',
      handler: getEmployee
    });

    fastify.route({
      method: 'GET',
      url: '/user-login',
      handler: getUserLogin
    });

    fastify.route({
      method: 'GET',
      url: '/organization-login',
      handler: getEmployeeLogin
    });
  
    fastify.route({
      method: 'POST',
      url: '/login',
      preHandler: verifyToken,
      handler: createEmployee
    });
  };