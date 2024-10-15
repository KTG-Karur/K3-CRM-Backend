'use strict';

module.exports = function routesPlugin(fastify, opts, next) {
  fastify.register(require('./login-route'));
  fastify.register(require('./department-route'));
  fastify.register(require('./designation-route'));
  fastify.register(require('./role-route'));
  fastify.register(require('./user-route'));
  fastify.register(require('./bank-account-route'));
  next();
};