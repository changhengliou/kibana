"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const calculate_bucket_size_1 = require("./calculate_bucket_size");
const get_buckets_1 = require("./get_buckets");
function getDefaultSample(buckets) {
    const samples = buckets
        .filter(bucket => bucket.count > 0 && bucket.sample)
        .map(bucket => bucket.sample);
    if (lodash_1.isEmpty(samples)) {
        return;
    }
    const middleIndex = Math.floor(samples.length / 2);
    return samples[middleIndex];
}
async function getDistribution(serviceName, transactionName, setup) {
    const bucketSize = await calculate_bucket_size_1.calculateBucketSize(serviceName, transactionName, setup);
    const { buckets, totalHits } = await get_buckets_1.getBuckets(serviceName, transactionName, bucketSize, setup);
    return {
        totalHits,
        buckets,
        bucketSize,
        defaultSample: getDefaultSample(buckets)
    };
}
exports.getDistribution = getDistribution;
