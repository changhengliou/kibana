"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const react_redux_request_1 = require("react-redux-request");
const apm_1 = require("../../services/rest/apm");
// @ts-ignore
const helpers_1 = require("./helpers");
const ID = 'transactionDistribution';
const INITIAL_DATA = { buckets: [], totalHits: 0 };
const withInitialData = helpers_1.createInitialDataSelector(INITIAL_DATA);
function getTransactionDistribution(state) {
    return withInitialData(state.reactReduxRequest[ID]);
}
exports.getTransactionDistribution = getTransactionDistribution;
function getDefaultDistributionSample(state) {
    const distribution = getTransactionDistribution(state);
    const { defaultSample = {} } = distribution.data;
    return {
        traceId: defaultSample.traceId,
        transactionId: defaultSample.transactionId
    };
}
exports.getDefaultDistributionSample = getDefaultDistributionSample;
function TransactionDistributionRequest({ urlParams, render }) {
    const { serviceName, start, end, transactionName, kuery } = urlParams;
    if (!(serviceName && start && end && transactionName)) {
        return null;
    }
    return (react_1.default.createElement(react_redux_request_1.Request, { id: ID, fn: apm_1.loadTransactionDistribution, args: [{ serviceName, start, end, transactionName, kuery }], selector: getTransactionDistribution, render: render }));
}
exports.TransactionDistributionRequest = TransactionDistributionRequest;
