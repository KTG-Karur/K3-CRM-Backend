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
  fastify.register(require('./advance-payment-history-route'));
  fastify.register(require('./attendance-incharge-route'));
  fastify.register(require('./permission-route'));
  fastify.register(require('./setting-route'));
  fastify.register(require('./setting-benefit-route'));
  fastify.register(require('./setting-leave-deduction-route'));
  fastify.register(require('./setting-working-day-route'));
  fastify.register(require('./staff-advance-route'));
  fastify.register(require('./deputation-route'));
  fastify.register(require('./petrol-allowance-route'));
  fastify.register(require('./activity-route'));
  fastify.register(require('./claim-type-route'));
  fastify.register(require('./claim-route'));
  fastify.register(require('./branch-route'));
  fastify.register(require('./holiday-route'));
  fastify.register(require('./staff-work-experience-route'));
  fastify.register(require('./staff-qualification-route'));
  fastify.register(require('./staff-known-language-route'));
  fastify.register(require('./staff-proof-id-route'));
  fastify.register(require('./staff-relation-service'));
  fastify.register(require('./staff-proof-upload-route'));
  fastify.register(require('./staff-leave-route'));
  fastify.register(require("./staff-attendance-route"))
  next();
};