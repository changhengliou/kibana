"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const humps_1 = require("humps");
const lodash_1 = require("lodash");
// @ts-ignore
const kuery_1 = require("../kuery");
// @ts-ignore
const callApi_1 = require("./callApi");
// @ts-ignore
const savedObjects_1 = require("./savedObjects");
async function loadLicense() {
    return callApi_1.callApi({
        pathname: `/api/xpack/v1/info`
    });
}
exports.loadLicense = loadLicense;
async function loadServerStatus() {
    return callApi_1.callApi({
        pathname: `/api/apm/status/server`
    });
}
exports.loadServerStatus = loadServerStatus;
async function loadAgentStatus() {
    return callApi_1.callApi({
        pathname: `/api/apm/status/agent`
    });
}
exports.loadAgentStatus = loadAgentStatus;
async function getEncodedEsQuery(kuery) {
    if (!kuery) {
        return;
    }
    const indexPattern = await savedObjects_1.getAPMIndexPattern();
    if (!indexPattern) {
        return;
    }
    const esFilterQuery = kuery_1.convertKueryToEsQuery(kuery, indexPattern);
    return encodeURIComponent(JSON.stringify(esFilterQuery));
}
exports.getEncodedEsQuery = getEncodedEsQuery;
async function loadServiceList({ start, end, kuery }) {
    return callApi_1.callApi({
        pathname: `/api/apm/services`,
        query: {
            start,
            end,
            esFilterQuery: await getEncodedEsQuery(kuery)
        }
    });
}
exports.loadServiceList = loadServiceList;
async function loadServiceDetails({ serviceName, start, end, kuery }) {
    return callApi_1.callApi({
        pathname: `/api/apm/services/${serviceName}`,
        query: {
            start,
            end,
            esFilterQuery: await getEncodedEsQuery(kuery)
        }
    });
}
exports.loadServiceDetails = loadServiceDetails;
async function loadTraceList({ start, end, kuery }) {
    const groups = await callApi_1.callApi({
        pathname: '/api/apm/traces',
        query: {
            start,
            end,
            esFilterQuery: await getEncodedEsQuery(kuery)
        }
    });
    return groups.map(group => {
        group.sample = addVersion(group.sample);
        return group;
    });
}
exports.loadTraceList = loadTraceList;
async function loadTransactionList({ serviceName, start, end, kuery, transactionType }) {
    const groups = await callApi_1.callApi({
        pathname: `/api/apm/services/${serviceName}/transactions`,
        query: {
            start,
            end,
            esFilterQuery: await getEncodedEsQuery(kuery),
            transaction_type: transactionType
        }
    });
    return groups.map(group => {
        group.sample = addVersion(group.sample);
        return group;
    });
}
exports.loadTransactionList = loadTransactionList;
async function loadTransactionDistribution({ serviceName, start, end, transactionName, kuery }) {
    return callApi_1.callApi({
        pathname: `/api/apm/services/${serviceName}/transactions/distribution`,
        query: {
            start,
            end,
            transaction_name: transactionName,
            esFilterQuery: await getEncodedEsQuery(kuery)
        }
    });
}
exports.loadTransactionDistribution = loadTransactionDistribution;
function addVersion(item) {
    if (!lodash_1.isEmpty(item)) {
        item.version = item.hasOwnProperty('trace') ? 'v2' : 'v1';
    }
    return item;
}
function addSpanId(hit, i) {
    if (!hit.span.id) {
        hit.span.id = i;
    }
    return hit;
}
async function loadSpans({ serviceName, start, end, transactionId }) {
    const hits = await callApi_1.callApi({
        pathname: `/api/apm/services/${serviceName}/transactions/${transactionId}/spans`,
        query: {
            start,
            end
        }
    });
    return hits.map(addVersion).map(addSpanId);
}
exports.loadSpans = loadSpans;
async function loadTrace({ traceId, start, end }) {
    const hits = await callApi_1.callApi({
        pathname: `/api/apm/traces/${traceId}`,
        query: {
            start,
            end
        }
    }, {
        camelcase: false
    });
    return hits.map(addVersion);
}
exports.loadTrace = loadTrace;
async function loadTransaction({ serviceName, start, end, transactionId, traceId, kuery }) {
    const result = await callApi_1.callApi({
        pathname: `/api/apm/services/${serviceName}/transactions/${transactionId}`,
        query: {
            traceId,
            start,
            end,
            esFilterQuery: await getEncodedEsQuery(kuery)
        }
    }, {
        camelcase: false
    });
    return addVersion(result);
}
exports.loadTransaction = loadTransaction;
async function loadCharts({ serviceName, start, end, kuery, transactionType, transactionName }) {
    return callApi_1.callApi({
        pathname: `/api/apm/services/${serviceName}/transactions/charts`,
        query: {
            start,
            end,
            esFilterQuery: await getEncodedEsQuery(kuery),
            transaction_type: transactionType,
            transaction_name: transactionName
        }
    });
}
exports.loadCharts = loadCharts;
async function loadErrorGroupList({ serviceName, start, end, kuery, size, sortField, sortDirection }) {
    return callApi_1.callApi({
        pathname: `/api/apm/services/${serviceName}/errors`,
        query: {
            start,
            end,
            size,
            sortField,
            sortDirection,
            esFilterQuery: await getEncodedEsQuery(kuery)
        }
    });
}
exports.loadErrorGroupList = loadErrorGroupList;
async function loadErrorGroupDetails({ serviceName, start, end, kuery, errorGroupId }) {
    const res = await callApi_1.callApi({
        pathname: `/api/apm/services/${serviceName}/errors/${errorGroupId}`,
        query: {
            start,
            end,
            esFilterQuery: await getEncodedEsQuery(kuery)
        }
    }, {
        camelcase: false
    });
    const camelizedRes = humps_1.camelizeKeys(res);
    if (res.error.context) {
        camelizedRes.error.context = res.error.context;
    }
    return camelizedRes;
}
exports.loadErrorGroupDetails = loadErrorGroupDetails;
async function loadErrorDistribution({ serviceName, start, end, kuery, errorGroupId }) {
    return callApi_1.callApi({
        pathname: `/api/apm/services/${serviceName}/errors/${errorGroupId}/distribution`,
        query: {
            start,
            end,
            esFilterQuery: await getEncodedEsQuery(kuery)
        }
    });
}
exports.loadErrorDistribution = loadErrorDistribution;
