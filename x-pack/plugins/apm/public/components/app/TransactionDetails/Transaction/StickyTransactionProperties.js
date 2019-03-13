"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const react_1 = tslib_1.__importDefault(require("react"));
const constants_1 = require("../../../../../common/constants");
const formatters_1 = require("../../../../utils/formatters");
const StickyProperties_1 = require("../../../shared/StickyProperties");
function StickyTransactionProperties({ transaction, totalDuration }) {
    const timestamp = transaction['@timestamp'];
    const url = lodash_1.get(transaction, constants_1.REQUEST_URL_FULL, 'N/A');
    const duration = transaction.transaction.duration.us;
    const stickyProperties = [
        {
            label: 'Timestamp',
            fieldName: '@timestamp',
            val: timestamp,
            truncated: true,
            width: '50%'
        },
        {
            fieldName: constants_1.REQUEST_URL_FULL,
            label: 'URL',
            val: url,
            truncated: true,
            width: '50%'
        },
        {
            label: 'Duration',
            fieldName: constants_1.TRANSACTION_DURATION,
            val: duration ? formatters_1.asTime(duration) : 'N/A',
            width: '25%'
        },
        {
            label: '% of trace',
            val: formatters_1.asPercent(duration, totalDuration, 'N/A'),
            width: '25%'
        },
        {
            label: 'Result',
            fieldName: constants_1.TRANSACTION_RESULT,
            val: lodash_1.get(transaction, constants_1.TRANSACTION_RESULT, 'N/A'),
            width: '25%'
        },
        {
            label: 'User ID',
            fieldName: constants_1.USER_ID,
            val: lodash_1.get(transaction, constants_1.USER_ID, 'N/A'),
            truncated: true,
            width: '25%'
        }
    ];
    return react_1.default.createElement(StickyProperties_1.StickyProperties, { stickyProperties: stickyProperties });
}
exports.StickyTransactionProperties = StickyTransactionProperties;
