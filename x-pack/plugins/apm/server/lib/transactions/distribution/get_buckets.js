"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ts_optchain_1 = require("ts-optchain");
const constants_1 = require("../../../../common/constants");
async function getBuckets(serviceName, transactionName, bucketSize, setup) {
    const { start, end, esFilterQuery, client, config } = setup;
    const bucketTargetCount = config.get('xpack.apm.bucketTargetCount');
    const params = {
        index: config.get('apm_oss.transactionIndices'),
        body: {
            size: 0,
            query: {
                bool: {
                    filter: [
                        { term: { [constants_1.SERVICE_NAME]: serviceName } },
                        { term: { [`${constants_1.TRANSACTION_NAME}.keyword`]: transactionName } },
                        {
                            range: {
                                '@timestamp': {
                                    gte: start,
                                    lte: end,
                                    format: 'epoch_millis'
                                }
                            }
                        }
                    ],
                    should: [{ term: { [constants_1.TRANSACTION_SAMPLED]: true } }]
                }
            },
            aggs: {
                distribution: {
                    histogram: {
                        field: constants_1.TRANSACTION_DURATION,
                        interval: bucketSize,
                        min_doc_count: 0,
                        extended_bounds: {
                            min: 0,
                            max: bucketSize * bucketTargetCount
                        }
                    },
                    aggs: {
                        sample: {
                            top_hits: {
                                _source: [constants_1.TRANSACTION_ID, constants_1.TRANSACTION_SAMPLED, constants_1.TRACE_ID],
                                size: 1
                            }
                        }
                    }
                }
            }
        }
    };
    if (esFilterQuery) {
        params.body.query.bool.filter.push(esFilterQuery);
    }
    const resp = await client('search', params);
    const buckets = resp.aggregations.distribution.buckets.map(bucket => {
        const sampleSource = ts_optchain_1.oc(bucket).sample.hits.hits[0]._source();
        const isSampled = ts_optchain_1.oc(sampleSource).transaction.sampled(false);
        const sample = {
            traceId: ts_optchain_1.oc(sampleSource).trace.id(),
            transactionId: ts_optchain_1.oc(sampleSource).transaction.id()
        };
        return {
            key: bucket.key,
            count: bucket.doc_count,
            sample: isSampled ? sample : undefined
        };
    });
    return {
        totalHits: resp.hits.total,
        buckets
    };
}
exports.getBuckets = getBuckets;
