"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// tslint:disable-next-line  no-var-requires
const react_1 = tslib_1.__importDefault(require("react"));
const lodash_1 = require("lodash");
const formatters_1 = require("../../../../../../../utils/formatters");
const StickyProperties_1 = require("../../../../../../shared/StickyProperties");
function getSpanLabel(type) {
    switch (type) {
        case 'db':
            return 'DB';
        case 'hard-navigation':
            return 'Navigation timing';
        default:
            return type;
    }
}
function getPrimaryType(type) {
    return lodash_1.first(type.split('.'));
}
function StickySpanProperties({ span, totalDuration }) {
    if (!totalDuration) {
        return null;
    }
    const spanName = span.span.name;
    const spanDuration = span.span.duration.us;
    const spanTypeLabel = getSpanLabel(getPrimaryType(span.span.type));
    const stickyProperties = [
        {
            label: 'Name',
            fieldName: 'span.name',
            val: spanName || 'N/A',
            truncated: true,
            width: '50%'
        },
        {
            fieldName: 'span.type',
            label: 'Type',
            val: spanTypeLabel,
            truncated: true,
            widht: '50%'
        },
        {
            fieldName: 'span.duration.us',
            label: 'Duration',
            val: formatters_1.asMillis(spanDuration),
            width: '50%'
        },
        {
            label: '% of transaction',
            val: formatters_1.asPercent(spanDuration, totalDuration),
            width: '50%'
        }
    ];
    return react_1.default.createElement(StickyProperties_1.StickyProperties, { stickyProperties: stickyProperties });
}
exports.StickySpanProperties = StickySpanProperties;
