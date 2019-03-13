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
const constants_1 = require("x-pack/plugins/apm/common/constants");
const url_1 = require("x-pack/plugins/apm/public/utils/url");
function getDiscoverQuery(transactionId, traceId) {
    let query = `${constants_1.PROCESSOR_EVENT}:"transaction" AND ${constants_1.TRANSACTION_ID}:"${transactionId}"`;
    if (traceId) {
        query += ` AND ${constants_1.TRACE_ID}:"${traceId}"`;
    }
    return {
        _a: {
            interval: 'auto',
            query: {
                language: 'lucene',
                query
            }
        }
    };
}
function getInfraMetricsQuery(transaction) {
    const plus5 = new Date(transaction['@timestamp']);
    const minus5 = new Date(transaction['@timestamp']);
    plus5.setMinutes(plus5.getMinutes() + 5);
    minus5.setMinutes(minus5.getMinutes() - 5);
    return {
        from: minus5.getTime(),
        to: plus5.getTime()
    };
}
function ActionMenuButton({ onClick }) {
    return (react_1.default.createElement(eui_1.EuiButton, { iconType: "arrowDown", iconSide: "right", onClick: onClick }, "Actions"));
}
exports.DiscoverTransactionLink = ({ transaction, children }) => {
    const traceId = transaction.version === 'v2' ? transaction.trace.id : undefined;
    return (react_1.default.createElement(url_1.KibanaLink, { pathname: "/app/kibana", hash: "/discover", query: getDiscoverQuery(transaction.transaction.id, traceId), children: children }));
};
class ActionMenu extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            isOpen: false
        };
        this.toggle = () => {
            this.setState(state => ({ isOpen: !state.isOpen }));
        };
        this.close = () => {
            this.setState({ isOpen: false });
        };
    }
    getInfraActions(transaction) {
        const { system } = transaction.context;
        if (!system || !system.hostname) {
            return [];
        }
        return [
            react_1.default.createElement(eui_1.EuiContextMenuItem, { icon: "infraApp", key: "infra-host-metrics" },
                react_1.default.createElement(url_1.KibanaLink, { pathname: "/app/infra", hash: `/link-to/host-detail/${system.hostname}`, query: getInfraMetricsQuery(transaction) },
                    react_1.default.createElement("span", null, "View host metrics (beta)"))),
            react_1.default.createElement(eui_1.EuiContextMenuItem, { icon: "infraApp", key: "infra-host-logs" },
                react_1.default.createElement(url_1.KibanaLink, { pathname: "/app/infra", hash: `/link-to/host-logs/${system.hostname}`, query: { time: new Date(transaction['@timestamp']).getTime() } },
                    react_1.default.createElement("span", null, "View host logs (beta)")))
        ];
    }
    render() {
        const { transaction } = this.props;
        const items = [
            react_1.default.createElement(eui_1.EuiContextMenuItem, { icon: "discoverApp", key: "discover-transaction" },
                react_1.default.createElement(exports.DiscoverTransactionLink, { transaction: transaction }, "View sample document")),
            ...this.getInfraActions(transaction)
        ];
        return (react_1.default.createElement(eui_1.EuiPopover, { id: "transactionActionMenu", button: react_1.default.createElement(ActionMenuButton, { onClick: this.toggle }), isOpen: this.state.isOpen, closePopover: this.close, anchorPosition: "downRight", panelPaddingSize: "none" },
            react_1.default.createElement(eui_1.EuiContextMenuPanel, { items: items, title: "Actions" })));
    }
}
exports.ActionMenu = ActionMenu;
