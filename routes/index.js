'use strict';

module.exports = function routesPlugin(fastify, opts, next) {
  fastify.register(require('./login-route'));
  fastify.register(require('./department-route'));
  fastify.register(require('./designation-route'));
  fastify.register(require('./staff-route'));
  fastify.register(require('./role-route'));
  fastify.register(require('./user-route'));
  fastify.register(require('./bank-account-route'));
  fastify.register(require('./proof-type-route'));
  fastify.register(require('./transfer-staff-route'));
  fastify.register(require('./staff-advance-route'));
  fastify.register(require('./deputation-route'));
  fastify.register(require('./petrol-allowance-route'));
  fastify.register(require('./activity-route'));
  fastify.register(require('./claim-type-route'));
  fastify.register(require('./claim-route'));
  fastify.register(require('./branch-route'));
  fastify.register(require('./holiday-route'));
  next();
};