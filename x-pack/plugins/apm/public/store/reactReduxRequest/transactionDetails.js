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
const ID = 'transactionDetails';
const INITIAL_DATA = {};
const withInitialData = helpers_1.createInitialDataSelector(INITIAL_DATA);
function getTransactionDetails(state) {
    return withInitialData(state.reactReduxRequest[ID]);
}
exports.getTransactionDetails = getTransactionDetails;
function TransactionDetailsRequest({ urlParams, render }) {
    const { serviceName, start, end, transactionId, traceId, kuery } = urlParams;
    if (!(serviceName && start && end && transactionId)) {
        return null;
    }
    return (react_1.default.createElement(react_redux_request_1.Request, { id: ID, fn: apm_1.loadTransaction, selector: getTransactionDetails, args: [{ serviceName, start, end, transactionId, traceId, kuery }], render: render }));
}
exports.TransactionDetailsRequest = TransactionDetailsRequest;
