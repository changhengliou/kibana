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
const styled_components_1 = tslib_1.__importDefault(require("styled-components"));
const variables_1 = require("../../../../style/variables");
const url_1 = require("../../../../utils/url");
const PropertiesTable_1 = require("../../../shared/PropertiesTable");
const WaterfallContainer_1 = require("./WaterfallContainer");
const TableContainer = styled_components_1.default.div `
  padding: ${variables_1.px(variables_1.units.plus)} ${variables_1.px(variables_1.units.plus)} 0;
`;
// Ensure the selected tab exists or use the first
function getCurrentTab(tabs = [], selectedTab) {
    return selectedTab && tabs.includes(selectedTab) ? selectedTab : lodash_1.first(tabs);
}
const TIMELINE_TAB = 'timeline';
function getTabs(transactionData) {
    const dynamicProps = Object.keys(transactionData.context || {});
    return [TIMELINE_TAB, ...PropertiesTable_1.getPropertyTabNames(dynamicProps)];
}
function TransactionPropertiesTable({ location, transaction, urlParams, waterfall }) {
    const tabs = getTabs(transaction);
    const currentTab = getCurrentTab(tabs, urlParams.detailTab);
    const agentName = transaction.context.service.agent.name;
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(eui_1.EuiTabs, null, tabs.map(key => {
            return (react_1.default.createElement(eui_1.EuiTab, { onClick: () => {
                    url_1.history.replace({
                        ...location,
                        search: url_1.fromQuery({
                            ...url_1.toQuery(location.search),
                            detailTab: key
                        })
                    });
                }, isSelected: currentTab === key, key: key }, lodash_1.capitalize(key)));
        })),
        react_1.default.createElement(eui_1.EuiSpacer, null),
        currentTab === TIMELINE_TAB && (react_1.default.createElement(WaterfallContainer_1.WaterfallContainer, { transaction: transaction, location: location, urlParams: urlParams, waterfall: waterfall })),
        currentTab !== TIMELINE_TAB && (react_1.default.createElement(TableContainer, null,
            react_1.default.createElement(PropertiesTable_1.PropertiesTable, { propData: lodash_1.get(transaction.context, currentTab), propKey: currentTab, agentName: agentName })))));
}
exports.TransactionPropertiesTable = TransactionPropertiesTable;
