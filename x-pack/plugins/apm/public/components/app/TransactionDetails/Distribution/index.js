"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const eui_1 = require("@elastic/eui");
const d3_1 = tslib_1.__importDefault(require("d3"));
const react_1 = tslib_1.__importStar(require("react"));
const formatters_1 = require("../../../../utils/formatters");
const url_1 = require("../../../../utils/url");
// @ts-ignore
const Histogram_1 = tslib_1.__importDefault(require("../../../shared/charts/Histogram"));
const EmptyMessage_1 = require("../../../shared/EmptyMessage");
function getFormattedBuckets(buckets, bucketSize) {
    if (!buckets) {
        return [];
    }
    return buckets.map(({ sample, count, key }) => {
        return {
            sample,
            x0: key,
            x: key + bucketSize,
            y: count,
            style: { cursor: count > 0 && sample ? 'pointer' : 'default' }
        };
    });
}
exports.getFormattedBuckets = getFormattedBuckets;
class Distribution extends react_1.Component {
    constructor() {
        super(...arguments);
        this.formatYShort = (t) => {
            return `${t} ${unitShort(this.props.urlParams.transactionType)}`;
        };
        this.formatYLong = (t) => {
            return `${t} ${unitLong(this.props.urlParams.transactionType, t)}`;
        };
    }
    render() {
        const { location, distribution, urlParams } = this.props;
        const buckets = getFormattedBuckets(distribution.buckets, distribution.bucketSize);
        const isEmpty = distribution.totalHits === 0;
        const xMax = d3_1.default.max(buckets, d => d.x) || 0;
        const timeFormatter = formatters_1.getTimeFormatter(xMax);
        const unit = formatters_1.timeUnit(xMax);
        if (isEmpty) {
            return react_1.default.createElement(EmptyMessage_1.EmptyMessage, { heading: "No transactions were found." });
        }
        const bucketIndex = buckets.findIndex(bucket => bucket.sample != null &&
            bucket.sample.transactionId === urlParams.transactionId &&
            bucket.sample.traceId === urlParams.traceId);
        return (react_1.default.createElement("div", null,
            react_1.default.createElement(eui_1.EuiTitle, { size: "s" },
                react_1.default.createElement("h5", null,
                    "Response time distribution",
                    ' ',
                    react_1.default.createElement(eui_1.EuiToolTip, { content: react_1.default.createElement("div", null,
                            react_1.default.createElement(eui_1.EuiText, null,
                                react_1.default.createElement("strong", null, "Sampling")),
                            react_1.default.createElement(eui_1.EuiText, null, "Each bucket will show a sample transaction. If there's no sample available, it's most likely because of the sampling limit set in the agent configuration.")) },
                        react_1.default.createElement(eui_1.EuiIcon, { type: "questionInCircle" })))),
            react_1.default.createElement(Histogram_1.default, { buckets: buckets, bucketSize: distribution.bucketSize, bucketIndex: bucketIndex, onClick: (bucket) => {
                    if (bucket.sample && bucket.y > 0) {
                        url_1.history.replace({
                            ...location,
                            search: url_1.fromQuery({
                                ...url_1.toQuery(location.search),
                                transactionId: bucket.sample.transactionId,
                                traceId: bucket.sample.traceId
                            })
                        });
                    }
                }, formatX: timeFormatter, formatYShort: this.formatYShort, formatYLong: this.formatYLong, verticalLineHover: (bucket) => bucket.y > 0 && !bucket.sample, backgroundHover: (bucket) => bucket.y > 0 && bucket.sample, tooltipHeader: (bucket) => `${timeFormatter(bucket.x0, false)} - ${timeFormatter(bucket.x, false)} ${unit}`, tooltipFooter: (bucket) => !bucket.sample && 'No sample available for this bucket' })));
    }
}
exports.Distribution = Distribution;
function unitShort(type) {
    return type === 'request' ? 'req.' : 'trans.';
}
function unitLong(type, count) {
    const suffix = count > 1 ? 's' : '';
    return type === 'request' ? `request${suffix}` : `transaction${suffix}`;
}
