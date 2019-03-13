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
const constants_1 = require("../lib/constants");
class ManageSpacesButton extends react_1.Component {
    constructor() {
        super(...arguments);
        this.navigateToManageSpaces = () => {
            if (this.props.onClick) {
                this.props.onClick();
            }
            window.location.replace(constants_1.MANAGE_SPACES_URL);
        };
    }
    render() {
        if (!this.props.userProfile.hasCapability('manageSpaces')) {
            return null;
        }
        return (react_1.default.createElement(eui_1.EuiButton, { size: this.props.size || 's', className: this.props.className, isDisabled: this.props.isDisabled, onClick: this.navigateToManageSpaces, style: this.props.style }, "Manage spaces"));
    }
}
exports.ManageSpacesButton = ManageSpacesButton;
