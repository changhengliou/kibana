"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ts_optchain_1 = require("ts-optchain");
const constants_1 = require("../../../common/constants");
async function getService(serviceName, setup) {
    const { start, end, esFilterQuery, client, config } = setup;
    const params = {
        index: [
            config.get('apm_oss.errorIndices'),
            config.get('apm_oss.transactionIndices')
        ],
        body: {
            size: 0,
            query: {
                bool: {
                    filter: [
                        { term: { [constants_1.SERVICE_NAME]: serviceName } },
                        {
                            range: {
                                '@timestamp': {
                                    gte: start,
                                    lte: end,
                                    format: 'epoch_millis'
                                }
                            }
                        }
                    ]
                }
            },
            aggs: {
                types: {
                    terms: { field: constants_1.TRANSACTION_TYPE, size: 100 }
                },
                agents: {
                    terms: { field: constants_1.SERVICE_AGENT_NAME, size: 1 }
                }
            }
        }
    };
    if (esFilterQuery) {
        params.body.query.bool.filter.push(esFilterQuery);
    }
    const resp = await client('search', params);
    const aggs = resp.aggregations;
    return {
        service_name: serviceName,
        types: aggs.types.buckets.map(bucket => bucket.key),
        agent_name: ts_optchain_1.oc(aggs).agents.buckets[0].key()
    };
}
exports.getService = getService;
