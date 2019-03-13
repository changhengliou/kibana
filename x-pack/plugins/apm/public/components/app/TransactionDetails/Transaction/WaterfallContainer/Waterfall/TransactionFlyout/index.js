"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const eui_1 = require("@elastic/eui");
const react_1 = tslib_1.__importDefault(require("react"));
const ActionMenu_1 = require("../../../ActionMenu");
const StickyTransactionProperties_1 = require("../../../StickyTransactionProperties");
const TransactionPropertiesTableForFlyout_1 = require("../../../TransactionPropertiesTableForFlyout");
const FlyoutTopLevelProperties_1 = require("../FlyoutTopLevelProperties");
function TransactionFlyout({ transaction: transactionDoc, onClose, location, urlParams, waterfall }) {
    if (!transactionDoc) {
        return null;
    }
    return (react_1.default.createElement(eui_1.EuiPortal, null,
        react_1.default.createElement(eui_1.EuiFlyout, { onClose: onClose, size: "m", ownFocus: true },
            react_1.default.createElement(eui_1.EuiFlyoutHeader, { hasBorder: true },
                react_1.default.createElement(eui_1.EuiFlexGroup, null,
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                        react_1.default.createElement(eui_1.EuiTitle, null,
                            react_1.default.createElement("h4", null, "Transaction details"))),
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                        react_1.default.createElement(ActionMenu_1.DiscoverTransactionLink, { transaction: transactionDoc },
                            react_1.default.createElement(eui_1.EuiButtonEmpty, { iconType: "discoverApp" }, "View transaction in Discover"))))),
            react_1.default.createElement(eui_1.EuiFlyoutBody, null,
                react_1.default.createElement(FlyoutTopLevelProperties_1.FlyoutTopLevelProperties, { transaction: transactionDoc }),
                react_1.default.createElement(eui_1.EuiHorizontalRule, null),
                react_1.default.createElement(StickyTransactionProperties_1.StickyTransactionProperties, { transaction: transactionDoc, totalDuration: waterfall.traceRootDuration }),
                react_1.default.createElement(eui_1.EuiHorizontalRule, null),
                react_1.default.createElement(TransactionPropertiesTableForFlyout_1.TransactionPropertiesTableForFlyout, { transaction: transactionDoc, location: location, urlParams: urlParams })))));
}
exports.TransactionFlyout = TransactionFlyout;
