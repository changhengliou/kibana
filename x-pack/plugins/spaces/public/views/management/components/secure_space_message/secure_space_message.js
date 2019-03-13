"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const eui_1 = require("@elastic/eui");
const react_1 = tslib_1.__importStar(require("react"));
exports.SecureSpaceMessage = (props) => {
    if (props.userProfile.hasCapability('manageSecurity')) {
        return (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(eui_1.EuiSpacer, null),
            react_1.default.createElement(eui_1.EuiText, { className: "eui-textCenter" },
                react_1.default.createElement("p", null,
                    "Want to assign a role to a space? Go to Management and select",
                    ' ',
                    react_1.default.createElement(eui_1.EuiLink, { href: "#/management/security/roles" }, "Roles"),
                    "."))));
    }
    return null;
};
