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
// @ts-ignore
const notify_1 = require("ui/notify");
const confirm_delete_modal_1 = require("../components/confirm_delete_modal");
class DeleteSpacesButton extends react_1.Component {
    constructor() {
        super(...arguments);
        this.state = {
            showConfirmDeleteModal: false,
            showConfirmRedirectModal: false,
        };
        this.onDeleteClick = () => {
            this.setState({
                showConfirmDeleteModal: true,
            });
        };
        this.getConfirmDeleteModal = () => {
            if (!this.state.showConfirmDeleteModal) {
                return null;
            }
            const { spacesNavState, spacesManager } = this.props;
            return (react_1.default.createElement(confirm_delete_modal_1.ConfirmDeleteModal, { space: this.props.space, spacesNavState: spacesNavState, spacesManager: spacesManager, onCancel: () => {
                    this.setState({
                        showConfirmDeleteModal: false,
                    });
                }, onConfirm: this.deleteSpaces }));
        };
        this.deleteSpaces = async () => {
            const { spacesManager, space, spacesNavState } = this.props;
            try {
                await spacesManager.deleteSpace(space);
            }
            catch (error) {
                const { message: errorMessage = '' } = error.data || {};
                notify_1.toastNotifications.addDanger(`Error deleting space: ${errorMessage}`);
            }
            this.setState({
                showConfirmDeleteModal: false,
            });
            const message = `Deleted "${space.name}" space.`;
            notify_1.toastNotifications.addSuccess(message);
            if (this.props.onDelete) {
                this.props.onDelete();
            }
            spacesNavState.refreshSpacesList();
        };
    }
    render() {
        const buttonText = `Delete space`;
        let ButtonComponent = eui_1.EuiButton;
        const extraProps = {};
        if (this.props.style === 'icon') {
            ButtonComponent = eui_1.EuiButtonIcon;
            extraProps.iconType = 'trash';
        }
        return (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(ButtonComponent, Object.assign({ color: 'danger', onClick: this.onDeleteClick, "aria-label": 'Delete this space' }, extraProps), buttonText),
            this.getConfirmDeleteModal()));
    }
}
exports.DeleteSpacesButton = DeleteSpacesButton;
