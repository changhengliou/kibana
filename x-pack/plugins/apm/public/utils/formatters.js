"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
// tslint:disable-next-line  no-var-requires
const numeral = require('@elastic/numeral');
const UNIT_CUT_OFF = 10 * 1000000; // 10 seconds in microseconds
function asSeconds(value, withUnit = true) {
    const formatted = asDecimal(value / 1000000);
    return `${formatted}${withUnit ? ' s' : ''}`;
}
exports.asSeconds = asSeconds;
function asMillis(value, withUnit = true) {
    const formatted = asInteger(value / 1000);
    return `${formatted}${withUnit ? ' ms' : ''}`;
}
exports.asMillis = asMillis;
function asMillisWithDefault(value) {
    if (value == null) {
        return `N/A`;
    }
    return asMillis(value);
}
exports.asMillisWithDefault = asMillisWithDefault;
exports.getTimeFormatter = lodash_1.memoize((max) => (max > UNIT_CUT_OFF ? asSeconds : asMillis));
function timeUnit(max) {
    return max > UNIT_CUT_OFF ? 's' : 'ms';
}
exports.timeUnit = timeUnit;
/*
 * value: time in microseconds
 */
function asTime(value) {
    return exports.getTimeFormatter(value)(value);
}
exports.asTime = asTime;
function asDecimal(value) {
    return numeral(value).format('0,0.0');
}
exports.asDecimal = asDecimal;
function asInteger(value) {
    return numeral(value).format('0,0');
}
exports.asInteger = asInteger;
function tpmUnit(type) {
    return type === 'request' ? 'rpm' : 'tpm';
}
exports.tpmUnit = tpmUnit;
function asPercent(numerator, denominator = 0, fallbackResult = '') {
    if (denominator === 0) {
        return fallbackResult;
    }
    return numeral(numerator / denominator).format('0.00%');
}
exports.asPercent = asPercent;
