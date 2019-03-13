"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
// @ts-ignore
const notify_1 = require("ui/notify");
const common_1 = require("../../../../common");
const components_1 = require("../../../components");
const confirm_delete_modal_1 = require("../components/confirm_delete_modal");
const secure_space_message_1 = require("../components/secure_space_message");
const unauthorized_prompt_1 = require("../components/unauthorized_prompt");
class SpacesGridPage extends react_1.Component {
    constructor(props) {
        super(props);
        this.getConfirmDeleteModal = () => {
            if (!this.state.showConfirmDeleteModal || !this.state.selectedSpace) {
                return null;
            }
            const { spacesNavState, spacesManager } = this.props;
            return (react_1.default.createElement(confirm_delete_modal_1.ConfirmDeleteModal, { space: this.state.selectedSpace, spacesNavState: spacesNavState, spacesManager: spacesManager, onCancel: () => {
                    this.setState({
                        showConfirmDeleteModal: false,
                    });
                }, onConfirm: this.deleteSpace }));
        };
        this.deleteSpace = async () => {
            const { spacesManager, spacesNavState } = this.props;
            const space = this.state.selectedSpace;
            if (!space) {
                return;
            }
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
            this.loadGrid();
            const message = `Deleted "${space.name}" space.`;
            notify_1.toastNotifications.addSuccess(message);
            spacesNavState.refreshSpacesList();
        };
        this.loadGrid = () => {
            const { spacesManager } = this.props;
            this.setState({
                loading: true,
                spaces: [],
            });
            const setSpaces = (spaces) => {
                this.setState({
                    loading: false,
                    spaces,
                });
            };
            spacesManager
                .getSpaces()
                .then(spaces => {
                setSpaces(spaces);
            })
                .catch(error => {
                this.setState({
                    loading: false,
                    error,
                });
            });
        };
        this.onEditSpaceClick = (space) => {
            window.location.hash = `#/management/spaces/edit/${encodeURIComponent(space.id)}`;
        };
        this.onDeleteSpaceClick = (space) => {
            this.setState({
                selectedSpace: space,
                showConfirmDeleteModal: true,
            });
        };
        this.state = {
            spaces: [],
            loading: true,
            showConfirmDeleteModal: false,
            selectedSpace: null,
            error: null,
        };
    }
    componentDidMount() {
        this.loadGrid();
    }
    render() {
        return (react_1.default.createElement(eui_1.EuiPage, { restrictWidth: true, className: "spcGridPage" },
            react_1.default.createElement(eui_1.EuiPageBody, null,
                react_1.default.createElement(eui_1.EuiPageContent, { horizontalPosition: "center" }, this.getPageContent()),
                react_1.default.createElement(secure_space_message_1.SecureSpaceMessage, { userProfile: this.props.userProfile })),
            this.getConfirmDeleteModal()));
    }
    getPageContent() {
        if (!this.props.userProfile.hasCapability('manageSpaces')) {
            return react_1.default.createElement(unauthorized_prompt_1.UnauthorizedPrompt, null);
        }
        return (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(eui_1.EuiFlexGroup, { justifyContent: 'spaceBetween' },
                react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                    react_1.default.createElement(eui_1.EuiText, null,
                        react_1.default.createElement("h1", null, "Spaces"))),
                react_1.default.createElement(eui_1.EuiFlexItem, { grow: false }, this.getPrimaryActionButton())),
            react_1.default.createElement(eui_1.EuiSpacer, { size: 'xl' }),
            react_1.default.createElement(eui_1.EuiInMemoryTable, { itemId: 'id', items: this.state.spaces, columns: this.getColumnConfig(), hasActions: true, pagination: true, search: {
                    box: {
                        placeholder: 'Search',
                    },
                }, loading: this.state.loading, message: this.state.loading ? 'loading...' : undefined })));
    }
    getPrimaryActionButton() {
        return (react_1.default.createElement(eui_1.EuiButton, { fill: true, onClick: () => {
                window.location.hash = `#/management/spaces/create`;
            } }, "Create space"));
    }
    getColumnConfig() {
        return [
            {
                field: 'name',
                name: '',
                width: '50px',
                sortable: true,
                render: (value, record) => {
                    return (react_1.default.createElement(eui_1.EuiLink, { onClick: () => {
                            this.onEditSpaceClick(record);
                        } },
                        react_1.default.createElement(components_1.SpaceAvatar, { space: record, size: "s" })));
                },
            },
            {
                field: 'name',
                name: 'Space',
                sortable: true,
                render: (value, record) => {
                    return (react_1.default.createElement(eui_1.EuiLink, { onClick: () => {
                            this.onEditSpaceClick(record);
                        } }, value));
                },
            },
            {
                field: 'id',
                name: 'Identifier',
                sortable: true,
            },
            {
                field: 'description',
                name: 'Description',
                sortable: true,
            },
            {
                name: 'Actions',
                actions: [
                    {
                        name: 'Edit',
                        description: 'Edit this space.',
                        onClick: this.onEditSpaceClick,
                        type: 'icon',
                        icon: 'pencil',
                        color: 'primary',
                    },
                    {
                        available: (record) => !common_1.isReservedSpace(record),
                        name: 'Delete',
                        description: 'Delete this space.',
                        onClick: this.onDeleteSpaceClick,
                        type: 'icon',
                        icon: 'trash',
                        color: 'danger',
                    },
                ],
            },
        ];
    }
}
exports.SpacesGridPage = SpacesGridPage;
