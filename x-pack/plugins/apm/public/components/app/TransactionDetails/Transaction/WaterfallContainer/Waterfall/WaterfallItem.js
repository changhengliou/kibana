"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const styled_components_1 = tslib_1.__importDefault(require("styled-components"));
const eui_1 = require("@elastic/eui");
const variables_1 = require("../../../../../../style/variables");
const Container = styled_components_1.default('div') `
  position: relative;
  display: block;
  user-select: none;
  padding-top: ${variables_1.px(variables_1.units.half)};
  padding-bottom: ${props => variables_1.px(props.type === 'span' ? variables_1.units.plus + variables_1.units.quarter : variables_1.units.plus)};
  margin-right: ${props => variables_1.px(props.timelineMargins.right)};
  margin-left: ${props => variables_1.px(props.timelineMargins.left)};
  border-top: 1px solid ${variables_1.colors.gray4};
  background-color: ${props => (props.isSelected ? variables_1.colors.gray5 : 'initial')};
  cursor: pointer;
  &:hover {
    background-color: ${variables_1.colors.gray5};
  }
`;
const ItemBar = styled_components_1.default('div') `
  box-sizing: border-box;
  position: relative;
  height: ${variables_1.px(variables_1.unit)};
  min-width: 2px;
  background-color: ${props => props.color};
`;
const ItemLabel = styled_components_1.default.div `
  white-space: nowrap;
  position: absolute;
  right: 0;
  width: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  text-align: left;
  margin: 0;
`;
const SpanLabel = styled_components_1.default(ItemLabel) `
  font-weight: normal;
  font-family: ${variables_1.fontFamilyCode};
  font-size: ${variables_1.fontSizes.small};
  bottom: ${variables_1.px(variables_1.units.half)};
`;
const TransactionLabel = styled_components_1.default(ItemLabel) `
  font-weight: 600;
  font-family: ${variables_1.fontFamily};
  font-size: ${variables_1.fontSize};
  bottom: ${variables_1.px(variables_1.units.quarter)};
`;
function Prefix({ item }) {
    if (item.docType !== 'transaction') {
        return null;
    }
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(eui_1.EuiIcon, { type: "merge" }),
        ' '));
}
function WaterfallItem({ timelineMargins, totalDuration, item, color, isSelected, onClick }) {
    if (!totalDuration) {
        return null;
    }
    const width = (item.duration / totalDuration) * 100;
    const left = ((item.offset + item.skew) / totalDuration) * 100;
    const Label = item.docType === 'span' ? SpanLabel : TransactionLabel;
    return (react_1.default.createElement(Container, { type: item.docType, timelineMargins: timelineMargins, isSelected: isSelected, onClick: onClick },
        react_1.default.createElement(ItemBar // using inline styles instead of props to avoid generating a css class for each item
        , { style: { left: `${left}%`, width: `${width}%` }, color: color, type: item.docType }),
        react_1.default.createElement(Label // using inline styles instead of props to avoid generating a css class for each item
        , { style: { minWidth: `${Math.max(100 - left, 0)}%` } },
            react_1.default.createElement(Prefix, { item: item }),
            " ",
            item.name)));
}
exports.WaterfallItem = WaterfallItem;
