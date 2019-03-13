"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const eui_1 = require("@elastic/eui");
const lodash_1 = require("lodash");
const react_1 = tslib_1.__importDefault(require("react"));
const EmptyMessage_1 = require("../../../shared/EmptyMessage");
const TransactionLink_1 = require("../../../shared/TransactionLink");
const ActionMenu_1 = require("./ActionMenu");
const StickyTransactionProperties_1 = require("./StickyTransactionProperties");
const TransactionPropertiesTable_1 = require("./TransactionPropertiesTable");
function MaybeViewTraceLink({ transaction, waterfall }) {
    // the traceroot cannot be found, so we cannot link to it
    if (!waterfall.traceRoot) {
        return (react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
            react_1.default.createElement(eui_1.EuiToolTip, { content: "The trace parent cannot be found" },
                react_1.default.createElement(eui_1.EuiButton, { iconType: "apmApp", disabled: true }, "View full trace"))));
    }
    const isRoot = transaction.transaction.id === waterfall.traceRoot.transaction.id;
    // the user is already viewing the full trace, so don't link to it
    if (isRoot) {
        return (react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
            react_1.default.createElement(eui_1.EuiToolTip, { content: "Currently viewing the full trace" },
                react_1.default.createElement(eui_1.EuiButton, { iconType: "apmApp", disabled: true }, "View full trace"))));
        // the user is viewing a zoomed in version of the trace. Link to the full trace
    }
    else {
        return (react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
            react_1.default.createElement(TransactionLink_1.TransactionLink, { transaction: waterfall.traceRoot },
                react_1.default.createElement(eui_1.EuiButton, { iconType: "apmApp" }, "View full trace"))));
    }
}
exports.Transaction = ({ transaction, urlParams, location, waterfall }) => {
    if (lodash_1.isEmpty(transaction)) {
        return (react_1.default.createElement(EmptyMessage_1.EmptyMessage, { heading: "No transaction sample available.", subheading: "Try another time range, reset the search filter or select another bucket from the distribution histogram." }));
    }
    return (react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "m" },
        react_1.default.createElement(eui_1.EuiFlexGroup, { justifyContent: "spaceBetween" },
            react_1.default.createElement(eui_1.EuiFlexItem, null,
                react_1.default.createElement(eui_1.EuiTitle, { size: "s" },
                    react_1.default.createElement("h5", null, "Transaction sample"))),
            react_1.default.createElement(eui_1.EuiFlexItem, null,
                react_1.default.createElement(eui_1.EuiFlexGroup, { justifyContent: "flexEnd" },
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                        react_1.default.createElement(ActionMenu_1.DiscoverTransactionLink, { transaction: transaction },
                            react_1.default.createElement(eui_1.EuiButtonEmpty, { iconType: "discoverApp" }, "View transaction in Discover"))),
                    react_1.default.createElement(MaybeViewTraceLink, { transaction: transaction, waterfall: waterfall })))),
        react_1.default.createElement(eui_1.EuiSpacer, null),
        react_1.default.createElement(StickyTransactionProperties_1.StickyTransactionProperties, { transaction: transaction, totalDuration: waterfall.traceRootDuration }),
        react_1.default.createElement(eui_1.EuiSpacer, null),
        react_1.default.createElement(TransactionPropertiesTable_1.TransactionPropertiesTable, { transaction: transaction, location: location, urlParams: urlParams, waterfall: waterfall })));
};
