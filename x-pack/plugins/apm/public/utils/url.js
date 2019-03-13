"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const eui_1 = require("@elastic/eui");
const createHashHistory_1 = tslib_1.__importDefault(require("history/createHashHistory"));
const lodash_1 = require("lodash");
const querystring_1 = tslib_1.__importDefault(require("querystring"));
const react_1 = tslib_1.__importDefault(require("react"));
const react_redux_1 = require("react-redux");
const react_router_dom_1 = require("react-router-dom");
const rison_node_1 = tslib_1.__importDefault(require("rison-node"));
const chrome_1 = tslib_1.__importDefault(require("ui/chrome"));
const url_1 = tslib_1.__importDefault(require("url"));
// Kibana default set in: https://github.com/elastic/kibana/blob/e13e47fc4eb6112f2a5401408e9f765eae90f55d/x-pack/plugins/apm/public/utils/timepicker/index.js#L31-L35
// TODO: store this in config or a shared constant?
const DEFAULT_KIBANA_TIME_RANGE = {
    time: {
        from: 'now-24h',
        mode: 'quick',
        to: 'now'
    }
};
function ViewMLJob({ serviceName, transactionType, location, children = 'View Job' }) {
    const pathname = '/app/ml';
    const hash = '/timeseriesexplorer';
    const jobId = `${serviceName}-${transactionType}-high_mean_response_time`;
    const query = {
        _g: {
            ml: {
                jobIds: [jobId]
            }
        }
    };
    return (react_1.default.createElement(exports.UnconnectedKibanaLink, { location: location, pathname: pathname, hash: hash, query: query, children: children }));
}
exports.ViewMLJob = ViewMLJob;
function toQuery(search) {
    return search ? querystring_1.default.parse(search.slice(1)) : {};
}
exports.toQuery = toQuery;
function fromQuery(query) {
    const encodedQuery = encodeQuery(query, ['_g', '_a']);
    return stringifyWithoutEncoding(encodedQuery);
}
exports.fromQuery = fromQuery;
function encodeQuery(query, exclude = []) {
    return lodash_1.mapValues(query, (value, key) => {
        if (exclude.includes(key)) {
            return encodeURI(value);
        }
        return querystring_1.default.escape(value);
    });
}
exports.encodeQuery = encodeQuery;
function stringifyWithoutEncoding(query) {
    return querystring_1.default.stringify(query, undefined, undefined, {
        encodeURIComponent: (v) => v
    });
}
function risonSafeDecode(value) {
    try {
        const decoded = rison_node_1.default.decode(value);
        return lodash_1.isPlainObject(decoded) ? decoded : {};
    }
    catch (e) {
        return {};
    }
}
function decodeAndMergeG(g, toBeMerged) {
    const decoded = risonSafeDecode(g);
    return { ...DEFAULT_KIBANA_TIME_RANGE, ...decoded, ...toBeMerged };
}
function RelativeLinkComponent({ location, path, query, disabled, ...props }) {
    if (disabled) {
        return react_1.default.createElement(eui_1.EuiLink, Object.assign({ "aria-disabled": "true" }, props));
    }
    // Shorthand for pathname
    const pathname = path || lodash_1.get(props.to, 'pathname') || location.pathname;
    // Add support for querystring as object
    const search = query || lodash_1.get(props.to, 'query')
        ? fromQuery({
            ...toQuery(location.search),
            ...query,
            ...lodash_1.get(props.to, 'query')
        })
        : location.search;
    return (react_1.default.createElement(react_router_dom_1.Link, Object.assign({}, props, { to: { ...location, ...props.to, pathname, search }, className: `euiLink euiLink--primary ${props.className || ''}` })));
}
exports.RelativeLinkComponent = RelativeLinkComponent;
/**
 * NOTE: Use this component directly if you have to use a link that is
 * going to be rendered outside of React, e.g. in the Kibana global toast loader.
 *
 * You must remember to pass in location in that case.
 */
exports.UnconnectedKibanaLink = ({ location, pathname, hash, query = {}, ...props }) => {
    // Preserve current _g and _a
    const currentQuery = toQuery(location.search);
    const g = decodeAndMergeG(currentQuery._g, query._g);
    const nextQuery = {
        ...query,
        _g: rison_node_1.default.encode(g),
        _a: query._a ? rison_node_1.default.encode(query._a) : ''
    };
    const search = stringifyWithoutEncoding(nextQuery);
    const href = url_1.default.format({
        pathname: chrome_1.default.addBasePath(pathname),
        hash: `${hash}?${search}`
    });
    return react_1.default.createElement(eui_1.EuiLink, Object.assign({}, props, { href: href }));
};
const withLocation = react_redux_1.connect(({ location }) => ({ location }), {});
exports.RelativeLink = withLocation(RelativeLinkComponent);
exports.KibanaLink = withLocation(exports.UnconnectedKibanaLink);
// This is downright horrible 😭 💔
// Angular decodes encoded url tokens like "%2F" to "/" which causes the route to change.
// It was supposedly fixed in https://github.com/angular/angular.js/commit/1b779028fdd339febaa1fff5f3bd4cfcda46cc09 but still seeing the issue
function legacyEncodeURIComponent(rawUrl) {
    return rawUrl && encodeURIComponent(rawUrl).replace(/%/g, '~');
}
exports.legacyEncodeURIComponent = legacyEncodeURIComponent;
function legacyDecodeURIComponent(encodedUrl) {
    return encodedUrl && decodeURIComponent(encodedUrl.replace(/~/g, '%'));
}
exports.legacyDecodeURIComponent = legacyDecodeURIComponent;
function ExternalLink(props) {
    return react_1.default.createElement(eui_1.EuiLink, Object.assign({ target: "_blank", rel: "noopener noreferrer" }, props));
}
exports.ExternalLink = ExternalLink;
// Make history singleton available across APM project.
// This is not great. Other options are to use context or withRouter helper
// React Context API is unstable and will change soon-ish (probably 16.3)
// withRouter helper from react-router overrides several props (eg. `location`) which makes it less desireable
exports.history = createHashHistory_1.default();
