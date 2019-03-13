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
exports.UnauthorizedPrompt = () => (react_1.default.createElement(eui_1.EuiEmptyPrompt, { iconType: "spacesApp", iconColor: 'danger', title: react_1.default.createElement("h2", null, "Permission denied"), body: react_1.default.createElement("p", { "data-test-subj": "permissionDeniedMessage" }, "You do not have permission to manage spaces.") }));
