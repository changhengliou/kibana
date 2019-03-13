"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("isomorphic-fetch");
const lodash_1 = require("lodash");
// @ts-ignore not really worth typing
const metadata_1 = require("ui/metadata");
const url_1 = tslib_1.__importDefault(require("url"));
const chrome_1 = tslib_1.__importDefault(require("../chrome"));
const kfetch_error_1 = require("./kfetch_error");
const interceptors = [];
exports.resetInterceptors = () => (interceptors.length = 0);
exports.addInterceptor = (interceptor) => interceptors.push(interceptor);
async function kfetch(options, { prependBasePath = true } = {}) {
    const combinedOptions = withDefaultOptions(options);
    const promise = requestInterceptors(combinedOptions).then(({ pathname, query, ...restOptions }) => {
        const fullUrl = url_1.default.format({
            pathname: prependBasePath ? chrome_1.default.addBasePath(pathname) : pathname,
            query,
        });
        return fetch(fullUrl, restOptions).then(async (res) => {
            if (res.ok) {
                return res.json();
            }
            throw new kfetch_error_1.KFetchError(res, await getBodyAsJson(res));
        });
    });
    return responseInterceptors(promise);
}
exports.kfetch = kfetch;
// Request/response interceptors are called in opposite orders.
// Request hooks start from the newest interceptor and end with the oldest.
function requestInterceptors(config) {
    return interceptors.reduceRight((acc, interceptor) => {
        return acc.then(interceptor.request, interceptor.requestError);
    }, Promise.resolve(config));
}
// Response hooks start from the oldest interceptor and end with the newest.
function responseInterceptors(responsePromise) {
    return interceptors.reduce((acc, interceptor) => {
        return acc.then(interceptor.response, interceptor.responseError);
    }, responsePromise);
}
async function getBodyAsJson(res) {
    try {
        return await res.json();
    }
    catch (e) {
        return null;
    }
}
function withDefaultOptions(options) {
    return lodash_1.merge({
        method: 'GET',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'kbn-version': metadata_1.metadata.version,
        },
    }, options);
}
exports.withDefaultOptions = withDefaultOptions;
