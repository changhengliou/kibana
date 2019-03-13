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
const react_1 = tslib_1.__importDefault(require("react"));
const react_dom_1 = require("react-dom");
const global_toast_list_1 = require("./global_toast_list");
const toasts_start_contract_1 = require("./toasts_start_contract");
class ToastsService {
    constructor(params) {
        this.params = params;
    }
    start() {
        const toasts = new toasts_start_contract_1.ToastsStartContract();
        react_dom_1.render(react_1.default.createElement(global_toast_list_1.GlobalToastList, { dismissToast: (toast) => toasts.remove(toast), "toasts$": toasts.get$() }), this.params.targetDomElement);
        return toasts;
    }
    stop() {
        react_dom_1.unmountComponentAtNode(this.params.targetDomElement);
        this.params.targetDomElement.textContent = '';
    }
}
exports.ToastsService = ToastsService;
