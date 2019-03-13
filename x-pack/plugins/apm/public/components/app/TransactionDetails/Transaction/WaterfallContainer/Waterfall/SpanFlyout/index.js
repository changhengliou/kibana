"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const eui_1 = require("@elastic/eui");
const lodash_1 = require("lodash");
const react_1 = tslib_1.__importDefault(require("react"));
const styled_components_1 = tslib_1.__importDefault(require("styled-components"));
// @ts-ignore
const constants_1 = require("../../../../../../../../common/constants");
const variables_1 = require("../../../../../../../style/variables");
// @ts-ignore
const Stacktrace_1 = tslib_1.__importDefault(require("../../../../../../shared/Stacktrace"));
const DatabaseContext_1 = require("./DatabaseContext");
const StickySpanProperties_1 = require("./StickySpanProperties");
const DiscoverButton_1 = require("../../../../../../shared/DiscoverButton");
const FlyoutTopLevelProperties_1 = require("../FlyoutTopLevelProperties");
const StackTraceContainer = styled_components_1.default.div `
  margin-top: ${variables_1.px(variables_1.unit)};
`;
function getDiscoverQuery(span) {
    return {
        _a: {
            interval: 'auto',
            query: {
                language: 'lucene',
                query: span.version === 'v2'
                    ? `${constants_1.SPAN_HEX_ID}:"${span.span.hex_id}"`
                    : `${constants_1.SPAN_ID}:"${span.span.id}"`
            }
        }
    };
}
function SpanFlyout({ span, parentTransaction, totalDuration, onClose }) {
    if (!span) {
        return null;
    }
    const stackframes = span.span.stacktrace;
    const codeLanguage = lodash_1.get(span, constants_1.SERVICE_LANGUAGE_NAME);
    const dbContext = span.context.db;
    return (react_1.default.createElement(eui_1.EuiPortal, null,
        react_1.default.createElement(eui_1.EuiFlyout, { onClose: onClose, size: "m", ownFocus: true },
            react_1.default.createElement(eui_1.EuiFlyoutHeader, { hasBorder: true },
                react_1.default.createElement(eui_1.EuiFlexGroup, null,
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                        react_1.default.createElement(eui_1.EuiTitle, null,
                            react_1.default.createElement("h2", null, "Span details"))),
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                        react_1.default.createElement(DiscoverButton_1.DiscoverButton, { query: getDiscoverQuery(span) }, `View span in Discover`)))),
            react_1.default.createElement(eui_1.EuiFlyoutBody, null,
                react_1.default.createElement(FlyoutTopLevelProperties_1.FlyoutTopLevelProperties, { transaction: parentTransaction }),
                react_1.default.createElement(eui_1.EuiHorizontalRule, null),
                react_1.default.createElement(StickySpanProperties_1.StickySpanProperties, { span: span, totalDuration: totalDuration }),
                react_1.default.createElement(eui_1.EuiHorizontalRule, null),
                react_1.default.createElement(DatabaseContext_1.DatabaseContext, { dbContext: dbContext }),
                react_1.default.createElement(StackTraceContainer, null,
                    react_1.default.createElement(Stacktrace_1.default, { stackframes: stackframes, codeLanguage: codeLanguage }))))));
}
exports.SpanFlyout = SpanFlyout;
