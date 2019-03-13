"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const moment_1 = tslib_1.__importDefault(require("moment"));
function decodeEsQuery(esQuery) {
    return esQuery ? JSON.parse(decodeURIComponent(esQuery)) : null;
}
function setupRequest(req, reply) {
    const cluster = req.server.plugins.elasticsearch.getCluster('data');
    function client(type, params) {
        if (req.query._debug) {
            console.log(`DEBUG ES QUERY:`);
            console.log(`${req.method.toUpperCase()} ${req.url.pathname} ${JSON.stringify(req.query)}`);
            console.log(`GET ${params.index}/_search`);
            console.log(JSON.stringify(params.body, null, 4));
        }
        return cluster.callWithRequest(req, type, params);
    }
    const setup = {
        start: moment_1.default.utc(req.query.start).valueOf(),
        end: moment_1.default.utc(req.query.end).valueOf(),
        esFilterQuery: decodeEsQuery(req.query.esFilterQuery),
        client,
        config: req.server.config()
    };
    reply(setup);
}
exports.setupRequest = setupRequest;
