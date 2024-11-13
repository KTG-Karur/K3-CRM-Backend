'use strict';

const Fastify = require('fastify');
const fastifyJWT = require('@fastify/jwt');
const routesPlugin = require('./routes');
const helmet = require('@fastify/helmet');

const fastify = Fastify();
//Swagger Docs---->
fastify.register(require('@fastify/swagger'));
fastify.register(require('@fastify/swagger-ui'), {
    routePrefix: '/docs',
});
//CORS------>
fastify.register(require("@fastify/cors", {
    origin: "*",
    allowedHeaders: [
        "origin",
        "X-Requested-With",
        "Accept",
        "Content-Type",
        "Authorization"
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTION"]
}));
//JWT---->
// fastify.register(fastifyJWT, {secret: "KtgUserToken@2011", verify :{
//     extractToken: (req)=> req.headers.auth
// }});

fastify.register(fastifyJWT, {
    secret: "KtgUserToken@2011",
    verify: {
        extractToken: (req) => {
            // Use Authorization header with Bearer scheme
            if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
                return req.headers.authorization.split(' ')[1];
            }
            throw new Error("Token not provided or in incorrect format");
        }
    }
});

//HELMET---->
fastify.register(helmet);
//ROUTE----->
fastify.register(routesPlugin);

module.exports = fastify;