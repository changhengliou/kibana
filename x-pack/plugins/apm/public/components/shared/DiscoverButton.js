"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// @ts-ignore
const eui_1 = require("@elastic/eui");
const react_1 = tslib_1.__importDefault(require("react"));
const url_1 = require("../../utils/url");
function DiscoverButton({ query, children, ...rest }) {
    return (react_1.default.createElement(url_1.KibanaLink, Object.assign({ pathname: '/app/kibana', hash: '/discover', query: query }, rest),
        react_1.default.createElement(eui_1.EuiButtonEmpty, { iconType: "discoverApp" }, children || 'View in Discover')));
}
exports.DiscoverButton = DiscoverButton;
