"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const eui_1 = require("@elastic/eui");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const react_1 = tslib_1.__importDefault(require("react"));
const styled_components_1 = tslib_1.__importDefault(require("styled-components"));
const variables_1 = require("../../../style/variables");
const agents_1 = require("../../../utils/documentation/agents");
// @ts-ignore
const url_1 = require("../../../utils/url");
const NestedKeyValueTable_1 = require("./NestedKeyValueTable");
const propertyConfig_json_1 = tslib_1.__importDefault(require("./propertyConfig.json"));
const indexedPropertyConfig = lodash_1.default.indexBy(propertyConfig_json_1.default, 'key');
const TableContainer = styled_components_1.default.div `
  padding-bottom: ${variables_1.px(variables_1.units.double)};
`;
const TableInfo = styled_components_1.default.div `
  padding: ${variables_1.px(variables_1.unit)} 0 0;
  text-align: center;
  font-size: ${variables_1.fontSize};
  color: ${variables_1.colors.gray2};
  line-height: 1.5;
`;
const TableInfoHeader = styled_components_1.default(TableInfo) `
  font-size: ${variables_1.fontSizes.large};
  color: ${variables_1.colors.black2};
`;
const EuiIconWithSpace = styled_components_1.default(eui_1.EuiIcon) `
  margin-right: ${variables_1.px(variables_1.units.half)};
`;
function getPropertyTabNames(selected) {
    return propertyConfig_json_1.default.filter(({ key, required }) => required || selected.includes(key)).map(({ key }) => key);
}
exports.getPropertyTabNames = getPropertyTabNames;
function getAgentFeatureText(featureName) {
    switch (featureName) {
        case 'user':
            return 'You can configure your agent to add contextual information about your users.';
        case 'tags':
            return 'You can configure your agent to add filterable tags on transactions.';
        case 'custom':
            return 'You can configure your agent to add custom contextual information on transactions.';
    }
}
function AgentFeatureTipMessage({ featureName, agentName }) {
    const docsUrl = agents_1.getAgentFeatureDocsUrl(featureName, agentName);
    if (!docsUrl) {
        return null;
    }
    return (react_1.default.createElement(TableInfo, null,
        react_1.default.createElement(EuiIconWithSpace, { type: "iInCircle" }),
        getAgentFeatureText(featureName),
        ' ',
        react_1.default.createElement(url_1.ExternalLink, { href: docsUrl }, "Learn more in the documentation.")));
}
exports.AgentFeatureTipMessage = AgentFeatureTipMessage;
exports.sortKeysByConfig = (object, currentKey) => {
    const presorted = lodash_1.default.get(indexedPropertyConfig, `${currentKey}.presortedKeys`, []);
    return lodash_1.default.uniq([...presorted, ...Object.keys(object).sort()]);
};
function PropertiesTable({ propData, propKey, agentName }) {
    const hasPropData = !lodash_1.default.isEmpty(propData);
    return (react_1.default.createElement(TableContainer, null,
        hasPropData ? (react_1.default.createElement(NestedKeyValueTable_1.NestedKeyValueTable, { data: propData, parentKey: propKey, keySorter: exports.sortKeysByConfig, depth: 1 })) : (react_1.default.createElement(TableInfoHeader, null, "No data available")),
        react_1.default.createElement(AgentFeatureTipMessage, { featureName: propKey, agentName: agentName })));
}
exports.PropertiesTable = PropertiesTable;
