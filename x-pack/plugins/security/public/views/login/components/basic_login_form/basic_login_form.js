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
class BasicLoginForm extends react_1.Component {
    constructor() {
        super(...arguments);
        this.state = {
            hasError: false,
            isLoading: false,
            username: '',
            password: '',
            message: '',
        };
        this.renderMessage = () => {
            if (this.state.message) {
                return (react_1.default.createElement(react_1.Fragment, null,
                    react_1.default.createElement(eui_1.EuiCallOut, { size: "s", color: "danger", "data-test-subj": "loginErrorMessage", title: this.state.message, role: "alert" }),
                    react_1.default.createElement(eui_1.EuiSpacer, { size: "l" })));
            }
            if (this.props.infoMessage) {
                return (react_1.default.createElement(react_1.Fragment, null,
                    react_1.default.createElement(eui_1.EuiCallOut, { size: "s", color: "primary", "data-test-subj": "loginInfoMessage", title: this.props.infoMessage, role: "status" }),
                    react_1.default.createElement(eui_1.EuiSpacer, { size: "l" })));
            }
            return null;
        };
        this.isFormValid = () => {
            const { username, password } = this.state;
            return username && password;
        };
        this.onUsernameChange = (e) => {
            this.setState({
                username: e.target.value,
            });
        };
        this.onPasswordChange = (e) => {
            this.setState({
                password: e.target.value,
            });
        };
        this.submit = (e) => {
            e.preventDefault();
            if (!this.isFormValid()) {
                return;
            }
            this.setState({
                isLoading: true,
                message: '',
            });
            const { http, window, next } = this.props;
            const { username, password } = this.state;
            http.post('./api/security/v1/login', { username, password }).then(() => (window.location.href = next), (error) => {
                const { statusCode = 500 } = error.data || {};
                let message = 'Oops! Error. Try again.';
                if (statusCode === 401) {
                    message = 'Invalid username or password. Please try again.';
                }
                this.setState({
                    hasError: true,
                    message,
                    isLoading: false,
                });
            });
        };
    }
    render() {
        return (react_1.default.createElement(react_1.Fragment, null,
            this.renderMessage(),
            react_1.default.createElement(eui_1.EuiPanel, null,
                react_1.default.createElement("form", { onSubmit: this.submit },
                    react_1.default.createElement(eui_1.EuiFormRow, { label: "Username" },
                        react_1.default.createElement(eui_1.EuiFieldText, { id: "username", name: "username", "data-test-subj": "loginUsername", value: this.state.username, onChange: this.onUsernameChange, disabled: this.state.isLoading, isInvalid: false, "aria-required": true, inputRef: this.setUsernameInputRef })),
                    react_1.default.createElement(eui_1.EuiFormRow, { label: "Password" },
                        react_1.default.createElement(eui_1.EuiFieldText, { id: "password", name: "password", "data-test-subj": "loginPassword", type: "password", value: this.state.password, onChange: this.onPasswordChange, disabled: this.state.isLoading, isInvalid: false, "aria-required": true })),
                    react_1.default.createElement(eui_1.EuiButton, { fill: true, type: "submit", color: "primary", onClick: this.submit, isLoading: this.state.isLoading, "data-test-subj": "loginSubmit" }, "Log in")))));
    }
    setUsernameInputRef(ref) {
        if (ref) {
            ref.focus();
        }
    }
}
exports.BasicLoginForm = BasicLoginForm;
