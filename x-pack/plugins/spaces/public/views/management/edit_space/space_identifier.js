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
class SpaceIdentifier extends react_1.Component {
    constructor(props) {
        super(props);
        this.textFieldRef = null;
        this.getLabel = () => {
            if (!this.props.editable) {
                return (react_1.default.createElement("p", null, "URL identifier"));
            }
            const editLinkText = this.state.editing ? `[stop editing]` : `[edit]`;
            return (react_1.default.createElement("p", null,
                "URL identifier ",
                react_1.default.createElement(eui_1.EuiLink, { onClick: this.onEditClick }, editLinkText)));
        };
        this.getHelpText = () => {
            return (react_1.default.createElement("p", null,
                "If the identifier is ",
                react_1.default.createElement("strong", null, "engineering"),
                ", the Kibana URL is ",
                react_1.default.createElement("br", null),
                " https://my-kibana.example",
                react_1.default.createElement("strong", null, "/s/engineering/"),
                "app/kibana."));
        };
        this.onEditClick = () => {
            this.setState({
                editing: !this.state.editing
            }, () => {
                if (this.textFieldRef && this.state.editing) {
                    this.textFieldRef.focus();
                }
            });
        };
        this.onChange = (e) => {
            if (!this.state.editing) {
                return;
            }
            this.props.onChange(e);
        };
        this.state = {
            editing: false,
        };
    }
    render() {
        const { id = '' } = this.props.space;
        return (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(eui_1.EuiFormRow, Object.assign({ label: this.getLabel(), helpText: this.getHelpText() }, this.props.validator.validateURLIdentifier(this.props.space), { fullWidth: true }),
                react_1.default.createElement(eui_1.EuiFieldText, { readOnly: !this.state.editing, placeholder: this.state.editing || !this.props.editable
                        ? undefined
                        : 'The URL identifier is generated from the space name.', value: id, onChange: this.onChange, inputRef: (ref) => this.textFieldRef = ref, fullWidth: true }))));
    }
}
exports.SpaceIdentifier = SpaceIdentifier;
