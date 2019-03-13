"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const constants_1 = require("x-pack/plugins/apm/common/constants");
const StickyProperties_1 = require("x-pack/plugins/apm/public/components/shared/StickyProperties");
const TransactionLink_1 = require("x-pack/plugins/apm/public/components/shared/TransactionLink");
const url_1 = require("x-pack/plugins/apm/public/utils/url");
function FlyoutTopLevelProperties({ transaction }) {
    if (!transaction) {
        return null;
    }
    const stickyProperties = [
        {
            label: 'Service',
            fieldName: constants_1.SERVICE_NAME,
            val: (react_1.default.createElement(url_1.KibanaLink, { pathname: '/app/apm', hash: `/${transaction.context.service.name}` }, transaction.context.service.name)),
            width: '50%'
        },
        {
            label: 'Transaction',
            fieldName: constants_1.TRANSACTION_NAME,
            val: (react_1.default.createElement(TransactionLink_1.TransactionLink, { transaction: transaction }, transaction.transaction.name)),
            width: '50%'
        }
    ];
    return react_1.default.createElement(StickyProperties_1.StickyProperties, { stickyProperties: stickyProperties });
}
exports.FlyoutTopLevelProperties = FlyoutTopLevelProperties;
