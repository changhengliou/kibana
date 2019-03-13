"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
class SpacesGlobalNavButton extends react_1.Component {
    render() {
        return (react_1.default.createElement("div", { className: "global-nav-link" },
            react_1.default.createElement("a", { className: "global-nav-link__anchor", onClick: this.props.toggleSpaceSelector },
                react_1.default.createElement("div", { className: "global-nav-link__icon" },
                    " ",
                    this.props.linkIcon,
                    " "),
                react_1.default.createElement("div", { className: "global-nav-link__title" },
                    " ",
                    this.props.linkTitle,
                    " "))));
    }
}
exports.SpacesGlobalNavButton = SpacesGlobalNavButton;
