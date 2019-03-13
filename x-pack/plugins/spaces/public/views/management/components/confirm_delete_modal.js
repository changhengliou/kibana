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
class ConfirmDeleteModal extends react_1.Component {
    constructor() {
        super(...arguments);
        this.state = {
            confirmSpaceName: '',
            error: null,
            deleteInProgress: false,
        };
        this.onSpaceNameChange = (e) => {
            if (typeof this.state.error === 'boolean') {
                this.setState({
                    confirmSpaceName: e.target.value,
                    error: e.target.value !== this.props.space.name,
                });
            }
            else {
                this.setState({
                    confirmSpaceName: e.target.value,
                });
            }
        };
        this.onConfirm = async () => {
            if (this.state.confirmSpaceName === this.props.space.name) {
                const needsRedirect = isDeletingCurrentSpace(this.props.space, this.props.spacesNavState);
                const spacesManager = this.props.spacesManager;
                this.setState({
                    deleteInProgress: true,
                });
                await this.props.onConfirm();
                this.setState({
                    deleteInProgress: false,
                });
                if (needsRedirect) {
                    spacesManager.redirectToSpaceSelector();
                }
            }
            else {
                this.setState({
                    error: true,
                });
            }
        };
    }
    render() {
        const { space, spacesNavState, onCancel } = this.props;
        let warning = null;
        if (isDeletingCurrentSpace(space, spacesNavState)) {
            const name = (react_1.default.createElement("span", null,
                "(",
                react_1.default.createElement("strong", null, space.name),
                ")"));
            warning = (react_1.default.createElement(eui_1.EuiCallOut, { color: "warning" },
                react_1.default.createElement(eui_1.EuiText, null,
                    "You are about to delete your current space ",
                    name,
                    ". You will be redirected to choose a different space if you continue.")));
        }
        // This is largely the same as the built-in EuiConfirmModal component, but we needed the ability
        // to disable the buttons since this could be a long-running operation
        return (react_1.default.createElement(eui_1.EuiOverlayMask, null,
            react_1.default.createElement(eui_1.EuiModal, { onClose: onCancel, className: 'spcConfirmDeleteModal' },
                react_1.default.createElement(eui_1.EuiModalHeader, null,
                    react_1.default.createElement(eui_1.EuiModalHeaderTitle, { "data-test-subj": "confirmModalTitleText" },
                        "Delete space ",
                        `'${space.name}'`)),
                react_1.default.createElement(eui_1.EuiModalBody, null,
                    react_1.default.createElement(eui_1.EuiText, { "data-test-subj": "confirmModalBodyText" },
                        react_1.default.createElement("p", null,
                            "Deleting a space permanently removes the space and",
                            ' ',
                            react_1.default.createElement("strong", null, "all of its contents"),
                            ". You can't undo this action."),
                        react_1.default.createElement(eui_1.EuiFormRow, { label: 'Confirm space name', isInvalid: !!this.state.error, error: 'Space names do not match.' },
                            react_1.default.createElement(eui_1.EuiFieldText, { value: this.state.confirmSpaceName, onChange: this.onSpaceNameChange, disabled: this.state.deleteInProgress })),
                        warning)),
                react_1.default.createElement(eui_1.EuiModalFooter, null,
                    react_1.default.createElement(eui_1.EuiButtonEmpty, { "data-test-subj": "confirmModalCancelButton", onClick: onCancel, isDisabled: this.state.deleteInProgress }, "Cancel"),
                    react_1.default.createElement(eui_1.EuiButton, { "data-test-subj": "confirmModalConfirmButton", onClick: this.onConfirm, fill: true, color: 'danger', isLoading: this.state.deleteInProgress }, "Delete space and all contents")))));
    }
}
exports.ConfirmDeleteModal = ConfirmDeleteModal;
function isDeletingCurrentSpace(space, spacesNavState) {
    return space.id === spacesNavState.getActiveSpace().id;
}
